"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Loader, Send, SendHorizonal } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Textarea } from "../ui/textarea";
import { createInvite } from "@/server/customer";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  companyName: z.string().min(1, "Enter company name"),
  phone: z.string().min(1, "Enter phone"),
  email: z.email("Enter valid email"),
  type: z.string().min(1, "Enter message"),
  message: z.string(),
});

const CONFIG = {
  invitation: {
    button: "Invite",
    title: "Invite Customer",
    description: "Invite a business to become a customer.",
    success: "Customer invited successfully",
  },
  request: {
    button: "Assign Access",
    title: "Catalog Access",
    description:
      "Assign catalog access to a customer, allowing them to view your product catalog.",
    success: "Catalog access granted.",
  },
};

export const CustomerInviteDialog = ({
  type,
}: {
  type: "invitation" | "request";
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const config = CONFIG[type];

  const form = useAppForm({
    defaultValues: {
      name: "",
      companyName: "",
      phone: "",
      email: "",
      message: "",
      type: type as string,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const [firstName = "", lastName = ""] = value.name.split(" ");

      const { success, error } = await createInvite({
        ...value,
        firstName,
        lastName,
      });
      if (success) {
        toast.success(config.success);
        queryClient.invalidateQueries({ queryKey: ["invites"] });
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setOpen(false);
        form.reset();
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xl" className="rounded-xl md:w-auto">
          <Send />
          <span className="hidden md:inline">{config.button}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="-mx-4 -my-1 no-scrollbar max-h-[min(480px,80vh)] overflow-y-auto  px-4 py-1">
            <FieldGroup className="grid grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    label="Name"
                    className="col-span-2 **:data-[slot=input]:rounded-xl"
                  />
                )}
              />

              <form.AppField
                name="companyName"
                children={(field) => (
                  <field.TextField
                    label="Company Name"
                    className="col-span-2 **:data-[slot=input]:rounded-xl"
                  />
                )}
              />

              <form.AppField
                name="phone"
                children={(field) => (
                  <field.TextField
                    label="Phone"
                    className="**:data-[slot=input]:rounded-xl"
                  />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email"
                    className="**:data-[slot=input]:rounded-xl"
                  />
                )}
              />
              <form.Field
                name="message"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field className="col-span-2">
                      <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 resize-none rounded-xl"
                      />
                      <FieldDescription>
                        Enter any additional message you would like to include
                        in the email.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </div>
          <Field className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <Button
              variant="outline"
              size="xl"
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl"
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
                    <Loader className="animate-spin" />
                  ) : (
                    config.button
                  )}
                </Button>
              )}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};
