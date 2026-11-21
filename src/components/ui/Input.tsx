"use client";

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Field, useFieldIds } from "./Field";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  /** پیام خطای زیر فیلد. */
  error?: string;
  /** راهنمای کوتاه زیر فیلد؛ در صورت وجود خطا نمایش داده نمی‌شود. */
  hint?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  containerClassName,
  className,
  id,
  required,
  ...props
}: InputProps) {
  const { fieldId, hintId, errorId, describedBy } = useFieldIds({
    id,
    hasError: Boolean(error),
    hasHint: Boolean(hint) && !error,
  });

  return (
    <Field
      label={label}
      htmlFor={fieldId}
      required={required}
      hint={hint}
      hintId={hintId}
      error={error}
      errorId={errorId}
      className={containerClassName}
    >
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-xs",
          "placeholder:text-slate-400 focus:ring-2 focus:outline-none",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-slate-400 focus:ring-slate-200",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
          className,
        )}
        {...props}
      />
    </Field>
  );
}
