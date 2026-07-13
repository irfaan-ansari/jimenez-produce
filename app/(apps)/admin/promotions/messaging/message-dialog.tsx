"use client";

import { ChevronsUpDown, Loader2, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup } from "@/components/ui/field";
import React from "react";
import {
  AppDialog,
  AppDialogContent,
  AppDialogHeader,
  AppDialogTitle,
  AppDialogTrigger,
} from "@/components/app-dialog";
import z from "zod";
import { CustomersSelector } from "@/components/admin/customers-selector";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { createMessage } from "@/server/message";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    audienceType: z.enum(["team", "user", "custom"]),
    audienceTarget: z.enum(["all", "selected"]),
    selectedTargets: z.array(z.string()),
    phoneNumbers: z.string(),
    messageContent: z.string().min(1, "Message is required"),
  })
  .superRefine((data, ctx) => {
    if (
      data.audienceTarget === "selected" &&
      data.selectedTargets.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["selectedTargets"],
        message: "Select at least one customer.",
      });
    }

    if (data.audienceType === "custom" && data.phoneNumbers.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumbers"],
        message: "Enter at least one phone number.",
      });
    }
  });

export function MessageDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      audienceType: "team" as "team" | "user" | "custom",
      audienceTarget: "all" as "all" | "selected",
      selectedTargets: [] as string[],
      phoneNumbers: "",
      messageContent: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        audienceType: value.audienceType,
        audienceTarget: value.audienceTarget,
        selectedTargets: value.selectedTargets,
        content: value.messageContent,
        phoneNumbers: value.phoneNumbers
          .split(",")
          .map((phone) => phone.trim())
          .filter(Boolean),
      };

      const toastId = toast.loading("Please wait...");

      const { success } = await createMessage(payload);
      if (success) {
        toast.success("Sending messages...", {
          id: toastId,
        });
        form.reset();
        setOpen(false);
      } else {
        toast.error("Failed to send messages.", { id: toastId });
      }
    },
  });
  console.log(form.state);
  return (
    <AppDialog open={open} onOpenChange={setOpen}>
      <AppDialogTrigger asChild>{children}</AppDialogTrigger>

      <AppDialogContent className="sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="gap-6 flex flex-col h-[max(600px,80svh)]"
        >
          <AppDialogHeader>
            <AppDialogTitle className="text-lg font-semibold">
              New Message
            </AppDialogTitle>
          </AppDialogHeader>
          <FieldGroup className="flex-1 overflow-auto no-scrollbar">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Message Name"
                  placeholder="Weekend offer"
                  description="Used internally to identify this campaign."
                />
              )}
            />
            <form.AppField
              name="audienceType"
              children={(field) => (
                <field.RadioField
                  label="Audience"
                  options={[
                    {
                      label: "Customers",
                      value: "team",
                    },
                    {
                      label: "Custom Phone Numbers",
                      value: "custom",
                    },
                  ]}
                />
              )}
            />

            <form.Subscribe
              selector={(state) => ({
                type: state.values.audienceType,
                target: state.values.audienceTarget,
              })}
              children={({ type, target }) => {
                return (
                  <>
                    {/* audience type */}
                    <form.AppField
                      name="audienceTarget"
                      children={(field) => (
                        <field.RadioField
                          className={type === "custom" ? "hidden" : ""}
                          label="Recipient"
                          options={[
                            {
                              label: "All",
                              value: "all",
                            },
                            {
                              label: "Selected",
                              value: "selected",
                            },
                          ]}
                        />
                      )}
                    />

                    {/* audience custom */}
                    <form.AppField
                      name="phoneNumbers"
                      children={(field) => (
                        <field.TextAreaField
                          className={type !== "custom" ? "hidden" : ""}
                          label="Phone Numbers"
                          placeholder={`9876543210,9812345678`}
                          description="Enter comma-separated phone numbers without the country code"
                        />
                      )}
                    />

                    {/* audience selector */}
                    <form.Field
                      name="selectedTargets"
                      mode="array"
                      children={(field) => {
                        const teams = field.state.value;
                        return (
                          <div
                            className={
                              type === "custom" || target !== "selected"
                                ? "hidden"
                                : "space-y-2"
                            }
                          >
                            <Label htmlFor="customer-selector">
                              Select Customers
                            </Label>
                            <CustomersSelector
                              selected={
                                field.state.value?.map((i) => ({
                                  id: i,
                                })) ?? []
                              }
                              setSelectedChange={(value) => {
                                const index = field.state.value.findIndex(
                                  (s) => s === value.id,
                                );

                                if (index >= 0) {
                                  field.removeValue(index);
                                } else {
                                  field.pushValue(value.id);
                                }
                              }}
                            >
                              <Button
                                id="customer-selector"
                                variant="outline"
                                size="lg"
                                type="button"
                                className="justify-start w-full text-muted-foreground"
                              >
                                <Plus />
                                <span className="flex-1 text-left">
                                  Select customers...
                                </span>
                                {teams.length > 0 && (
                                  <Badge>{teams.length + " selected"}</Badge>
                                )}
                                <ChevronsUpDown />
                              </Button>
                            </CustomersSelector>
                          </div>
                        );
                      }}
                    />
                  </>
                );
              }}
            />

            <div className="space-y-3">
              <div className="relative">
                <form.AppField
                  name="messageContent"
                  children={(field) => (
                    <field.TextAreaField
                      label="Message Content"
                      placeholder={`Hi {{name}},

Check out our latest offers.`}
                    />
                  )}
                />
                <Button
                  size="icon-sm"
                  variant="secondary"
                  disabled
                  className="absolute right-2 bottom-2"
                >
                  <Sparkles />
                </Button>
              </div>
            </div>
          </FieldGroup>
          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end  sm:[&>*]:w-32">
            <Button
              variant="outline"
              size="xl"
              type="button"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={({ isSubmitting, canSubmit }) => ({
                isSubmitting,
                canSubmit,
              })}
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>Send Message</>
                  )}
                </Button>
              )}
            />
          </Field>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}
