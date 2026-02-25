import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { Input } from "../ui/input";
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
        <form.Field
          name="certificate"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2 col-span-2">
                <FieldLabel htmlFor={field.name}>{t[field.name]}</FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  // @ts-expect-error
                  onChange={(e) => field.handleChange(e.target.files?.[0])}
                  // @ts-expect-error
                  onBlur={(e) => field.handleBlur(e.target.files?.[0])}
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>
                  {/* Accepted formats: PDF, JPG, PNG. Max 10 MB. */}
                  {t[`${field.name}Desc`]}
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="dlFront"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name}>{t[field.name]}</FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  // @ts-expect-error
                  onChange={(e) => field.handleChange(e.target.files?.[0])}
                  // @ts-expect-error
                  onBlur={(e) => field.handleBlur(e.target.files?.[0])}
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>{t[`${field.name}Desc`]}</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="dlBack"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name}>{t[field.name]}</FieldLabel>
                <Input
                  type="file"
                  id={field.name}
                  // @ts-expect-error
                  onChange={(e) => field.handleChange(e.target.files?.[0])}
                  // @ts-expect-error
                  onBlur={(e) => field.handleBlur(e.target.files?.[0])}
                  className="py-[0.6rem]"
                  accept="image/jpeg, image/png, application/pdf"
                />
                <FieldDescription>{t[`${field.name}Desc`]}</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <div className="col-span-2">
          <h4 className="text-xl font-semibold mb-1">Verification Documents</h4>
          <p className="mb-4 text-muted-foreground">
            Review, accept, and sign the personal guarantee to complete your
            application
          </p>
        </div>
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
