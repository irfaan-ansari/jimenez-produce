"use client";
import {
  DateField,
  FileField,
  RadioField,
  SelectField,
  SignatureField,
  TextField,
  PhoneField,
  PasswordField,
  TextAreaField,
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
    FileField,
    PhoneField,
    PasswordField,
    TextAreaField,
  },
  formComponents: {},
});

export { useAppForm, withForm };
