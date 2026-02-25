import { businessDetails } from "@/lib/constants/customer";
import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import { BUSINESS_TYPES } from "@/lib/constants/customer";
import translations from "@/lib/constants/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";

export const BusinessDetails = withForm({
  defaultValues: businessDetails,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
        <form.AppField
          name="companyName"
          children={(field) => <field.TextField label={t[field.name]} />}
        />

        <form.AppField
          name="companyType"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              options={BUSINESS_TYPES}
            />
          )}
        />
        <form.AppField
          name="companyDBA"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyEin"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyStreet"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyCity"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyState"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyZip"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyPhone"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="companyEmail"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
      </FieldGroup>
    );
  },
});
