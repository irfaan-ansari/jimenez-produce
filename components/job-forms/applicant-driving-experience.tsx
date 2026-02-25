import React from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import { EQUEPMENT_CATGORIES, EQUIPMENT_TYPES } from "@/lib/constants/job";
import { applicantDrivingExperience } from "@/lib/constants/job";

export const ApplicantDrivingExperience = withForm({
  defaultValues: applicantDrivingExperience,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.AppField
          name="drivingExperiences"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2 flex justify-between items-center">
                        Driving Experience {i + 1}
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
                        name={`drivingExperiences[${i}].category`}
                        children={(field) => (
                          <field.SelectField
                            label="Equipment Category"
                            placeholder="Select"
                            options={EQUEPMENT_CATGORIES}
                          />
                        )}
                      />
                      <form.AppField
                        name={`drivingExperiences[${i}].type`}
                        children={(field) => (
                          <field.SelectField
                            label="Equipment Type"
                            options={EQUIPMENT_TYPES}
                            placeholder="Select"
                          />
                        )}
                      />
                      <form.AppField
                        name={`drivingExperiences[${i}].fromDate`}
                        children={(field) => (
                          <field.DateField
                            label="From Date"
                            placeholder="Select"
                          />
                        )}
                      />
                      <form.AppField
                        name={`drivingExperiences[${i}].toDate`}
                        children={(field) => (
                          <field.DateField
                            label="To Date"
                            placeholder="Select"
                          />
                        )}
                      />
                      <form.AppField
                        name={`drivingExperiences[${i}].approxMilesTotal`}
                        children={(field) => (
                          <field.TextField label="Estimated Total Miles Driven" />
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
                      category: "",
                      type: "",
                      fromDate: "",
                      toDate: "",
                      approxMilesTotal: "",
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
