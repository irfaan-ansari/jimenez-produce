import React from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import { applicantAddress, US_STATES } from "@/lib/constants/job";

export const ApplicantAddress = withForm({
  defaultValues: applicantAddress,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2">
          Current Address
        </div>
        <form.AppField
          name="currentAddress.street"
          children={(field) => (
            <field.TextField
              label="Street Address"
              className="@2xl:col-span-2"
            />
          )}
        />
        <form.AppField
          name="currentAddress.city"
          children={(field) => <field.TextField label="City" />}
        />

        <form.AppField
          name="currentAddress.state"
          children={(field) => (
            <field.SelectField
              label="State"
              placeholder="Select"
              options={US_STATES}
            />
          )}
        />
        <form.AppField
          name="currentAddress.zip"
          children={(field) => <field.TextField label="Zip" />}
        />
        <form.AppField
          name="currentAddress.yearsAtAddress"
          children={(field) => <field.TextField label="Years at Address" />}
        />
        <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2">
          Previous Address
        </div>
        <form.AppField
          name="mailingAddress.street"
          children={(field) => (
            <field.TextField
              label="Street Address"
              className="@2xl:col-span-2"
            />
          )}
        />
        <form.AppField
          name="mailingAddress.city"
          children={(field) => <field.TextField label="City" />}
        />

        <form.AppField
          name="mailingAddress.state"
          children={(field) => (
            <field.SelectField
              label="State"
              placeholder="Select"
              options={US_STATES}
            />
          )}
        />
        <form.AppField
          name="mailingAddress.zip"
          children={(field) => <field.TextField label="Zip" />}
        />
        <form.AppField
          name="mailingAddress.yearsAtAddress"
          children={(field) => <field.TextField label="Years at Address" />}
        />
      </FieldGroup>
    );
  },
});
