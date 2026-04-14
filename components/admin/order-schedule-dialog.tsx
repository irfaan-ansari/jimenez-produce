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
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { Field, FieldGroup } from "../ui/field";
import { useAppForm } from "@/hooks/form-context";
import { DELIVERY_TIME } from "@/lib/constants/customer";

const schema = z.object({
  deliveryDate: z.string().min(1, "Select date"),
  deliveryWindow: z.string().min(1, "Select window"),
});

export const OrderScheduleDialog = ({
  id,
  children,
  defaultValues,
}: {
  id: number;
  children: React.ReactNode;
  defaultValues?: Record<string, string>;
}) => {
  const [open, setOpen] = React.useState(false);
  const form = useAppForm({
    defaultValues: {
      deliveryDate: "",
      deliveryWindow: "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      // submit handler
      // if has id then update else create

      console.log(value);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl py-8 ring-ring/10 sm:max-w-lg">
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
          <div className="no-scrollbar -mx-4 -my-1 max-h-[min(600px,60vh)] overflow-y-auto  px-4 py-1">
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
          </div>
          <Field className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
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
