"use client";

import {
  Field,
  FieldSet,
  FieldError,
  FieldLabel,
  FieldTitle,
  FieldGroup,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import React from "react";
import { toast } from "sonner";
import { useState } from "react";
import { useUsers } from "@/hooks/use-teams";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { UserDialog } from "../users/user-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader, Plus, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyComponent } from "@/components/admin/placeholder-component";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const AddUserDialog = ({
  teamId,
  children,
}: {
  children: React.ReactNode;
  teamId: string;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    data: users,
    isPending,
    isError,
    error,
  } = useUsers({
    q: searchValue,
    accountType: "customer",
  });

  const form = useAppForm({
    defaultValues: {
      userId: "",
    },
    validators: {
      onSubmit: ({ formApi, value }) => {
        if (!value.userId) {
          return {
            fields: {
              userId: [{ message: "Select user" }],
            },
          };
        }
        return null;
      },
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      const { error } = await authClient.organization.addTeamMember({
        teamId,
        userId: value.userId,
      });

      if (error) {
        toast.error(error?.message, { id: toastId });
      } else {
        setOpen(false);
        form.reset();
        toast.success("User added successfully", { id: toastId });
      }

      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

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
            <DialogTitle className="text-xl font-bold">Select user</DialogTitle>
            <DialogDescription>
              Select user to add in this customer account.
            </DialogDescription>
          </DialogHeader>

          {/* search box */}
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <UserDialog
                //@ts-expect-error
                data={{ member: { role: "customer" }, accountType: "customer" }}
                callback={(createdUser) => {
                  form.setFieldValue("userId", createdUser.id);
                }}
              >
                <InputGroupButton
                  type="button"
                  size="icon-sm"
                  variant="default"
                >
                  <Plus />
                </InputGroupButton>
              </UserDialog>
            </InputGroupAddon>
          </InputGroup>

          <FieldGroup className="flex-1">
            <form.Field
              name="userId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <FieldSet>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <RadioGroup
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      className="gap-1"
                    >
                      {isPending && (
                        <Skeleton className="h-18 border w-full rounded-xl" />
                      )}
                      {isError && (
                        <EmptyComponent
                          variant="error"
                          description={error?.message}
                        />
                      )}
                      {users?.data.map((user) => (
                        <FieldLabel
                          key={user.id}
                          htmlFor={`${user.id}`}
                          className="rounded-xl"
                        >
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>{user.name}</FieldTitle>
                              <FieldDescription>{user.email}</FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value={user.id}
                              id={`${user.id}`}
                              aria-invalid={isInvalid}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </FieldSet>
                );
              }}
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
