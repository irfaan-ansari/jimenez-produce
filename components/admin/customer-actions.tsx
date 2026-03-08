"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { statusMap } from "@/lib/constants/customer";
import { PopoverXDrawer } from "../popover-x-drawer";
import { useQueryClient } from "@tanstack/react-query";
import { CustomerStatusDialog } from "./customer-status-dialog";
import {
  Eye,
  FileText,
  Loader,
  MoreVertical,
  SquarePen,
  Trash2,
} from "lucide-react";
import { deleteCustomer, updateCustomer } from "@/server/customer";
import { steps } from "@/lib/constants/customer-form-steps";
import { CustomerSelectType } from "@/lib/db/schema";
import { useAppForm } from "@/hooks/form-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import z from "zod";
import { fileSchema, MAX_UPLOAD_SIZE } from "@/lib/form-schema/customer-schema";
import { upload } from "@vercel/blob/client";

type Status = keyof typeof statusMap;

interface Props {
  initialValues: CustomerSelectType;
  showView?: boolean;
}
export const CustomerAction = ({ initialValues, showView = true }: Props) => {
  const { status, id } = initialValues as { status: Status; id: number };
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [statusVariant, setStatusVariant] = useState("rejected");
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const availableActions = statusMap[status].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "active":
        confirm.info({
          title: "Approve Application",
          description:
            "Approving this application will activate the customer account and send a notification to the customer.",
          actionLabel: "Yes, Approve",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateCustomer(id, {
              status: "active",
            });

            if (success) {
              queryClient.invalidateQueries({ queryKey: ["customers"] });
              toast.success("Application has been approved");
            } else toast.error(error.message);
          },
        });

        break;

      case "under_review":
        confirm.info({
          title: "Move to Review?",
          description:
            "This will move the application to review stage and update its status to 'Under Review'.",
          actionLabel: "Yes, Move",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateCustomer(id, {
              status: "under_review",
            });

            if (success) {
              queryClient.invalidateQueries({ queryKey: ["customers"] });
              toast.success("Application moved to review!");
            } else toast.error(error.message);
          },
        });

        break;
      case "on_hold":
      case "rejected":
        setStatusVariant(action);
        setShowStatusDialog(true);
        break;

      case "delete":
        confirm.delete({
          title: "Delete Application",
          description:
            "This action will permanently remove the application and this cannot be undone.",
          actionLabel: "Yes, Delete",
          action: async () => {
            const { success, error } = await deleteCustomer(id);

            if (success) {
              queryClient.invalidateQueries({ queryKey: ["customers"] });
              toast.success("Application has been deleted.");
            } else toast.error(error.message);
          },
          cancelLabel: "Cancel",
        });
        break;
    }
  };

  return (
    <PopoverXDrawer
      open={open}
      setOpen={setOpen}
      trigger={
        <Button size="icon" variant="outline" className="rounded-xl">
          <MoreVertical className="size-5" />
        </Button>
      }
    >
      {showView && (
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-2"
          asChild
        >
          <Link href={`/admin/customers/${id}`}>
            <Eye />
            View
          </Link>
        </Button>
      )}
      <CustomerEditDialog initialValues={initialValues}>
        <Button
          type="button"
          variant="ghost"
          className="flex items-center justify-start gap-2"
        >
          <SquarePen />
          Edit
        </Button>
      </CustomerEditDialog>
      {availableActions.map((action) => (
        <Button
          type="button"
          key={action.action}
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => {
            handleAction(action.action);
          }}
        >
          <action.icon className="size-4" />
          {action.label}
        </Button>
      ))}

      <Button variant="ghost" asChild>
        <a href={`/api/customers/${id}/pdf`} target="_blank">
          <FileText /> Download PDF
        </a>
      </Button>

      <Button
        variant="ghost"
        className="hover:bg-destructive/10 hover:text-destructive"
        onClick={() => handleAction("delete")}
      >
        <Trash2 /> Delete
      </Button>

      {/* status dialog */}
      <CustomerStatusDialog
        variant={statusVariant as any}
        showDialog={showStatusDialog}
        setShowDialog={setShowStatusDialog}
        id={id}
      />
    </PopoverXDrawer>
  );
};

const STEPS = steps.slice(0, -1);

const baseSchema = z
  .object(Object.assign({}, ...STEPS.map((step) => step.schema.shape)))
  .extend({
    certificate: fileSchema.optional().or(z.null()),
    dlFront: fileSchema.optional().or(z.null()),
    dlBack: fileSchema.optional().or(z.null()),
  });

export const CustomerEditDialog = ({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues: CustomerSelectType;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      ...initialValues,
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
      // upload files and send the files url to
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
      const uploadedFiles = Object.assign({}, ...uploads);

      // submit form
      const { success, error } = await updateCustomer(value.id, {
        ...rest,
        ...uploadedFiles,
      });

      if (success) {
        toast.error("Application updated successfully");
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
            Edit Application
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
                  disabled={isSubmitting}
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
