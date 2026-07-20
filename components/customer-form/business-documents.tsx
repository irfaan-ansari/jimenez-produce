import { FieldGroup } from "../ui/field";
import { withForm } from "@/hooks/form-context";
import translations from "@/lib/constants/translations.json";
import { businessDocuments } from "@/lib/constants/customer";
import { type Translations, useTranslation } from "../ui/language-selector";

export const Documents = withForm({
  defaultValues: businessDocuments,
  render: function Render({ form }) {
    const { t } = useTranslation(translations as Translations, "en");
    return (
      <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-2 bg-amber-600/10 text-amber-600 font-medium p-4 border border-amber-600/10 rounded-2xl">
          All uploaded files must be in PDF, JPG, or PNG format and must not
          exceed 5 MB per file.
        </div>

        <form.AppField
          name="certificate"
          children={(field) => (
            <field.FileFieldNew
              label={t[field.name]}
              className="lg:col-span-2"
            />
          )}
        />

        <form.AppField
          name="dlFront"
          children={(field) => (
            <field.FileFieldNew
              label={t[field.name]}
              className="lg:col-span-2"
            />
          )}
        />
        <form.AppField
          name="dlBack"
          children={(field) => (
            <field.FileFieldNew
              label={t[field.name]}
              className="lg:col-span-2"
            />
          )}
        />
      </FieldGroup>
    );
  },
});
