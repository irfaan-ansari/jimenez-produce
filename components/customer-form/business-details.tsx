import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import { BUSINESS_TYPES } from "@/lib/constants/customer";
import { businessDetails } from "@/lib/constants/customer";
import translations from "@/lib/constants/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";
import { CardDescription, CardTitle } from "../ui/card";

export const BusinessDetails = withForm({
  defaultValues: businessDetails,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <>
        <FieldGroup className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <CardTitle className="text-lg">Company Information</CardTitle>
            <CardDescription>
              Enter your company's legal details, tax information, and business
              profile.
            </CardDescription>
          </div>
          <form.AppField
            name="companyName"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />

          <form.AppField
            name="companyType"
            children={(field) => (
              <field.SelectField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                options={BUSINESS_TYPES}
                className="**:data-[slot=select-trigger]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyDBA"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyEin"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyPhone"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyEmail"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <div className="lg:col-span-2">
            <CardTitle className="text-lg">Company Address</CardTitle>
            <CardDescription>
              Provide the official address associated with your company.
            </CardDescription>
          </div>

          <form.AppField
            name="companyStreet"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyCity"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyState"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
          <form.AppField
            name="companyZip"
            children={(field) => (
              <field.TextField
                label={t[field.name]}
                placeholder={t[`${field.name}Placeholder`]}
                className="**:data-[slot=input]:rounded-2xl"
              />
            )}
          />
        </FieldGroup>
      </>
    );
  },
});
