"use client";
import {
  DateField,
  RadioField,
  SelectField,
  SignatureField,
  TextField,
} from "@/components/form-field";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    DateField,
    SelectField,
    SignatureField,
    RadioField,
  },
  formComponents: {},
});

export { useAppForm, withForm };
