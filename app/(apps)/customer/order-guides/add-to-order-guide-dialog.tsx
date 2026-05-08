"use client";
import z from "zod";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { File } from "@duo-icons/react";
import { Loader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form-context";
import { Field, FieldGroup } from "@/components/ui/field";
import { formatUSD } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  orderGuideId: z.any(),
  productId: z.number(),
});

export const AddToOrderGuideDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      orderGuideId: undefined,
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Please wait...");
      await new Promise((res) => setTimeout(res, 1000));
      toast.success("(Demo) order guide saved successfully", { id: toastId });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl p-0 ring-ring/10 sm:max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex h-full max-h-[min(800px,90svh)] flex-col gap-6 py-6"
        >
          <DialogHeader className="flex-row items-center gap-3 px-6">
            <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-secondary *:size-5">
              <File />
            </span>
            <DialogTitle className="text-xl font-bold">
              Add to order guide
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="px-6 no-scrollbar flex-1 overflow-auto">
            <div className="rounded-xl border bg-secondary/20 gap-3 p-2 flex items-center justify-center">
              <span className="shrink-0 size-9 ring-1 inline-flex bg-black/80 rounded-xl"></span>
              <div className="space-y-1 flex-1">
                <p className="font-medium">Name</p>
              </div>
              <span className="text-primary">{formatUSD(20)}</span>
            </div>
            <Button
              size="xl"
              type="button"
              variant="outline"
              className="w-full justify-start text-muted-foreground"
            >
              <Search />
              Select existing
            </Button>

            <div className="flex flex-row items-center justify-center gap-4">
              <div className="flex-[1_1_0] border-b "></div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                CREATE NEW
              </span>
              <span className="flex-[1_1_0] border-b"></span>
            </div>

            <form.AppField
              name="name"
              children={(field) => (
                <field.TextField label="Name" placeholder="Weekly essentials" />
              )}
            />
            <form.AppField
              name="description"
              children={(field) => (
                <field.TextAreaField
                  label="Description"
                  placeholder="Daily produce, dairy and basic dry goods for line service"
                />
              )}
            />
          </FieldGroup>
          <Field className="flex flex-col-reverse gap-4 px-6 sm:flex-row sm:justify-end sm:[&>button]:w-32">
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
              selector={({ isSubmitting, canSubmit, isDirty }) => ({
                isSubmitting,
                canSubmit,
                isDirty,
              })}
              children={({ isSubmitting, canSubmit, isDirty }) => (
                <Button
                  type="button"
                  size="xl"
                  className="rounded-lg"
                  disabled={isSubmitting || !canSubmit || !isDirty}
                  onClick={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
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
