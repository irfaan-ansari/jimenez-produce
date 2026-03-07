"use client";

import { toast } from "sonner";
import {
  applicantAccidentHistory,
  applicantAddress,
  applicantConfirmation,
  applicantDetail,
  applicantDrivingExperience,
  applicantEducation,
  applicantExperience,
  applicantLicence,
  applicantTrafficConvictions,
} from "@/lib/constants/job";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { createJobApplication } from "@/server/job";

import { Loader } from "lucide-react";

import { driverFormSchema, DriverFormType } from "@/lib/form-schema/job-schema";

const defaultValues: DriverFormType = {
  ...applicantAccidentHistory,
  ...applicantAddress,
  ...applicantConfirmation,
  ...applicantDetail,
  ...applicantDrivingExperience,
  ...applicantEducation,
  ...applicantExperience,
  ...applicantLicence,
  ...applicantTrafficConvictions,
  step: 0,
  position: "Route Driver",
};

export const DriverForm = ({
  position,
  location,
}: {
  position: string;
  location: string;
}) => {
  const router = useRouter();

  const confirm = useConfirm();

  const form = useAppForm({
    defaultValues: {
      ...defaultValues,
      location,
      position,
    },

    onSubmit: async ({ value, formApi }) => {
      const files = [
        value.drivingLicenseFront,
        value.drivingLicenseBack,
        value.dotFront,
        value.dotBack,
        value.socialSecurityFront,
        value.socialSecurityBack,
        value.signature,
      ];

      // upload files and send the files url to
      const [dlFront, dlBack, dtFront, dtBack, ssFront, ssBack, sign] =
        await Promise.all(
          files.map((file) =>
            upload(`job-application/${file.name}`, file, {
              access: "public",
              handleUploadUrl: "/api/upload",
            })
          )
        );

      const {
        drivingLicenseFront,
        drivingLicenseBack,
        dotFront,
        dotBack,
        socialSecurityFront,
        socialSecurityBack,
        signature,
        ...rest
      } = value;

      const values = {
        ...rest,
        cvUrl: "",
        drivingLicenseFrontUrl: dlFront.url,
        drivingLicenseBackUrl: dlBack.url,
        dotFrontUrl: dtFront.url,
        dotBackUrl: dtBack.url,
        socialSecurityFrontUrl: ssFront.url,
        socialSecurityBackUrl: ssBack.url,
        signatureUrl: sign.url,
      };

      const { success, error } = await createJobApplication(values);
      if (success) {
        confirm.success({
          title: "Application Submitted Successfully",
          description: `Your application has been successfully submitted and is now under review. 
            If additional information is required, our team will contact you.`,
          actionLabel: "Back to home",
          action: () => router.push("/"),
        });
        form.reset();
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <form
      className="mb-16 @container"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* submit button */}
      <form.Subscribe
        children={({ isSubmitting }) => (
          <Button
            size="xl"
            className="min-w-32"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader className="animate-spin" />}
            Save
          </Button>
        )}
      />
    </form>
  );
};
