"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { PopoverXDrawer } from "../popover-x-drawer";
import { jobApplicationStatusMap } from "@/lib/constants/job";
import {
  Eye,
  FileText,
  Loader,
  MoreVertical,
  Send,
  SquarePen,
  Trash2,
} from "lucide-react";
import { deleteJobApplication, updateJobApplication } from "@/server/job";
import { JobApplicationStatusDialog } from "./job-application-status-dialog";
import { JobApplicationSelectType } from "@/lib/db/schema";
import { useAppForm } from "@/hooks/form-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { steps } from "@/lib/constants/driver-form-steps";
import { Field } from "../ui/field";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { fileSchema } from "@/lib/form-schema/customer-schema";
import z from "zod";
import { upload } from "@vercel/blob/client";
type Status = keyof typeof jobApplicationStatusMap;

interface Props {
  initialValues: JobApplicationSelectType;
  showView: boolean;
}
export const JobApplicationAction = ({
  initialValues,
  showView = true,
}: Props) => {
  const queryClient = useQueryClient();
  const { status, agreementUrl, id } = initialValues as {
    status: Status;
    agreementUrl: string | undefined;
    id: number;
  };

  const [open, setOpen] = useState(false);
  const confirm = useConfirm();

  const [statusVariant, setStatusVariant] = useState("reject");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const availableActions = jobApplicationStatusMap[status].actions;

  const handleAction = (action: string) => {
    switch (action) {
      case "rejected":
        setStatusVariant("reject");
        setShowRejectDialog(true);
        break;
      case "interview":
        setStatusVariant("interview");
        setShowRejectDialog(true);
        break;
      case "pending":
        confirm.info({
          title: "Send Agreement",
          description:
            "This will send the agreement to the applicant for review and signature.",
          actionLabel: "Yes, Send",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateJobApplication(id, {
              status: "pending",
            });

            if (success) {
              toast.success("Agreement sent successfully.");
              queryClient.invalidateQueries({ queryKey: ["job-applications"] });
            } else toast.error(error.message);
          },
        });
        break;
      case "hired":
        confirm.info({
          title: "Mark as Hired",
          description:
            "This will update the applicant's status to Hired and send a welcome onboarding email.",
          actionLabel: "Yes, Send",
          cancelLabel: "Cancel",
          action: async () => {
            const { success, error } = await updateJobApplication(id, {
              status: "hired",
            });

            if (success) {
              toast.success("Marked as hired successfully.");
              queryClient.invalidateQueries({ queryKey: ["job-applications"] });
            } else toast.error(error.message);
          },
        });
        break;
      case "delete":
        confirm.delete({
          title: "Delete Application",
          description:
            "This action will permanently remove the application and this cannot be undone.",
          actionLabel: "Yes, Delete",
          action: async () => {
            const { success, error } = await deleteJobApplication(id);
            if (success) {
              toast.success("Applicationdeleted successfully.");
              queryClient.invalidateQueries({ queryKey: ["job-applications"] });
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
        <Button size="icon" variant="outline" className="rounded-lg">
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
          <Link href={`/admin/applications/candidate/${id}`}>
            <Eye />
            View
          </Link>
        </Button>
      )}
      <JobEditDialog initialValues={initialValues}>
        <Button
          type="button"
          variant="ghost"
          className="flex items-center justify-start gap-2"
        >
          <SquarePen />
          Edit
        </Button>
      </JobEditDialog>
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

      {(status === "new" || status === "interview" || "pending") &&
        !agreementUrl && (
          <Button variant="ghost" onClick={() => handleAction("pending")}>
            <Send /> Send Agreement
          </Button>
        )}

      {agreementUrl && (
        <Button variant="ghost" asChild>
          <a href={agreementUrl} target="_blank">
            <Eye /> View Agreement
          </a>
        </Button>
      )}

      <Button variant="ghost" asChild>
        <a href={`/api/applications/candidate/${id}/pdf`} target="_blank">
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

      {/* reject dialog */}
      <JobApplicationStatusDialog
        variant={statusVariant as any}
        showDialog={showRejectDialog}
        setShowDialog={setShowRejectDialog}
        id={id}
      />
    </PopoverXDrawer>
  );
};

const STEPS = steps.slice(0, -1);

const baseSchema = z
  .object(Object.assign({}, ...STEPS.map((step) => step.schema.shape)))
  .extend({
    drivingLicenseFront: fileSchema.optional().or(z.null()),
    drivingLicenseBack: fileSchema.optional().or(z.null()),
    socialSecurityFront: fileSchema.optional().or(z.null()),
    socialSecurityBack: fileSchema.optional().or(z.null()),
    dotFront: fileSchema.optional().or(z.null()),
    dotBack: fileSchema.optional().or(z.null()),
  });

export const JobEditDialog = ({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues: JobApplicationSelectType;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useAppForm({
    defaultValues: {
      ...initialValues,
      drivingLicenseFront: undefined as any,
      drivingLicenseBack: undefined as any,
      socialSecurityFront: undefined as any,
      socialSecurityBack: undefined as any,
      dotFront: undefined as any,
      dotBack: undefined as any,
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
      const {
        drivingLicenseFront,
        drivingLicenseBack,
        socialSecurityFront,
        socialSecurityBack,
        dotFront,
        dotBack,
        ...rest
      } = value;

      const files = {
        drivingLicenseFront,
        drivingLicenseBack,
        socialSecurityFront,
        socialSecurityBack,
        dotFront,
        dotBack,
      };

      // upload files and send the files url to
      const uploads = await Promise.all(
        Object.entries(files).map(async ([key, file]) => {
          if (!file || !(file instanceof File)) return {};

          const result = await upload(`job-application/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          });

          return { [`${key}Url`]: result.url };
        }),
      );
      const uploadedFiles = Object.assign({}, ...uploads);

      const { success, error } = await updateJobApplication(value.id, {
        ...rest,
        ...uploadedFiles,
      });

      if (success) {
        toast.error("Application updated successfully");
        queryClient.invalidateQueries({ queryKey: ["job-applications"] });
        form.reset();
        setOpen(false);
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="rounded-2xl ring-ring/10 sm:max-w-lg">
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
          <Tabs>
            <TabsList className="mb-4 w-full rounded-xl">
              <TabsTrigger value="details" className="rounded-xl">
                Details
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-xl">
                Documents
              </TabsTrigger>
            </TabsList>
            <div className="@container -mx-4 -my-1 no-scrollbar max-h-[min(400px,60vh)] overflow-y-auto  px-4 py-1">
              <TabsContent value="details" className="space-y-10">
                {STEPS.map((step, i) => (
                  <step.component
                    // @ts-ignore
                    form={form}
                    key={i}
                  />
                ))}
              </TabsContent>
              <TabsContent value="documents" className="space-y-8">
                <form.AppField
                  name="drivingLicenseFront"
                  children={(field) => (
                    <field.FileField label="ID Card/Driver’s License (Front)" />
                  )}
                />
                <form.AppField
                  name="drivingLicenseBack"
                  children={(field) => (
                    <field.FileField label="ID Card/Driver’s License (Back)" />
                  )}
                />
                <form.AppField
                  name="socialSecurityFront"
                  children={(field) => (
                    <field.FileField label="  Social Security Card (Front)" />
                  )}
                />
                <form.AppField
                  name="socialSecurityBack"
                  children={(field) => (
                    <field.FileField label="  Social Security Card (Back)" />
                  )}
                />
                <form.AppField
                  name="dotFront"
                  children={(field) => (
                    <field.FileField label="DOT Medical Certificate (Front)" />
                  )}
                />
                <form.AppField
                  name="dotBack"
                  children={(field) => (
                    <field.FileField label="DOT Medical Certificate (Back)" />
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
              children={({ isSubmitting }) => (
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
