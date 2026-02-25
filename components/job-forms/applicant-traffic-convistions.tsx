import React from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { withForm } from "@/hooks/form-context";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { applicantTrafficConvictions } from "@/lib/constants/job";

export const ApplicantTrafficConvictions = withForm({
  defaultValues: applicantTrafficConvictions,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <form.AppField
          name="trafficConvictions"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2 flex justify-between items-center">
                        Accident History {i + 1}
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
                        name={`trafficConvictions[${i}].violation`}
                        children={(field) => (
                          <field.TextField label="Violation / Offense" />
                        )}
                      />
                      <form.AppField
                        name={`trafficConvictions[${i}].state`}
                        children={(field) => (
                          <field.TextField label="State of Violation" />
                        )}
                      />

                      <form.AppField
                        name={`trafficConvictions[${i}].dateConvicted`}
                        children={(field) => (
                          <field.DateField
                            label="Date of Conviction"
                            placeholder="Select"
                          />
                        )}
                      />
                      <form.AppField
                        name={`trafficConvictions[${i}].penalty`}
                        children={(field) => (
                          <field.TextField label="Penalty" />
                        )}
                      />

                      <form.AppField
                        name={`trafficConvictions[${i}].licenseDenied`}
                        children={(field) => (
                          <field.RadioField
                            label="Was Your License Ever Denied?"
                            options={[
                              { label: "Yes", value: "yes" },
                              { label: "No", value: "no" },
                            ]}
                          />
                        )}
                      />
                      <form.Field
                        name={`trafficConvictions[${i}].licenseDeniedReason`}
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field className={`@2xl:col-span-2`}>
                              <FieldLabel htmlFor={field.name}>
                                If yes, Reason for License Denial
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                className="min-h-24 resize-none"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
                      />
                      <form.AppField
                        name={`trafficConvictions[${i}].licenseSuspended`}
                        children={(field) => (
                          <field.RadioField
                            label="Was Your License Ever Suspended or Revoked?"
                            options={[
                              { label: "Yes", value: "yes" },
                              { label: "No", value: "no" },
                            ]}
                          />
                        )}
                      />
                      <form.Field
                        name={`trafficConvictions[${i}].licenseSuspendedReason`}
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field className={`@2xl:col-span-2`}>
                              <FieldLabel htmlFor={field.name}>
                                If yes, Reason for Suspension / Revocation
                              </FieldLabel>
                              <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                aria-invalid={isInvalid}
                                className="min-h-24 resize-none"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          );
                        }}
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
                      dateConvicted: "",
                      violation: "",
                      state: "",
                      penalty: "",
                      licenseDenied: "",
                      licenseDeniedReason: "",
                      licenseSuspended: "",
                      licenseSuspendedReason: "",
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
