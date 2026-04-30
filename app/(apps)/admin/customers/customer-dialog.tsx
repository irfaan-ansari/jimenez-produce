"use client";

import z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Team } from "@/lib/types";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Loader, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePriceLevels } from "@/hooks/use-product";
import { useQueryClient } from "@tanstack/react-query";
import { phoneSchema } from "@/lib/form-schema/common";
import { TaxRulesSelector } from "@/components/admin/tax-rules-selector";
import { addTeamWithTaxRules, updateTeamWithTaxRules } from "@/server/auth";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  managerName: z.string().min(1, "Manager Name is required"),
  phone: phoneSchema,
  email: z.email("Invalid email"),
  priceLevelId: z.string(),
  groupId: z.string(),
  taxRules: z.array(
    z.object({
      id: z.any(),
      name: z.string(),
      rate: z.string(),
    }),
  ),
});

export const CustomerDialog = ({
  data,
  children,
}: {
  data?: Team;
  children: React.ReactNode;
}) => {
  const isEdit = !!data;

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: levels } = usePriceLevels();

  const form = useAppForm({
    defaultValues: {
      name: data?.name || "",
      managerName: data?.managerName || "",
      phone: data?.phone || "",
      email: data?.email || "",
      priceLevelId: String(data?.priceLevelId || ""),
      groupId: "",
      taxRules: data?.taxRules || [],
    },
    validators: {
      onSubmit: ({ formApi }) => {
        return formApi.parseValuesWithSchema(schema);
      },
    },

    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");

      if (isEdit) {
        // update team/customer
        const taxRuleIds = value.taxRules.map((r) => Number(r.id));

        const { error } = await updateTeamWithTaxRules(data.id as string, {
          ...value,
          taxRuleIds,
          priceLevelId: Number(value.priceLevelId),
        });

        if (error) {
          toast.error(error?.message, {
            id: toastId,
          });
        } else {
          setOpen(false);
          form.reset();
          toast.success("Customer updated successfully", { id: toastId });
        }
      } else {
        // create team/customer
        const { error } = await addTeamWithTaxRules({
          ...value,
          priceLevelId: Number(value.priceLevelId!),
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        } else {
          setOpen(false);
          form.reset();
          toast.success("Customer created successfully", { id: toastId });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  console.log(form.state.values.taxRules);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-visible rounded-2xl px-0 ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-[calc(100svh-200px)] flex-col justify-start"
        >
          <DialogHeader className="mb-4 px-6">
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Edit Customer" : "Create Customer"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the details of the customer."
                : "Enter the details of the new customer."}
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar flex-1 overflow-auto px-6">
            <FieldGroup className="grid grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.TextField
                    placeholder="Acme"
                    label="Company Name"
                    className="col-span-2"
                  />
                )}
              />
              <form.AppField
                name="managerName"
                children={(field) => (
                  <field.TextField
                    label="Manager Name"
                    placeholder="John"
                    className="col-span-2"
                  />
                )}
              />

              <form.AppField
                name="phone"
                children={(field) => (
                  <field.PhoneField label="Phone" placeholder="xxx-xxx-xxxx" />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField label="Email" placeholder="name@email.com" />
                )}
              />

              {/* tax selector */}

              <div className="lg:col-span-2">
                <p className="mb-2 font-medium">Tax Rules</p>
                <form.Field
                  name="taxRules"
                  mode="array"
                  children={(field) => {
                    const taxRules = field.state.value;
                    return (
                      <div className="space-y-2 rounded-lg border-l py-2 pl-2">
                        {taxRules.length > 0 ? (
                          <div className="space-y-1">
                            {taxRules?.map((rule, i) => (
                              <div
                                key={rule.id}
                                className="flex items-center rounded-lg border bg-secondary/20 p-2"
                              >
                                <div className="flex-1 space-x-4">
                                  <span>{rule.name}</span>
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <span className="font-medium">
                                    {rule.rate}%
                                  </span>
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
                        <TaxRulesSelector
                          selected={field.state.value}
                          setSelectedChange={(value) => {
                            const index = field.state.value.findIndex(
                              (s) => s.id === value.id,
                            );
                            if (index >= 0) {
                              field.removeValue(index);
                            } else {
                              // @ts-expect-error
                              field.pushValue(value);
                            }
                          }}
                        >
                          <Button variant="outline" size="sm">
                            <Plus /> Choose Tax Rules
                          </Button>
                        </TaxRulesSelector>
                      </div>
                    );
                  }}
                />
              </div>

              <form.Field
                name="groupId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Group</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={isInvalid}
                          className="h-11! rounded-xl!"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          position="item-aligned"
                          className="rounded-xl p-2"
                        >
                          <Skeleton className="h-11" />
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="priceLevelId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Price Level</FieldLabel>

                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        {levels?.data?.length ? (
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                            className="h-11! rounded-xl!"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        ) : (
                          <Skeleton className="h-11! w-full" />
                        )}
                        <SelectContent
                          position="item-aligned"
                          className="rounded-xl p-2"
                        >
                          {levels?.data?.map((level) => (
                            <SelectItem
                              key={level.id}
                              className="h-8 rounded-lg"
                              value={String(level.id)}
                            >
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </div>
          <Field className="mt-10 flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
