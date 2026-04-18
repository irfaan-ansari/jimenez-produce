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
import { Loader, PlusCircle, Send, SendHorizonal } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { createInvite } from "@/server/customer";
import { useQueryClient } from "@tanstack/react-query";
import { OPEN_POSITIONS } from "@/lib/constants/web";
import { inviteCandidate } from "@/server/job";

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  phone: z.string().min(1, "Enter phone"),
  email: z.email("Enter valid email"),
  position: z.string().min(1, "Select position"),
  message: z.string(),
});

const POSOTIONS = OPEN_POSITIONS.map((p) => ({
  value: p.href,
  label: p.title,
}));

export const InviteCandidate = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      position: "",
      message: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const [firstName = "", lastName = ""] = value.name.split(" ");

      const selected = POSOTIONS.find((p) => p.label === value.position);

      const { success, error } = await inviteCandidate({
        ...value,
        firstName,
        lastName,
        positionSlug: selected?.value || "",
      });

      if (success) {
        toast.success("Invited successfully");
        queryClient.invalidateQueries({ queryKey: ["job-invites"] });
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
        <Button size="xl" className="ml-auto rounded-xl">
          <Send /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl ring-ring/10 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Invite Candidate
          </DialogTitle>
          <DialogDescription className="text-base">
            Invite candidate to apply for a open position
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
              <form.AppField
                name="position"
                children={(field) => (
                  <field.SelectField
                    label="Position"
                    className="col-span-2 **:data-[slot=input]:rounded-xl"
                    options={POSOTIONS.map((l) => l.label)}
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
                    "Invite"
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
