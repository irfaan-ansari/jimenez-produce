import { withForm } from "@/hooks/form-context";
import { FieldGroup } from "../ui/field";
import { applicantDetail } from "@/lib/constants/job";

export const ApplicantDetails = withForm({
  defaultValues: applicantDetail,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.AppField
          name="firstName"
          children={(field) => <field.TextField label="First Name" />}
        />
        <form.AppField
          name="lastName"
          children={(field) => {
            return <field.TextField label="Last Name" />;
          }}
        />
        <form.AppField
          name="phone"
          children={(field) => {
            return <field.TextField label="Phone" />;
          }}
        />
        <form.AppField
          name="email"
          children={(field) => {
            return <field.TextField label="Email" />;
          }}
        />
        <form.AppField
          name="socialSecurity"
          children={(field) => {
            return (
              <field.TextField
                label="Social Security #"
                className="@2xl:col-span-2"
              />
            );
          }}
        />
        <form.AppField
          name="dob"
          children={(field) => {
            return (
              <field.DateField label="Date of Birth" placeholder="Select" />
            );
          }}
        />
        <form.AppField
          name="availableStartDate"
          children={(field) => {
            return (
              <field.DateField
                label="Date Available for Work"
                placeholder="Select"
              />
            );
          }}
        />
        <form.AppField
          name="hasLegalRights"
          children={(field) => (
            <field.RadioField
              label="Do you have legal right to work in the United States?"
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
            />
          )}
        />
      </FieldGroup>
    );
  },
});
