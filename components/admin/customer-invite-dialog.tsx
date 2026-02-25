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
import { useCreateInvite } from "@/hooks/use-customer";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  companyName: z.string().min(1, "Enter company name"),
  phone: z.string().min(1, "Enter phone"),
  email: z.email("Enter valid email"),
  message: z.string().min(1, "Enter message"),
});

export const CustomerInviteDialog = () => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useCreateInvite();

  const form = useAppForm({
    defaultValues: {
      name: "",
      companyName: "",
      phone: "",
      email: "",
      message: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const [firstName, lastName] = value.name.split(" ");

      mutate(
        {
          ...value,
          firstName,
          lastName,
          status: "invited",
        },
        {
          onSuccess: () => {
            toast.success("Invitation sent successfully.");
            setOpen(false);
            form.reset();
          },
          onError: (err) => toast.error(err.message),
        }
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="xl" className="rounded-xl ml-auto min-w-32 px-8">
          <PlusCircle /> Invite Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg py-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Invite Customer
          </DialogTitle>
          <DialogDescription className="text-base">
            Send an invitation to the business to join as a customer and get
            started.
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
                  disabled={isSubmitting || !canSubmit || isPending}
                >
                  {isSubmitting || isPending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Send Invitation"
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
