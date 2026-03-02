import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { withForm } from "@/hooks/form-context";

import { Checkbox } from "../ui/checkbox";
import { applicantConfirmation } from "@/lib/constants/job";

export const ApplicantConfirmation = withForm({
  defaultValues: applicantConfirmation,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <div className="@2xl:col-span-2 bg-amber-600/10 text-amber-600 font-medium p-4 border border-amber-600/10 rounded-2xl">
          All uploaded files must be in PDF, JPG, or PNG format and must not
          exceed 5 MB per file.
        </div>
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

        <form.AppField
          name="applicantName"
          children={(field) => (
            <field.TextField
              label="Applicant Name (Printed)"
              className="@2xl:col-span-2"
            />
          )}
        />

        <form.AppField
          name="signature"
          children={(field) => (
            <field.SignatureField
              label="Applicant Signature"
              description="Use mouse or finger (touchscreen)"
              className="@2xl:col-span-2"
            />
          )}
        />
        <div className="p-4 border @2xl:col-span-2">
          <p>
            I authorize you to make investigations (including contacting current
            and prior employers) into my personal, employment, financial,
            medical history, and other related matters as may be necessary in
            arriving at an employment decision. I hereby release employers,
            schools, health care providers, and other persons from all liability
            in responding to inquiries and releasing information in connection
            with my application.
            <br />
            <br />
            In the event of employment, I understand that false or misleading
            information given in my application or interview(s) may result in
            discharge. I also understand that I am required to abide by all
            rules and regulations of the Company.
            <br />
            <br />
            I understand that the information I provide regarding my current
            and/or prior employers may be used, and those employer(s) will be
            contacted for the purpose of investigating my safety performance
            history as required by 49 CFR 391.23. I understand that I have the
            right to review information, have errors corrected, and attach a
            rebuttal statement where applicable.
            <br />
            <br />
            This certifies that I completed this application, and that all
            entries on it and information in it are true and complete to the
            best of my knowledge. Note: A motor carrier may require an applicant
            to provide more information than that required by the Federal Motor
            Carrier Safety Regulations.
          </p>
        </div>
        <form.Field
          name="declaration"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="@2xl:col-span-2" data-invalid={isInvalid}>
                <FieldLabel className="col-span-2">
                  <Field orientation="horizontal">
                    <Checkbox
                      id={field.name}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked as boolean)
                      }
                    />
                    <FieldContent>
                      <FieldTitle className="text-foreground">
                        Applicant Acknowledgement
                      </FieldTitle>
                      <FieldDescription>
                        I confirm the information provided is accurate and the
                        documents uploaded belong to me and are clear, complete,
                        and unedited.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    );
  },
});
