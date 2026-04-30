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
import { Team } from "@/lib/types";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppForm, withForm } from "@/hooks/form-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { phoneSchema } from "@/lib/form-schema/common";
import { usePriceLevels, useTaxRules } from "@/hooks/use-product";
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
      id: z.number(),
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
        const taxRuleIds = value.taxRules.map((r) => r.id);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl px-0 ring-ring/10 sm:max-w-2xl overflow-visible">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-[calc(100svh-200px)] flex-col justify-start"
        >
          <DialogHeader className="mb-4 px-6">
            <DialogTitle className="text-2xl font-bold">
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

              {/* @ts-expect-error */}
              <TaxRulesSelector form={form} />

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

const TaxRulesSelector = withForm({
  defaultValues: {
    taxRules: [] as { id: number; name: string; rate: string }[],
  },
  render: function ({ form }) {
    const anchor = useComboboxAnchor();
    const { data: taxRules, isPending } = useTaxRules("limit=100");

    const items = React.useMemo(() => {
      const defaultRules = form.state.values.taxRules;

      const rules =
        taxRules?.data?.map((tx) => ({
          id: tx.id,
          name: tx.name,
          rate: tx.rate,
        })) ?? [];

      const merged = [...rules, ...defaultRules];

      const unique = Array.from(
        new Map(merged.map((item) => [item.id, item])).values(),
      );

      return unique;
    }, [taxRules, isPending]);

    return (
      <form.Field
        name="taxRules"
        mode="array"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid} className="col-span-2">
              <FieldLabel htmlFor={field.name}>Select Taxes</FieldLabel>

              <Combobox
                items={items}
                multiple
                value={field.state.value}
                defaultValue={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
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
                        {item.name} - {item.rate}%
                      </ComboboxChip>
                    ))}
                  </ComboboxValue>
                  <ComboboxChipsInput placeholder="Select" />
                </ComboboxChips>
                <ComboboxContent
                  anchor={anchor}
                  className="pointer-events-auto h-full overflow-auto! overscroll-contain"
                >
                  <ComboboxEmpty>No rule found.</ComboboxEmpty>
                  <ComboboxList onWheel={(e) => e.stopPropagation()}>
                    {(team) => (
                      <ComboboxItem key={team.id} value={team}>
                        {team.name}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {team.rate}%
                        </span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  },
});
