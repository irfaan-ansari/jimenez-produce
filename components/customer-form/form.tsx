"use client";
import {
  useTranslation,
  LanguageSelector,
  type Translations,
} from "../ui/language-selector";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useConfirm } from "@/hooks/use-confirm";
import { useAppForm } from "@/hooks/form-context";
import { createCustomer } from "@/server/customer-application";
import { defaultValues } from "@/lib/constants/customer";
import { steps } from "@/lib/constants/customer-form-steps";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import translations from "@/lib/constants/translations.json";
import { formOptions, useStore } from "@tanstack/react-form";
import { customerSchema } from "@/lib/form-schema/customer-schema";
import { Tabs, TabsContent } from "../ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import React from "react";

const STORAGE_KEY = "customer-form";

const initialValues = (() => {
  if (typeof window === "undefined") return defaultValues;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultValues;
  } catch {
    return defaultValues;
  }
})();

export const formOpts = formOptions({
  defaultValues: initialValues || defaultValues,
  validators: {
    onSubmit: ({ value, formApi }) => {
      return formApi.parseValuesWithSchema(
        steps[value.step as number].schema as typeof customerSchema,
      );
    },
  },
});

export const CustomerForm = () => {
  const confirm = useConfirm();
  const router = useRouter();
  const { t, dir, setLanguage, language } = useTranslation(
    translations as Translations,
    "en",
  );

  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ value, formApi }) => {
      if (value.step < steps.length - 1) {
        formApi.setFieldValue("step", value.step + 1);
        return;
      }

      // upload files and send the files url to
      const sign = await upload(
        `customer/${value.signature.name}`,
        value.signature,
        {
          access: "public",
          handleUploadUrl: "/api/upload",
        },
      );

      const { certificate, dlFront, dlBack, signature, ...rest } = value;
      // submit form
      const { success, error } = await createCustomer({
        ...rest,
        certificateUrl: value.certificate,
        dlFrontUrl: value.dlFront,
        dlBackUrl: value.dlBack,
        signatureUrl: sign.url,
      });

      if (success) {
        localStorage.removeItem(STORAGE_KEY);
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

  React.useEffect(() => {
    return form.store.subscribe(() => {
      const values = form.store.state.values;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
  }, [form]);

  return (
    <Tabs value={step.toString()} dir={dir}>
      <LanguageSelector
        value={language}
        onValueChange={(v) => setLanguage(v)}
        className="mb-8 ml-auto"
      />

      <form
        className="@container"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="shadow-md rounded-2xl gap-8 lg:py-8 ring ring-border/50 bg-secondary/20">
          <CardHeader className="space-y-1 lg:px-8">
            <form.Subscribe selector={(state) => state.values.step}>
              {(step) => {
                const progress = Math.round((step / steps.length) * 100);

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium uppercase">
                        Step {step + 1} of {steps.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {progress}% Complete
                      </span>
                    </div>

                    <div className="bg-secondary h-2.5 w-full rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                );
              }}
            </form.Subscribe>
          </CardHeader>
          {steps.map((step, i) => (
            <TabsContent value={i.toString()} key={step.key}>
              <CardContent className="lg:px-8">
                <step.component
                  // @ts-ignore
                  form={form}
                />
              </CardContent>
            </TabsContent>
          ))}

          {/* submit and preview */}
          <CardFooter className="justify-end gap-6 lg:px-8">
            {/* reset*/}
            <Button
              size="xl"
              className="min-w-32 rounded-2xl"
              type="button"
              variant="outline"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                form.reset();
              }}
            >
              Reset
            </Button>
            {step > 0 && step < steps.length && (
              <Button
                size="xl"
                className="min-w-32 rounded-2xl"
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
                  className="min-w-32 rounded-2xl"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader className="animate-spin" />}
                  {step < steps.length - 1 ? "Next" : "Submit"}
                  {step < steps.length && <ArrowRight />}
                </Button>
              )}
            />
          </CardFooter>
        </Card>
      </form>
    </Tabs>
  );
};
