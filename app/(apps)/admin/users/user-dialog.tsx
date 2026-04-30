"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import z from "zod";
import React from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Role, UserWithMember } from "@/lib/types";
import { useTeams } from "@/hooks/use-teams";
import { useStore } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/form-context";
import { signupWithOrganization } from "@/server/auth";
import { useQueryClient } from "@tanstack/react-query";
import { capitalizeWords } from "@/lib/utils";

const schema = z
  .object({
    name: z.string().min(1, "Enter name"),
    email: z.email("Enter email"),
    phone: z.string().length(10, "Enter valid phone number"),
    password: z.string().min(8, "Minimum 8 characters required"),
    confirmPassword: z.string().min(8, "Minimum 8 characters required"),
    role: z.string().min(1, "Select role"),
    accountType: z.string(),
    teams: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UserDialog = ({
  data,
  children,
  callback,
}: {
  children: React.ReactNode;
  data?: UserWithMember;
  callback?: (arg: {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
  }) => void;
}) => {
  const anchor = useComboboxAnchor();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: teams } = useTeams();

  const form = useAppForm({
    defaultValues: {
      name: data?.name ?? "",
      email: data?.email ?? "",
      phone: data?.phoneNumber ?? "",
      password: "",
      confirmPassword: "",
      role: capitalizeWords(data?.member?.role ?? "Member"),
      accountType: data?.accountType ?? "admin",
      teams: [] as { id: string; name: string }[],
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      // signup the user and add to current organization as member
      const role = value.role.toLowerCase() as Role;
      const toastId = toast.loading("Please wait...");

      const { error, data: createdUser } = await signupWithOrganization({
        ...value,
        role,
        phoneNumber: value.phone,
      });

      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        setOpen(false);
        callback?.(createdUser);
        form.reset();
        toast.success("User added successfully", { id: toastId });
      }

      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const role = useStore(form.store, (state) => state.values.role);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl ring-ring/10 sm:max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create user</DialogTitle>
            <DialogDescription>
              Enter user details to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="grid flex-1 grid-cols-2">
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField
                  label="Name"
                  placeholder="John"
                  className="col-span-2 **:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="phone"
              children={(field) => (
                <field.PhoneField
                  label="Phone"
                  placeholder="xxx-xxx-xxxx"
                  className="col-span-2 **:data-[slot=input]:rounded-xl lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="email"
              children={(field) => (
                <field.TextField
                  label="Email"
                  placeholder="name@email.com"
                  className="col-span-2 **:data-[slot=input]:rounded-xl lg:col-span-1"
                />
              )}
            />
            <form.AppField
              name="role"
              children={(field) => (
                <field.SelectField
                  label="Role"
                  className="col-span-2 **:rounded-xl"
                  options={["Admin", "Member", "Sales", "Manager", "Customer"]}
                />
              )}
            />
            <form.Field
              name="teams"
              mode="array"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field
                    data-invalid={isInvalid}
                    className={role === "Sales" ? "col-span-2" : "hidden"}
                  >
                    <FieldLabel htmlFor={field.name}>
                      Select accounts
                    </FieldLabel>
                    <Combobox
                      items={teams?.data ?? []}
                      multiple
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      itemToStringValue={(team) => team.name}
                      modal={false}
                      name={field.name}
                      autoHighlight
                    >
                      <ComboboxChips
                        className="min-h-11 w-full rounded-xl"
                        ref={anchor}
                      >
                        <ComboboxValue>
                          {field.state.value.map((item) => (
                            <ComboboxChip key={item.id}>
                              {item.name}
                            </ComboboxChip>
                          ))}
                        </ComboboxValue>
                        <ComboboxChipsInput placeholder="Select accounts" />
                      </ComboboxChips>
                      <ComboboxContent
                        anchor={anchor}
                        className="pointer-events-auto"
                      >
                        <ComboboxEmpty>No account found.</ComboboxEmpty>
                        <ComboboxList>
                          {(team) => (
                            <ComboboxItem key={team.id} value={team}>
                              {team.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldDescription>
                      Select accounts this user can manage
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.AppField
              name="password"
              children={(field) => (
                <field.PasswordField
                  label="Password"
                  placeholder="••••••••"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
            <form.AppField
              name="confirmPassword"
              children={(field) => (
                <field.PasswordField
                  label="Confirm Password"
                  placeholder="••••••••"
                  className="**:data-[slot=input]:rounded-xl"
                />
              )}
            />
          </FieldGroup>

          <Field className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
            <DialogClose asChild>
              <Button
                variant="outline"
                size="xl"
                type="button"
                className="rounded-lg"
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
                  className="rounded-lg"
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
