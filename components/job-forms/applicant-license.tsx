import React from "react";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
import { Plus, Trash2 } from "lucide-react";
import { withForm } from "@/hooks/form-context";
import { applicantLicence } from "@/lib/constants/job";
import { CDL_CLASSES, CDL_ENDORSEMENTS, US_STATES } from "@/lib/constants/job";

export const ApplicantLicense = withForm({
  defaultValues: applicantLicence,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.AppField
          name="currentLicense.licenseNumber"
          children={(field) => (
            <field.TextField
              label="License Number"
              className="@2xl:col-span-2"
            />
          )}
        />
        <form.AppField
          name="currentLicense.licenseType"
          children={(field) => (
            <field.SelectField
              label="Type/Class"
              placeholder="Select"
              options={CDL_CLASSES}
            />
          )}
        />
        <form.AppField
          name="currentLicense.endorsements"
          children={(field) => (
            <field.SelectField
              label="Endorsements"
              placeholder="Select"
              options={CDL_ENDORSEMENTS}
            />
          )}
        />
        <form.AppField
          name="currentLicense.state"
          children={(field) => (
            <field.SelectField
              label="Issuing State"
              placeholder="Select"
              options={US_STATES}
            />
          )}
        />
        <form.AppField
          name="currentLicense.expiryDate"
          children={(field) => (
            <field.DateField label="Expiration Date" placeholder="Select" />
          )}
        />

        <form.AppField
          name="licenses"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2 flex justify-between items-center">
                        License {i + 1}
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => field.removeValue(i)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <form.AppField
                        name={`licenses[${i}].licenseNumber`}
                        children={(field) => (
                          <field.TextField
                            label="License Number"
                            className="@2xl:col-span-2"
                          />
                        )}
                      />
                      <form.AppField
                        name={`licenses[${i}].licenseType`}
                        children={(field) => (
                          <field.SelectField
                            label="Type/Class"
                            placeholder="Select"
                            options={CDL_CLASSES}
                          />
                        )}
                      />
                      <form.AppField
                        name={`licenses[${i}].endorsements`}
                        children={(field) => (
                          <field.SelectField
                            label="Endorsements"
                            placeholder="Select"
                            options={CDL_ENDORSEMENTS}
                          />
                        )}
                      />
                      <form.AppField
                        name={`licenses[${i}].state`}
                        children={(field) => (
                          <field.SelectField
                            label="Issuing State"
                            placeholder="Select"
                            options={US_STATES}
                          />
                        )}
                      />
                      <form.AppField
                        name={`licenses[${i}].expiryDate`}
                        children={(field) => (
                          <field.DateField
                            label="Expiration Date"
                            placeholder="Select"
                          />
                        )}
                      />
                    </React.Fragment>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="w-full @2xl:col-span-2 border-dashed bg-primary/10"
                  onClick={() =>
                    field.pushValue({
                      licenseType: "",
                      licenseNumber: "",
                      state: "",
                      endorsements: "",
                      expiryDate: "",
                    })
                  }
                >
                  <Plus />
                  Add Another
                </Button>
              </>
            );
          }}
        />
      </FieldGroup>
    );
  },
});
