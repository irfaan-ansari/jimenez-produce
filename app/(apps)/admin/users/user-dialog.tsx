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
import { Loader, Plus, Trash2 } from "lucide-react";
import { Field, FieldGroup } from "@/components/ui/field";

import { useComboboxAnchor } from "@/components/ui/combobox";
import { Role, UserWithMember } from "@/lib/types";
import { useTeams } from "@/hooks/use-teams";
import { useStore } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/form-context";
import { signupWithOrganization } from "@/server/auth";
import { useQueryClient } from "@tanstack/react-query";
import { capitalizeWords } from "@/lib/utils";
import { CustomersSelector } from "@/components/admin/customers-selector";

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

interface CallBackAgrs {
  id: string;
  name: string;
  phoneNumber: string | null | undefined;
  email: string;
}
export const UserDialog = ({
  data,
  children,
  callback,
}: {
  children: React.ReactNode;
  data?: UserWithMember;
  callback?: (arg: CallBackAgrs) => void;
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
      const role = value.role.toLowerCase() as Role;
      const toastId = toast.loading("Please wait...");

      const { error, data: createdUser } = await signupWithOrganization({
        ...value,
        accountType: role === "customer" ? "customer" : "admin",
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
          className="flex h-full max-h-[calc(100svh-10rem)] flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create user</DialogTitle>
            <DialogDescription>
              Enter user details to add them to the system.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="no-scrollbar grid flex-1 grid-cols-2 overflow-y-auto">
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
            <div className={role === "Sales" ? "lg:col-span-2" : "hidden"}>
              <p className="mb-2 font-medium">Accounts</p>
              <form.Field
                name="teams"
                mode="array"
                children={(field) => {
                  const teams = field.state.value;
                  return (
                    <div className="space-y-2 rounded-lg border-l py-2 pl-2">
                      {teams.length > 0 ? (
                        <div className="space-y-1">
                          {teams?.map((team, i) => (
                            <div
                              key={team.id}
                              className="flex items-center rounded-lg border bg-secondary/20 p-2"
                            >
                              <div className="flex-1 space-x-4">
                                <span>{team.name}</span>
                              </div>
                              <Button
                                size="icon-xs"
                                type="button"
                                variant="destructive"
                                onClick={(e) => {
                                  e.preventDefault();
                                  field.removeValue(i);
                                }}
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <CustomersSelector
                        selected={field.state.value}
                        setSelectedChange={(value) => {
                          const index = field.state.value.findIndex(
                            (s) => s.id === value.id,
                          );
                          if (index >= 0) {
                            field.removeValue(index);
                          } else {
                            field.pushValue(value);
                          }
                        }}
                      >
                        <Button variant="outline" size="sm">
                          <Plus /> Accounts
                        </Button>
                      </CustomersSelector>
                    </div>
                  );
                }}
              />
            </div>
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
