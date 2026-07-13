"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getSession } from "./auth";
import { twilioSendMessage } from "@/lib/twilio";
import { messageRecipients, messages } from "@/lib/db/schema";
import { extractVariables, renderTemplate } from "@/lib/sms/render";
import { handleAction } from "@/lib/helper/error-handler";
import { waitUntil } from "@vercel/functions";

type Message = {
  name: string;
  content: string;
  audienceType: string;
  audienceTarget: string;
  selectedTargets?: string[];
  phoneNumbers?: string[];
};

export const createMessage = handleAction(async (payload: Message) => {
  const auth = await getSession();

  if (!auth) throw new Error("Authentication required.");

  const { activeOrganizationId, userId } = auth.session;
  const recipients = await getRecipients(payload, activeOrganizationId!);

  const [message] = await db
    .insert(messages)
    .values({
      ...payload,
      organizationId: activeOrganizationId!,
      createdBy: userId!,
      status: "processing",
      metadata: {
        total: recipients.length,
      },
    })
    .returning();

  if (recipients.length) {
    await db.insert(messageRecipients).values(
      recipients.map((recipient) => ({
        messageId: message.id,
        ...recipient,
        content: renderTemplate(payload.content, recipient.variables),
      })),
    );
  }
  waitUntil(processMessages(message.id));
  return message;
});

/**
 * get recipients
 * @param payload
 * @param organizationId
 * @returns
 */
export async function getRecipients(payload: Message, organizationId: string) {
  if (payload.audienceType === "custom") {
    return (payload.phoneNumbers ?? []).map((phoneNumber) => ({
      entity: "custom",
      entityId: null,
      phoneNumber,
      variables: {},
    }));
  }

  if (payload.audienceType === "team") {
    const teams = await db.query.team.findMany({
      where: (t, { and, eq, inArray }) =>
        and(
          eq(t.organizationId, organizationId),
          payload.audienceTarget === "selected"
            ? inArray(t.id, payload.selectedTargets ?? [])
            : undefined,
        ),
    });

    return teams
      .filter((team) => team.phone)
      .map((team) => ({
        entity: "team",
        entityId: team.id,
        phoneNumber: team.phone!,
        variables: extractVariables(payload.content, {
          name: team.name,
          phone: team.phone,
          manager: team.managerName,
        }),
      }));
  }

  if (payload.audienceType === "user") {
    const members = await db.query.member.findMany({
      where: (m, { and, eq, inArray }) =>
        and(
          eq(m.organizationId, organizationId),
          payload.audienceTarget === "selected"
            ? inArray(m.userId, payload.selectedTargets ?? [])
            : undefined,
        ),
      with: {
        user: true,
      },
    });

    return members
      .filter((member) => member.user.phoneNumber)
      .map((member) => ({
        entity: "member",
        entityId: member.userId,
        phoneNumber: member.user.phoneNumber!,
        variables: extractVariables(payload.content, {
          name: member.user.name,
          phone: member.user.phoneNumber,
        }),
      }));
  }
  return [];
}

/**
 * process messages using wait until
 * @param messageId
 * @returns
 */
export const processMessages = async (messageId: number) => {
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
            body: recipient.content,
          });

          await db
            .update(messageRecipients)
            .set({
              providerSid: result?.sid,
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

  await db
    .update(messages)
    .set({
      status: "completed",
      metadata: {
        ...message?.metadata,
        sent,
        failed,
      },
    })
    .where(eq(messages.id, message.id));

  return {
    total: message.recipients.length,
    sent,
    failed,
  };
};
