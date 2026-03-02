"use client";
import {
  LanguageSelector,
  type Translations,
  useTranslation,
} from "../ui/language-selector";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { defaultValues } from "@/lib/constants/customer";
import { steps } from "@/lib/constants/customer-form-steps";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import translations from "@/lib/constants/translations.json";
import { formOptions, useStore } from "@tanstack/react-form";
import { customerSchema } from "@/lib/form-schema/customer-schema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { createCustomer } from "@/server/customer";

export const formOpts = formOptions({
  defaultValues: {
    ...defaultValues,
  },
  validators: {
    onSubmit: ({ value, formApi }) => {
      return formApi.parseValuesWithSchema(
        steps[value.step as number].schema as typeof customerSchema
      );
    },
  },
});

export const CustomerForm = () => {
  const confirm = useConfirm();
  const router = useRouter();
  const { t, dir, setLanguage, language } = useTranslation(
    translations as Translations,
    "en"
  );

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value, formApi }) => {
      if (value.step < steps.length - 1) {
        formApi.setFieldValue("step", value.step + 1);
        return;
      }

      const files = [
        value.certificate,
        value.signature,
        value.dlFront,
        value.dlBack,
      ];

      // upload files and send the files url to
      const [cert, sig, front, back] = await Promise.all(
        files.map((file) =>
          upload(`customer/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          })
        )
      );
      const { certificate, dlFront, dlBack, signature, ...rest } = value;
      // submit form
      const { success, error } = await createCustomer({
        ...rest,
        certificateUrl: cert.url,
        dlFrontUrl: front.url,
        dlBackUrl: back.url,
        signatureUrl: sig.url,
      });

      if (success) {
        confirm.success({
          title: "Application Submitted Successfully",
          description: `Your application has been successfully submitted and is now under review. 
            If additional information is required, our team will contact you.`,
          actionLabel: "Back to home",
          action: () => router.push("/"),
        });
        form.reset();
      } else {
        toast.error(error.message);
      }
    },
  });

  const step = useStore(form.store, (state) => state.values.step);

  return (
    <Tabs value={step.toString()} dir={dir}>
      <LanguageSelector
        value={language}
        onValueChange={(v) => setLanguage(v)}
        className="mb-8 ml-auto"
      />
      <TabsList className="w-full bg-background gap-2 mb-8 p-0">
        {steps.map((s, i) => (
          <TabsTrigger
            key={s.title}
            value={step.toString()}
            className="justify-start h-auto p-0 shadow-none! group"
            data-completed={step >= i}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 group-data-[completed=true]:text-primary"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
            </svg>
            <span className="h-1 rounded-full flex-1 bg-muted-foreground relative after:absolute after:scale-x-0 after:inset-0 group-data-[completed=true]:after:scale-x-100 after:transition after:origin-left group-data-[completed=true]:after:bg-primary after:rounded-full" />
          </TabsTrigger>
        ))}
      </TabsList>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {steps.map((step, i) => (
          <TabsContent value={i.toString()} key={step.title}>
            <h4 className="text-xl font-semibold mb-1">{t[step.title]}</h4>
            <p className="mb-4 text-muted-foreground">{t[step.description]}</p>

            <step.component
              // @ts-ignore
              form={form}
            />
          </TabsContent>
        ))}

        {/* submit and preview */}
        <div className="flex gap-4 items-center justify-end mt-8">
          {/* previous button */}
          {step > 0 && step < steps.length && (
            <Button
              size="xl"
              className="min-w-32"
              type="button"
              variant="secondary"
              onClick={() => form.setFieldValue("step", step - 1)}
            >
              <ArrowLeft />
              Previous
            </Button>
          )}

          {/* submit button */}
          <form.Subscribe
            children={({ isSubmitting }) => (
              <Button
                size="xl"
                className="min-w-32"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader className="animate-spin" />}
                {step < steps.length - 1 ? "Next" : "Submit"}
                {step < steps.length && <ArrowRight />}
              </Button>
            )}
          />
        </div>
      </form>
    </Tabs>
  );
};
