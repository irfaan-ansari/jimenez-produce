"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import z from "zod";
import { Input } from "./ui/input";
import { Loader } from "lucide-react";

import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { UserSelectType } from "@/lib/db/schema";
import { useAppForm } from "@/hooks/form-context";
import { Button } from "./ui/button";

import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Enter name"),
  email: z.string(),
});

export const ProfileDialog = <T,>({
  user,
  children,
}: {
  user: Partial<UserSelectType>;
  children: React.ReactNode;
}) => {
  const form = useAppForm({
    defaultValues: {
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await authClient.updateUser(
        { name: value.name },
        {
          onSuccess: () => {
            toast.success("User created successfully!");
          },
          onError: (err) => {
            toast.error(err.error.message || "Something went wrong!");
          },
        }
      );
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {user.name}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className=""
        >
          <FieldGroup>
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={true}
                      className="rounded-xl"
                    />

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-xl"
              >
                Cancel
              </Button>
            </DialogClose>
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
                  {isSubmitting ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              )}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};
