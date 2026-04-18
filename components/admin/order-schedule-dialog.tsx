"use client";

import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { updateOrder } from "@/server/order";
import { Field, FieldGroup } from "../ui/field";
import { useAppForm } from "@/hooks/form-context";
import { DELIVERY_TIME } from "@/lib/constants/customer";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  deliveryDate: z.string().min(1, "Select date"),
  deliveryWindow: z.string().min(1, "Select window"),
});

interface Props {
  children: React.ReactNode;
  defaultValues?: {
    id: number;
    deliveryDate: string | null;
    deliveryWindow: string | null;
  };
}
export const OrderScheduleDialog = ({ children, defaultValues }: Props) => {
  const { id, deliveryDate, deliveryWindow } = defaultValues || {};
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: {
      deliveryDate: deliveryDate ?? "",
      deliveryWindow: deliveryWindow ?? "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      if (!id) {
        toast("Order ID not found");
        return;
      }
      const { success, error } = await updateOrder(id, value);
      if (success) {
        toast("Schedule updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        setOpen(false);
      } else {
        toast(error.message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl ring-ring/10 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Schedule
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="deliveryDate"
              children={(field) => (
                <field.DateField label="Title" className="**:rounded-xl" />
              )}
            />
            <form.AppField
              name="deliveryWindow"
              children={(field) => (
                <field.SelectField
                  label="Window"
                  options={DELIVERY_TIME}
                  className="**:rounded-xl"
                />
              )}
            />
          </FieldGroup>

          <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
