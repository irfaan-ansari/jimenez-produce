"use client";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";

import { Field, FieldGroup } from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAppForm } from "@/hooks/form-context";

export const PriceLevelDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      type: "fixed", // fixed | percentage
      value: 0,
      scope: "all", // all | items
      status: "active",
    },
    onSubmit: async ({ value }) => {
      setOpen(false);
      //   form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">
              <form.Subscribe
                selector={(state) => state.values.name}
                children={(name) => name || "Price Level"}
              />
            </DialogTitle>
          </DialogHeader>
          <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
            {/* Name */}
            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Name" className="**:rounded-xl" />
              )}
            />
            {/* type */}
            <form.AppField
              name="type"
              children={(field) => (
                <field.SelectField
                  label="Type"
                  className="**:rounded-xl"
                  options={["Fixed", "Percentage"]}
                />
              )}
            />

            {/* Value */}
            <form.AppField
              name="value"
              children={(field) => (
                <field.TextField label="Value" className="**:rounded-xl" />
              )}
            />

            {/* type */}
            <form.AppField
              name="type"
              children={(field) => (
                <field.SelectField
                  label="Type"
                  className="**:rounded-xl"
                  options={["All", "Per Item"]}
                />
              )}
            />
            {/* scope */}
            <form.AppField
              name="scope"
              children={(field) => (
                <field.SelectField
                  label="Scope"
                  className="**:rounded-xl"
                  options={["Active", "Inactive"]}
                />
              )}
            />

            {/* scope */}
            <form.AppField
              name="status"
              children={(field) => (
                <field.SelectField
                  label="Status"
                  className="**:rounded-xl"
                  options={["Active", "Inactive"]}
                />
              )}
            />
          </FieldGroup>
          <Field className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-end  sm:[&>*]:w-32">
            <Button
              variant="outline"
              size="xl"
              type="button"
              className="rounded-xl"
              onClick={() => setOpen(false)}
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
