"use client";

import { createFormHook } from "@tanstack/react-form-nextjs";
import {
  AppCheckboxField,
  AppDateField,
  AppSubmitButton,
  AppTextField,
} from "./bindings/fields";
import { fieldContext, formContext } from "./contexts";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    AppTextField,
    AppDateField,
    AppCheckboxField,
  },
  formComponents: {
    AppSubmitButton,
  },
});
