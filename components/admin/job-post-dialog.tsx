"use client";

import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import z from "zod";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Loader, X } from "lucide-react";
import { useAppForm } from "@/hooks/form-context";
import {
  useCreateJobPost,
  useUpdateJobPost,
} from "@/hooks/use-job-application";
import { JobPostSelectType } from "@/lib/db/schema";

const schema = z.object({
  title: z.string().min(1, "Enter title"),
  description: z.string().min(1, "Enter description"),
  categories: z.array(z.string()).min(1, "Select categories"),
  form: z.string().min(1, "Select form"),
  responsibility: z.string().min(1, "Enter Responsibility"),
  status: z.string().min(1, "Select status"),
});

export const JobPostDialog = ({
  children,
  post,
  openDialog,
  setOpenDialog,
}: {
  post?: JobPostSelectType;
  children?: React.ReactNode;
  openDialog?: boolean;
  setOpenDialog?: (v: boolean) => void;
}) => {
  const isControlled = openDialog !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const { mutate: create, isPending: createPending } = useCreateJobPost();
  const { mutate: update, isPending: updatePending } = useUpdateJobPost();

  useEffect(() => {
    if (isControlled) {
      setInternalOpen(openDialog);
    }
  }, [openDialog, isControlled]);

  const open = isControlled ? openDialog : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      setOpenDialog?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const form = useAppForm({
    defaultValues: {
      title: post?.title || "",
      description: post?.description || "",
      categories: post?.categories || ([] as any),
      form: post?.form || "",
      responsibility: post?.responsibility || "",
      status: post?.status
        ? post.status.charAt(0).toUpperCase() + post.status.slice(1)
        : "",
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      const status = value.status.toLowerCase();
      if (post && post.id) {
        update(
          { id: post.id, ...value, status },
          {
            onSuccess: () => {
              toast.success("Job post has been updated!");
              setOpen(false);
            },
            onError: (err) => toast.error(err.message),
          }
        );
      } else {
        create(
          { ...value, status },
          {
            onSuccess: () => {
              toast.success("Job post has been saved!");
              setOpen(false);
              form.reset();
            },
            onError: (err) => toast.error(err.message),
          }
        );
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        setOpenDialog?.(e);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {post ? "Edit job post" : "Create job post"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="no-scrollbar -mx-4 max-h-[min(440px,60vh)] -my-1 py-1  overflow-y-auto px-4">
            <FieldGroup>
              <form.AppField
                name="title"
                children={(field) => (
                  <field.TextField
                    label="Title"
                    className="**:data-[slot=input]:rounded-xl"
                  />
                )}
              />

              <form.AppField
                name="status"
                children={(field) => (
                  <field.SelectField
                    label="Status"
                    className="**:data-[slot=select-trigger]:rounded-xl"
                    options={["Draft", "Published"]}
                  />
                )}
              />

              <form.AppField
                name="form"
                children={(field) => (
                  <field.SelectField
                    label="Form"
                    options={["Driver Form", "Operations Form"]}
                    className="**:data-[slot=select-trigger]:rounded-xl"
                  />
                )}
              />

              <form.Field
                name="categories"
                mode="array"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field aria-invalid={isInvalid} className="gap-2">
                      <FieldLabel htmlFor={field.name}>Categories</FieldLabel>

                      <Input
                        id={field.name}
                        aria-invalid={isInvalid}
                        placeholder="Type and press enter to add"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            // @ts-expect-error
                            field.pushValue(e.target?.value as string);
                            // @ts-expect-error
                            e.target.value = "";
                          }
                        }}
                        className="rounded-xl"
                      />

                      {field.state.value.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {(field.state.value as string[]).map((v, i) => (
                            <Badge
                              key={v}
                              variant="secondary"
                              className="rounded-xl text-sm h-7 pr-1"
                            >
                              {v}
                              <Button
                                type="button"
                                size="icon-xs"
                                variant="destructive"
                                className="size-5 rounded-xl"
                                onClick={() => field.removeValue(i)}
                              >
                                <X />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value!}
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
                name="responsibility"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Responsibility
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value!}
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
                  disabled={
                    isSubmitting || !canSubmit || createPending || updatePending
                  }
                >
                  {isSubmitting || createPending || updatePending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Save"
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
