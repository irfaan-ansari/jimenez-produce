"use client";

import z from "zod";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useAppForm } from "@/hooks/form-context";

import {
  JOB_APPLICATION_REJECT_OPTIONS,
  JOB_STATUS_DIALOG_CONFIG,
} from "@/lib/constants/job";
import { updateJobApplication } from "@/server/job";

const schema = z.object({
  statusReason: z.string().min(1, "Select reason"),
  statusDetails: z.string().min(1, "Enter detailed reason"),
  internalNotes: z.string(),
  status: z.string(),
});

type StatusVariant = "reject" | "interview";

export const JobApplicationStatusDialog = ({
  id,
  showDialog,
  setShowDialog,
  variant,
}: {
  id: number;
  showDialog: boolean;
  setShowDialog: (v: boolean) => void;
  onSuccess?: <T>(value: T) => void;
  variant: StatusVariant;
}) => {
  const config = JOB_STATUS_DIALOG_CONFIG[variant];

  const form = useAppForm({
    defaultValues: {
      statusReason: variant === "interview" ? "Interview" : "",
      statusDetails: "",
      internalNotes: "",
      status: config.status,
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const { success, error } = await updateJobApplication(id, value);

      if (success) {
        form.reset();
        setShowDialog(false);
        toast.success(config.successMessage);
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="py-8 ring-ring/10 rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="no-scrollbar -mx-4 max-h-[min(400px,60vh)] -my-1 py-1  overflow-y-auto px-4">
            <FieldGroup>
              <form.AppField
                name="statusReason"
                children={(field) => (
                  <field.SelectField
                    label="Reason"
                    options={JOB_APPLICATION_REJECT_OPTIONS}
                    className={`**:data-[slot=select-trigger]:rounded-xl ${
                      variant === "interview" ? "hidden" : ""
                    }`}
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
                      <FieldLabel htmlFor={field.name}>
                        {config.reasonLabel}
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 resize-none rounded-xl"
                      />
                      <FieldDescription>
                        {config.reasonDescription}
                      </FieldDescription>
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
                      <FieldLabel htmlFor={field.name}>
                        Internal Notes.
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="min-h-24 resize-none rounded-xl"
                      />
                      <FieldDescription>
                        Optional notes for internal use only. This will not be
                        visible to the applicant.
                      </FieldDescription>
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
              selector={({ canSubmit, isSubmitting }) => ({
                canSubmit,
                isSubmitting,
              })}
              children={({ canSubmit, isSubmitting }) => (
                <Button
                  type="submit"
                  size="xl"
                  className="rounded-xl"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader className="animate-spin" />
                  ) : (
                    config.submitLabel
                  )}
                </Button>
              )}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};
