import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import { ROLES } from "@/lib/constants/customer";
import { businessContacts } from "@/lib/constants/customer";
import translations from "@/lib/constants/translations.json";
import { type Translations, useTranslation } from "../ui/language-selector";
import { CardDescription, CardTitle } from "../ui/card";

export const BusinessContact = withForm({
  defaultValues: businessContacts,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <CardTitle className="text-lg">Primary Contact</CardTitle>
          <CardDescription>
            Enter the contact details for the person responsible for managing
            this business account.
          </CardDescription>
        </div>
        <form.AppField
          name="officerFirst"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="officerLast"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />

        <form.AppField
          name="officerRole"
          children={(field) => (
            <field.SelectField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              options={ROLES}
              className="lg:col-span-2 **:data-[slot=select-trigger]:rounded-2xl"
            />
          )}
        />

        <form.AppField
          name="officerMobile"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="officerEmail"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <div className="lg:col-span-2">
          <CardTitle className="text-lg">Primary Contact Address</CardTitle>
          <CardDescription>
            Provide the residential or mailing address of the primary contact
            listed above.
          </CardDescription>
        </div>
        <form.AppField
          name="officerStreet"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="officerCity"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="officerState"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
        <form.AppField
          name="officerZip"
          children={(field) => (
            <field.TextField
              label={t[field.name]}
              placeholder={t[`${field.name}Placeholder`]}
              className="**:data-[slot=input]:rounded-2xl"
            />
          )}
        />
      </FieldGroup>
    );
  },
});
