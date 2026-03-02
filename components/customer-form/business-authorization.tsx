import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { withForm } from "@/hooks/form-context";
import translations from "@/lib/constants/translations.json";
import { businessAuthorization } from "@/lib/constants/customer";
import { type Translations, useTranslation } from "../ui/language-selector";

export const Authorization = withForm({
  defaultValues: businessAuthorization,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-2">
        <div className="col-span-2 bg-amber-600/10 text-amber-600 font-medium p-4 border border-amber-600/10 rounded-2xl">
          All uploaded files must be in PDF, JPG, or PNG format and must not
          exceed 5 MB per file.
        </div>

        <form.AppField
          name="certificate"
          children={(field) => <field.FileField label={t[field.name]} />}
        />

        <form.AppField
          name="dlFront"
          children={(field) => <field.FileField label={t[field.name]} />}
        />
        <form.AppField
          name="dlFront"
          children={(field) => <field.FileField label={t[field.name]} />}
        />

        <form.AppField
          name="signatureName"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              className="col-span-2"
              description={t[`${field.name}Desc`]}
            />
          )}
        />
        <form.AppField
          name="signature"
          children={(field) => (
            <field.SignatureField
              label={t[field.name]}
              className="col-span-2"
              description={t[`${field.name}Desc`]}
            />
          )}
        />
        <form.Field
          name="acknowledge"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2 col-span-2" data-invalid={isInvalid}>
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
                        {t[field.name]}
                      </FieldTitle>
                      <FieldDescription>
                        {t[`${field.name}Desc`]}
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
