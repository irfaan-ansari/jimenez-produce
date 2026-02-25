import { Textarea } from "../ui/textarea";
import { withForm } from "@/hooks/form-context";
import { DELIVERY_DAYS, DELIVERY_TIME } from "@/lib/constants/customer";
import { businessDelivery } from "@/lib/constants/customer";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

import translations from "@/lib/constants/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";
import React from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";

export const BusinessDelivery = withForm({
  defaultValues: businessDelivery,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");

    return (
      <FieldGroup className="grid grid-cols-2">
        <form.AppField
          name="lockboxPermission"
          children={(field) => (
            <field.RadioField
              label={t[field.name]}
              className="col-span-2"
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
                { label: "In future", value: "future" },
              ]}
            />
          )}
        />
        <form.AppField
          name="deliverySchedule"
          mode="array"
          children={(field) => {
            return (
              <>
                {field.state.value.map((subField, i) => {
                  return (
                    <React.Fragment key={i}>
                      <div className="col-span-2 flex">
                        <h4 className="text-xl font-semibold mb-1 flex-1 ">
                          Delivery Prefrences {i + 1}
                        </h4>

                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => field.removeValue(i)}
                          className={i <= 0 ? "hidden" : ""}
                        >
                          <Trash2 />
                        </Button>
                      </div>

                      <form.AppField
                        name={`deliverySchedule[${i}].day`}
                        children={(field) => (
                          <field.SelectField
                            label={t["deliveryDay"]}
                            options={DELIVERY_DAYS}
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].window`}
                        children={(field) => (
                          <field.SelectField
                            options={DELIVERY_TIME}
                            label={t["deliveryWindow"]}
                          />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].receivingName`}
                        children={(field) => (
                          <field.TextField label={t["receivingName"]} />
                        )}
                      />
                      <form.AppField
                        name={`deliverySchedule[${i}].receivingPhone`}
                        children={(field) => (
                          <field.TextField label={t["receivingPhone"]} />
                        )}
                      />
                      <form.Field
                        name={`deliverySchedule[${i}].instructions`}
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                          return (
                            <Field className="col-span-2">
                              <FieldLabel htmlFor={field.name}>
                                {t["deliveryInstructions"]}
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
                      day: "",
                      window: "",
                      receivingName: "",
                      receivingPhone: "",
                      instructions: "",
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
