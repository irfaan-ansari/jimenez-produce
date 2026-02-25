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
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { applicantConfirmation } from "@/lib/constants/job";

export const ApplicantConfirmation = withForm({
  defaultValues: applicantConfirmation,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.Field
          name="drivingLicenseFront"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="">
                <FieldLabel htmlFor={field.name}>
                  Driver’s License (Front)
                </FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0] as File)
                  }
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>
                  Accepted formats: PDF, JPG, PNG. Max 10 MB.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="drivingLicenseBack"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="">
                <FieldLabel htmlFor={field.name}>
                  Driver’s License (Back)
                </FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0] as File)
                  }
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>
                  Accepted formats: PDF, JPG, PNG. Max 10 MB.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="socialSecurityFront"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="">
                <FieldLabel htmlFor={field.name}>
                  Social Security Card (Front)
                </FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0] as File)
                  }
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>
                  Accepted formats: PDF, JPG, PNG. Max 10 MB.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="socialSecurityBack"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="">
                <FieldLabel htmlFor={field.name}>
                  Social Security Card (Back)
                </FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0] as File)
                  }
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>
                  Accepted formats: PDF, JPG, PNG. Max 10 MB.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="dotFront"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="">
                <FieldLabel htmlFor={field.name}>
                  DOT Medical Certificate (Front)
                </FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0] as File)
                  }
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>
                  Accepted formats: PDF, JPG, PNG. Max 10 MB.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="dotBack"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className="">
                <FieldLabel htmlFor={field.name}>
                  DOT Medical Certificate (Back)
                </FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  onChange={(e) =>
                    field.handleChange(e.target.files?.[0] as File)
                  }
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>
                  Accepted formats: PDF, JPG, PNG. Max 10 MB.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <form.AppField
          name="applicantName"
          children={(field) => (
            <field.TextField
              label="Applicant Name (printed)"
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
