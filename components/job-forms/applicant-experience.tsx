import React from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";

import { applicantExperience } from "@/lib/constants/job";

export const ApplicantExperience = withForm({
  defaultValues: applicantExperience,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.AppField
          name="experience"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2 flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            onClick={() => field.removeValue(i)}
                            className="ml-auto"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      )}
                      <form.AppField
                        name={`experience[${i}].employerName`}
                        children={(field) => (
                          <field.TextField label="Employer Name" />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].phone`}
                        children={(field) => (
                          <field.TextField label="Employer Phone" />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].address`}
                        children={(field) => (
                          <field.TextField label="Street Address" />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].position`}
                        children={(field) => (
                          <field.TextField label="Position" />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].fromDate`}
                        children={(field) => (
                          <field.DateField
                            label="From Date"
                            placeholder="YYYY-MM-DD"
                          />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].toDate`}
                        children={(field) => (
                          <field.DateField
                            label="To Date"
                            placeholder="YYYY-MM-DD"
                          />
                        )}
                      />

                      <form.AppField
                        name={`experience[${i}].safetySensitive`}
                        children={(field) => (
                          <field.RadioField
                            label="While employed here, were you subject to the Federal Motor Carrier Safety Regulations?"
                            className="@2xl:col-span-2"
                            options={[
                              { label: "No", value: "no" },
                              { label: "Yes", value: "yes" },
                            ]}
                          />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].subjectToFmcsa`}
                        children={(field) => (
                          <field.RadioField
                            label="Was the job designated as a safety-sensitive function subject to DOT alcohol/controlled substances testing (49 CFR Part 40)?"
                            className="@2xl:col-span-2"
                            options={[
                              { label: "No", value: "no" },
                              { label: "Yes", value: "yes" },
                            ]}
                          />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].reasonForLeaving`}
                        children={(field) => (
                          <field.TextField label="Reason for Leaving" />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].salary`}
                        children={(field) => <field.TextField label="Salary" />}
                      />
                      <form.AppField
                        name={`experience[${i}].gap`}
                        children={(field) => (
                          <field.TextField
                            label="Explain any gaps"
                            className="@2xl:col-span-2"
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
                      employerName: "",
                      phone: "",
                      address: "",
                      position: "",
                      fromDate: "",
                      toDate: "",
                      reasonForLeaving: "",
                      safetySensitive: "",
                      subjectToFmcsa: "",
                      gap: "",
                      salary: "",
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
