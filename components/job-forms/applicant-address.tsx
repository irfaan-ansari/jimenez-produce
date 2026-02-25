import React from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import { applicantAddress } from "@/lib/constants/job";

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
          children={(field) => <field.TextField label="State" />}
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
          Mailing Address
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
          children={(field) => <field.TextField label="State" />}
        />
        <form.AppField
          name="mailingAddress.zip"
          children={(field) => <field.TextField label="Zip" />}
        />
        <form.AppField
          name="mailingAddress.yearsAtAddress"
          children={(field) => <field.TextField label="Years at Address" />}
        />

        <form.AppField
          name="addresses"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2 flex justify-between items-center">
                        Address {i + 1}
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
                        name={`addresses[${i}].street`}
                        children={(field) => (
                          <field.TextField
                            label="Street Address"
                            className="@2xl:col-span-2"
                          />
                        )}
                      />
                      <form.AppField
                        name={`addresses[${i}].city`}
                        children={(field) => <field.TextField label="City" />}
                      />
                      <form.AppField
                        name={`addresses[${i}].state`}
                        children={(field) => <field.TextField label="State" />}
                      />
                      <form.AppField
                        name={`addresses[${i}].zip`}
                        children={(field) => <field.TextField label="Zip" />}
                      />
                      <form.AppField
                        name={`addresses[${i}].yearsAtAddress`}
                        children={(field) => (
                          <field.TextField label="Years at Address" />
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
                      street: "",
                      city: "",
                      state: "",
                      zip: "",
                      yearsAtAddress: "",
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
