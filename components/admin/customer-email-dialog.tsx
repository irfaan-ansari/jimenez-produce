"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import z from "zod";

import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useAppForm } from "@/hooks/form-context";

const schema = z.object({
  id: z.string().min(1, "Enter title"),
  statusReason: z.string().min(1, "Enter description"),
  statusDetails: z.string().min(1, "Select category"),
  internalNotes: z.string().min(1, "Enter price"),
});

export const CustomerHoldDialog = ({
  id,
  showDialog,
  setShowDialog,
  onSuccess,
}: {
  id: string;
  showDialog: boolean;
  setShowDialog: (v: boolean) => void;
  onSuccess?: () => void;
}) => {
  const form = useAppForm({
    defaultValues: {
      id,
      statusReason: "",
      statusDetails: "",
      internalNotes: "",
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
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg py-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Email Customer
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="no-scrollbar -mx-4 max-h-[min(600px,60vh)] -my-1 py-1  overflow-y-auto px-4">
            <FieldGroup>
              <form.AppField
                name="statusReason"
                children={(field) => (
                  <field.TextField
                    label="Title"
                    className="**:data-[slot=input]:rounded-xl"
                  />
                )}
              />

              <form.Field
                name="statusDetails"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 resize-none rounded-xl"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="internalNotes"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 resize-none rounded-xl"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </div>
          <Field className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:[&>button]:flex-1">
            <Button
              variant="outline"
              size="xl"
              type="button"
              onClick={() => setShowDialog(false)}
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
