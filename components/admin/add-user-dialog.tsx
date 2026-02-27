"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Field, FieldGroup } from "../ui/field";
import { useAppForm } from "@/hooks/form-context";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import { useState } from "react";
import { useStore } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    name: z.string().min(1, "Enter name"),
    email: z.email("Enter email"),
    password: z.string().min(8, "Minimum 8 characters required"),
    confirmPassword: z.string().min(8, "Minimum 8 characters required"),
    role: z.string().min(1, "Select role"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AddUserDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "User",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await authClient.admin.createUser(
        { ...value, role: value.role.toLowerCase() as any },
        {
          onSuccess: () => {
            toast.success("User account created successfully!");
            setOpen(false);
            router.refresh();
            form.reset();
          },
          onError: (err) => {
            toast.error(err.error.message || "Something went wrong");
          },
        }
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add new user
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className=""
        >
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
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  className="**:data-[slot=input]:rounded-xl col-span-2"
                />
              )}
            />
            <form.AppField
              name="role"
              children={(field) => (
                <field.SelectField
                  label="Role"
                  className="**:rounded-xl col-span-2"
                  options={["User", "Admin"]}
                />
              )}
            />
            <form.AppField
              name="password"
              children={(field) => (
                <field.TextField
                  label="Password"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />

            <form.AppField
              name="confirmPassword"
              children={(field) => (
                <field.TextField
                  label="Confirm Password"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
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
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Add User"
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
