"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldIdsOptions {
  id?: string;
  hasError: boolean;
  hasHint: boolean;
}

export function useFieldIds({ id, hasError, hasHint }: FieldIdsOptions) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy =
    [hasError ? errorId : null, hasHint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return { fieldId, hintId, errorId, describedBy };
}

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  hintId: string;
  error?: string;
  errorId: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  hintId,
  error,
  errorId,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
        {required ? (
          <span className="ms-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {children}

      {hint && !error ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
