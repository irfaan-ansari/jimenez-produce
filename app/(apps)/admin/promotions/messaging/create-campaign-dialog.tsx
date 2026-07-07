"use client";

import { ChevronsUpDown, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";

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
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    recipient: z.enum(["all", "selected", "custom"]),
    customers: z.array(z.string()),
    phoneNumbers: z.string(),
    messageContent: z.string().min(1, "Message is required"),
  })
  .superRefine((data, ctx) => {
    if (data.recipient === "selected" && data.customers.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["customers"],
        message: "Select at least one customer.",
      });
    }

    if (data.recipient === "custom" && data.phoneNumbers.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["phoneNumbers"],
        message: "Enter at least one phone number.",
      });
    }
  });

export function CreateCampaignDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const form = useAppForm({
    defaultValues: {
      name: "",
      recipient: "all" as "selected" | "custom" | "all",
      customers: [] as string[],
      phoneNumbers: "",
      messageContent: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        phoneNumbers: value.phoneNumbers
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean),
      };

      console.log(payload);
    },
  });

  const variables = [
    { label: "First Name", value: "{{first_name}}" },
    { label: "Last Name", value: "{{last_name}}" },
    { label: "Phone", value: "{{phone}}" },
    { label: "Email", value: "{{email}}" },
    { label: "Order ID", value: "{{order_id}}" },
    { label: "Order Total", value: "{{order_total}}" },
  ];

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
          <FieldGroup className="flex-1 overflow-auto">
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
              name="recipient"
              children={(field) => (
                <field.RadioField
                  label="Send To"
                  options={[
                    {
                      label: "All Customers",
                      description: "Send to all customers.",
                      value: "all",
                    },
                    {
                      label: "Selected Customers",
                      description: "Choose specific customers.",
                      value: "selected",
                    },
                    {
                      label: "Custom Numbers",
                      description: "Enter phone numbers manually.",
                      value: "custom",
                    },
                  ]}
                />
              )}
            />

            <form.Subscribe
              selector={(state) => state.values.recipient}
              children={(value) => (
                <>
                  <form.AppField
                    name="phoneNumbers"
                    children={(field) => (
                      <field.TextAreaField
                        className={value !== "custom" ? "hidden" : ""}
                        label="Phone Numbers"
                        placeholder={`+19876543210
+19812345678
+18888888888`}
                      />
                    )}
                  />
                  <form.Field
                    name="customers"
                    mode="array"
                    children={(field) => {
                      const teams = field.state.value;
                      return (
                        <div
                          className={
                            value !== "selected" ? "hidden" : "space-y-2"
                          }
                        >
                          <Label htmlFor="customer-selector">
                            Select Customers
                          </Label>
                          <CustomersSelector
                            selected={field.state.value.map((i) => ({ id: i }))}
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
              )}
            />

            <div className="space-y-3">
              <div className="relative">
                <form.AppField
                  name="messageContent"
                  children={(field) => (
                    <field.TextAreaField
                      label="Message Content"
                      placeholder={`Hi {{first_name}},

Your order {{order_id}} is ready for pickup.`}
                      description=" You can insert variables using the buttons below."
                    />
                  )}
                />
                <Button
                  size="icon-sm"
                  variant="secondary"
                  disabled
                  className="absolute right-2 bottom-9"
                >
                  <Sparkles />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <Badge
                    key={variable.value}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    {variable.label}
                  </Badge>
                ))}
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
