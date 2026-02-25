import { FieldGroup } from "../ui/field";
import {
  businessAdditionalContact,
  ROLES,
  SALES_REPRESENTATIVE,
} from "@/lib/constants/customer";
import { withForm } from "@/hooks/form-context";
import translations from "@/lib/constants/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";

export const BusinessAdditionalContact = withForm({
  defaultValues: businessAdditionalContact,
  render: function render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-2">
        <form.AppField
          name="orderingName"
          children={(field) => (
            <field.TextField label={t[field.name]} className="col-span-2" />
          )}
        />
        <form.AppField
          name="orderingPhone"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <form.AppField
          name="accountPayableEmail"
          children={(field) => <field.TextField label={t[field.name]} />}
        />
        <div className="col-span-2 ">
          <h4 className="text-xl font-semibold mb-1">Personal Guarantor</h4>
          <p className="text-muted-foreground">
            Enter the details of the individual who will personally guarantee
            payment on this account.
          </p>
        </div>
        <form.AppField
          name="guarantorName"
          children={(field) => <field.TextField label={t[field.name]} />}
        />

        <form.AppField
          name="guarantorRole"
          children={(field) => (
            <field.SelectField
              options={ROLES}
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />

        <form.AppField
          name="salesRepresentative"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              description={t[`${field.name}Desc`]}
              className="col-span-2"
              options={SALES_REPRESENTATIVE}
              placeholder={t[`${field.name}Placeholder`]}
            />
          )}
        />
      </FieldGroup>
    );
  },
});
