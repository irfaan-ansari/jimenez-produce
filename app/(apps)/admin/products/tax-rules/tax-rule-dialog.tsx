"use client";
import z from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup } from "@/components/ui/field";
import { Loader } from "@/components/animate-ui/icons/loader";
import { createTaxRule, updateTaxRule } from "@/server/tax-rule";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  name: z.string().min(1, "Enter name"),
  rate: z.coerce
    .number("Invalid value")
    .min(0, "Rate must be >= 0")
    .max(100, "Rate cannot exceed 100"),
});
export const TaxRuleDialog = ({
  data,
  children,
}: {
  data?: { id: number; name: string; rate: string };
  children: React.ReactNode;
}) => {
  const isEdit = data?.id;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: {
      name: data?.name || "",
      rate: (data?.rate || "") as unknown,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const { rate, name } = value;
      const toastId = toast.loading("Please wait...");

      const { error } = isEdit
        ? await updateTaxRule(data?.id, { rate: String(rate), name })
        : await createTaxRule({ rate: String(rate), name });

      if (error) {
        toast.error(error.message, { id: toastId });
      } else {
        toast.success(
          `${isEdit ? "Updated" : "Created"} tax rule successfully`,
          { id: toastId },
        );
        queryClient.invalidateQueries({
          queryKey: ["tax-rules"],
        });
        form.reset();
        setOpen(false);
      }
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
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Edit tax rule" : "Create tax rule"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? `Edit ${data?.name} tax rule`
                : "Create a new tax rule."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Name" placeholder="Enter name" />
              )}
            />
            <form.AppField
              name="rate"
              children={(field) => (
                <field.TextField label="Rate %" placeholder="7%" />
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
