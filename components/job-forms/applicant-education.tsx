import React from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { withForm } from "@/hooks/form-context";

import { Textarea } from "../ui/textarea";
import { applicantEducation } from "@/lib/constants/job";

export const ApplicantEducation = withForm({
  defaultValues: applicantEducation,
  render: function Render({ form }) {
    return (
      <FieldGroup className="grid grid-cols-1 @2xl:grid-cols-2">
        <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2">
          High School
        </div>
        <form.AppField
          name={`highSchool.institutionName`}
          children={(field) => <field.TextField label="Name" />}
        />
        <form.AppField
          name={`highSchool.fieldOfStudy`}
          children={(field) => <field.TextField label="School" />}
        />
        <form.AppField
          name={`highSchool.location`}
          children={(field) => <field.TextField label="Location" />}
        />
        <form.AppField
          name={`highSchool.yearCompleted`}
          children={(field) => <field.TextField label="Years Completed" />}
        />
        <form.Field
          name={`highSchool.details`}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className={`@2xl:col-span-2`}>
                <FieldLabel htmlFor={field.name}>Details</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-24 resize-none"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2">
          College
        </div>
        <form.AppField
          name={`collage.institutionName`}
          children={(field) => <field.TextField label="Name" />}
        />
        <form.AppField
          name={`collage.fieldOfStudy`}
          children={(field) => <field.TextField label="Course of Study" />}
        />
        <form.AppField
          name={`collage.location`}
          children={(field) => <field.TextField label="Location" />}
        />
        <form.AppField
          name={`collage.yearCompleted`}
          children={(field) => <field.TextField label="Years Completed" />}
        />
        <form.Field
          name={`collage.details`}
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field className={`@2xl:col-span-2`}>
                <FieldLabel htmlFor={field.name}>Details</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  className="min-h-24 resize-none"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.AppField
          name="educations"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="p-4 border-l-4 border-blue-500 bg-secondary font-medium text-base @2xl:col-span-2 flex justify-between items-center">
                        Other Education
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
                        name={`educations[${i}].institutionName`}
                        children={(field) => <field.TextField label="Name" />}
                      />
                      <form.AppField
                        name={`educations[${i}].fieldOfStudy`}
                        children={(field) => (
                          <field.TextField label="Course of Study" />
                        )}
                      />
                      <form.AppField
                        name={`educations[${i}].location`}
                        children={(field) => (
                          <field.TextField label="Location" />
                        )}
                      />
                      <form.AppField
                        name={`educations[${i}].yearCompleted`}
                        children={(field) => (
                          <field.TextField label="Years Completed" />
                        )}
                      />
                      <form.Field
                        name={`educations[${i}].details`}
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field className={`@2xl:col-span-2`}>
                              <FieldLabel htmlFor={field.name}>
                                Details
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
                      institutionName: "",
                      fieldOfStudy: "",
                      location: "",
                      yearCompleted: "",
                      details: "",
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
