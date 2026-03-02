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
import { useState } from "react";
import { Button } from "../ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Loader, PlusCircle } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { createInvite } from "@/server/customer";

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  companyName: z.string().min(1, "Enter company name"),
  phone: z.string().min(1, "Enter phone"),
  email: z.email("Enter valid email"),
  type: z.string().min(1, "Enter message"),
  message: z.string().min(1, "Enter message"),
});

const CONFIG = {
  invitation: {
    button: "Invite Customer",
    title: "Customer Invitations",
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
      const [firstName, lastName] = value.name.split(" ");

      const { success, error } = await createInvite({
        ...value,
        firstName,
        lastName,
      });
      if (success) {
        toast.success(config.success);
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
        <Button size="xl" className="rounded-xl ml-auto min-w-32 px-8">
          <PlusCircle /> {config.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg py-8">
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
          <div className="no-scrollbar -mx-4 max-h-[min(400px,60vh)] -my-1 py-1  overflow-y-auto px-4">
            <FieldGroup className="grid grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    label="Name"
                    className="**:data-[slot=input]:rounded-xl col-span-2"
                  />
                )}
              />

              <form.AppField
                name="companyName"
                children={(field) => (
                  <field.TextField
                    label="Company Name"
                    className="**:data-[slot=input]:rounded-xl col-span-2"
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
          <Field className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
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
