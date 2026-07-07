"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { twilioSendMessage } from "@/lib/twilio";
import { messageRecipients, messages } from "@/lib/db/schema";

type Message = {
  name: string;
  content: string;
  audienceType: string;
  audienceTarget: string;
  selectedTargets?: string[];
  phoneNumbers?: string[];
};

export const createMessage = async (payload: Message) => {
  const auth = await getSession();

  if (!auth) throw new Error("Authentication required.");

  const { activeOrganizationId, userId } = auth.session;

  const phoneNumbers = payload.phoneNumbers ?? [];
  const selectedTargets = payload.selectedTargets ?? [];

  if (!payload.content.trim()) {
    throw new Error("Message content is required.");
  }

  if (payload.audienceType === "custom" && !phoneNumbers.length) {
    throw new Error("At least one phone number is required.");
  }

  //   create message
  const [result] = await db
    .insert(messages)
    .values({
      ...payload,
      organizationId: activeOrganizationId!,
      createdBy: userId!,
      status: "processing",
    })
    .returning();

  let recipients: {
    entity: string;
    entityId: string | null;
    phoneNumber: string;
  }[] = [];

  if (payload.audienceType === "custom") {
    recipients = phoneNumbers.map((phoneNumber) => ({
      entity: "custom",
      entityId: null,
      phoneNumber,
    }));
  } else {
    const teams = await db.query.team.findMany({
      where: (c, { and, eq, inArray }) =>
        and(
          eq(c.organizationId, activeOrganizationId!),
          payload.audienceTarget === "selected"
            ? inArray(c.id, selectedTargets)
            : undefined,
        ),
    });

    recipients = teams
      .filter((c) => c.phone)
      .map((team) => ({
        entity: payload.audienceType,
        entityId: team.id,
        phoneNumber: team.phone!,
      }));
  }

  if (recipients.length) {
    await db.insert(messageRecipients).values(
      recipients.map((recipient) => ({
        messageId: result.id,
        ...recipient,
      })),
    );
  }
  return result;
};

export const sendMessage = async (messageId: number) => {
  const message = await db.query.messages.findFirst({
    where: (m, { eq }) => eq(m.id, messageId),
    with: {
      recipients: true,
    },
  });

  if (!message) {
    throw new Error("Message not found.");
  }

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    message.recipients
      .filter((recipient) => recipient.status === "pending")
      .map(async (recipient) => {
        try {
          const result = await twilioSendMessage({
            phoneNumber: recipient.phoneNumber,
            body: message.content,
          });

          await db
            .update(messageRecipients)
            .set({
              providerSid: result.sid,
              status: "sent",
              error: null,
            })
            .where(eq(messageRecipients.id, recipient.id));

          sent++;
        } catch (error) {
          await db
            .update(messageRecipients)
            .set({
              status: "failed",
              error: error instanceof Error ? error.message : "Unknown error",
            })
            .where(eq(messageRecipients.id, recipient.id));

          failed++;
        }
      }),
  );

  const status = failed === 0 ? "sent" : sent === 0 ? "failed" : "partial";

  await db
    .update(messages)
    .set({
      status,
    })
    .where(eq(messages.id, message.id));

  return {
    total: message.recipients.length,
    sent,
    failed,
  };
};

export async function renderTemplate(
  template: string,
  variables: Record<string, string | number | null | undefined>,
) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const value = variables[key];
    return value == null ? "" : String(value);
  });
}
