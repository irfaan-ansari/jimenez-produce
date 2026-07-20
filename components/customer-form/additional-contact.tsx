import { FieldGroup } from "../ui/field";
import {
  businessAdditionalContact,
  ROLES,
  SALES_REPRESENTATIVE,
} from "@/lib/constants/customer";
import { withForm } from "@/hooks/form-context";
import translations from "@/lib/constants/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";
import { CardDescription, CardTitle } from "../ui/card";

export const BusinessAdditionalContact = withForm({
  defaultValues: businessAdditionalContact,
  render: function render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <CardTitle className="text-lg">Additional Contact</CardTitle>
          <CardDescription>
            Enter the details of the individual who will personally guarantee
            payment on this account.
          </CardDescription>
        </div>
        <form.AppField
          name="orderingName"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="lg:col-span-2 **:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="orderingPhone"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="accountPayableEmail"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <div className="lg:col-span-2">
          <CardTitle className="text-lg">Personal Guarantor</CardTitle>
          <CardDescription>
            Enter the details of the individual who will personally guarantee
            payment on this account.
          </CardDescription>
        </div>
        <form.AppField
          name="guarantorName"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />

        <form.AppField
          name="guarantorRole"
          children={(field) => (
            <field.SelectField
              options={ROLES}
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=select-trigger]:rounded-2xl"
            />
          )}
        />

        <form.AppField
          name="salesRepresentative"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              description={t[`${field.name}Desc`]}
              className="col-span-2 **:data-[slot=select-trigger]:rounded-2xl"
              options={SALES_REPRESENTATIVE}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
      </FieldGroup>
    );
  },
});
