"use client";
import z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Field } from "../ui/field";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { useAppForm } from "@/hooks/form-context";
import { useQueryClient } from "@tanstack/react-query";
import { defaultValues } from "@/lib/constants/customer";
import { steps } from "@/lib/constants/customer-form-steps";
import { fileSchema } from "@/lib/form-schema/customer-schema";
import { createCustomer, updateCustomer } from "@/server/customer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CustomerInsertType, CustomerSelectType } from "@/lib/db/schema";

const STEPS = steps.slice(0, -1);

const baseSchema = z
  .object(Object.assign({}, ...STEPS.map((step) => step.schema.shape)))
  .extend({
    certificate: fileSchema.optional().or(z.null()),
    dlFront: fileSchema.optional().or(z.null()),
    dlBack: fileSchema.optional().or(z.null()),
  });

export const CustomerDialog = ({
  children,
  id,
  initialValues,
}: {
  children: React.ReactNode;
  id?: number;
  initialValues?: CustomerSelectType;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // helper function for submit
  const handleSubmit = async (payload: CustomerInsertType) => {
    if (id) {
      return await updateCustomer(id, payload);
    }
    return await createCustomer(payload, false);
  };

  const form = useAppForm({
    defaultValues: {
      ...(initialValues ?? {
        ...defaultValues,
        lockboxPermission: "no",
        deliverySchedule: [],
      }),
      certificate: null as any,
      dlFront: null as any,
      dlBack: null as any,
    },

    validators: {
      onSubmit: ({ formApi }) => {
        const error = formApi.parseValuesWithSchema(baseSchema as any);

        if (error) {
          return error;
        }
        return null;
      },
    },
    onSubmit: async ({ value }) => {
      const { certificate, dlFront, dlBack, ...rest } = value;

      const files = {
        certificate,
        dlFront,
        dlBack,
      };

      // upload files and store the files urls
      const uploads = await Promise.all(
        Object.entries(files).map(async ([key, file]) => {
          if (!file || !(file instanceof File)) return {};

          const result = await upload(`customer/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });

          return { [`${key}Url`]: result.url };
        })
      );
      // extract file urls
      const uploadedFiles = Object.assign({}, ...uploads);

      // submit form

      const { success, error } = await handleSubmit({
        ...rest,
        ...uploadedFiles,
      });

      if (success) {
        toast.error(
          id
            ? "Application updated successfully"
            : "Customer created successfully"
        );
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setOpen(false);
        form.reset();
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="ring-ring/10 rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {id ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Tabs defaultValue="details">
            <TabsList className="w-full rounded-xl mb-4">
              <TabsTrigger type="button" className="rounded-xl" value="details">
                Details
              </TabsTrigger>
              <TabsTrigger
                type="button"
                className="rounded-xl"
                value="documents"
              >
                Documents
              </TabsTrigger>
            </TabsList>
            <div className="no-scrollbar @container -mx-4 h-[min(400px,60vh)] -my-1 py-1  overflow-y-auto px-4">
              <TabsContent value="details" className="space-y-10">
                {STEPS.map((step, i) => (
                  <step.component
                    key={i}
                    // @ts-ignore
                    form={form}
                  />
                ))}
              </TabsContent>
              <TabsContent value="documents" className="space-y-8">
                <form.AppField
                  name="certificate"
                  children={(field) => (
                    <field.FileField label="Sales Tax Resale Certificate" />
                  )}
                />
                <form.AppField
                  name="dlFront"
                  children={(field) => (
                    <field.FileField label="Driver’s License (Front)" />
                  )}
                />
                <form.AppField
                  name="dlBack"
                  children={(field) => (
                    <field.FileField label="Driver’s License (Back)" />
                  )}
                />
              </TabsContent>
            </div>
          </Tabs>
          {/* submit button */}
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
              children={({ isSubmitting, canSubmit }) => (
                <Button
                  size="xl"
                  className="min-w-32 rounded-xl"
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                >
                  {isSubmitting && <Loader className="animate-spin" />}
                  Save
                </Button>
              )}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
};
