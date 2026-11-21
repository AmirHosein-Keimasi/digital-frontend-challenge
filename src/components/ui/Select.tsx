"use client";

import type { ComponentPropsWithoutRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Field, useFieldIds } from "./Field";

export interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  label: string;
  /** پیام خطای زیر فیلد. */
  error?: string;
  /** راهنمای کوتاه زیر فیلد؛ در صورت وجود خطا نمایش داده نمی‌شود. */
  hint?: string;
  containerClassName?: string;
}

export function Select({
  label,
  error,
  hint,
  containerClassName,
  className,
  id,
  required,
  children,
  ...props
}: SelectProps) {
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
      <div className="relative">
        <select
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border bg-white ps-3 pe-9 text-sm text-slate-900 shadow-xs",
            "focus:ring-2 focus:outline-none",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-slate-400 focus:ring-slate-200",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </Field>
  );
}
