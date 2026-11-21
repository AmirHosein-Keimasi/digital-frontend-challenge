"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { FullReportData, Step1Data, Step2Data } from "@/lib/schemas";

export type WizardStep = 1 | 2 | 3;

export interface WizardContextValue {
  currentStep: WizardStep;
  formData: Partial<FullReportData>;
  /** داده معتبر مرحله ۱ را به پیش‌نویس اضافه می‌کند. */
  updateStep1: (data: Step1Data) => void;
  /** داده معتبر مرحله ۲ را به پیش‌نویس اضافه می‌کند. */
  updateStep2: (data: Step2Data) => void;
  /** رفتن به مرحله مشخص. */
  goToStep: (step: WizardStep) => void;
  /** پاک کردن پیش‌نویس از حافظه. */
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<Partial<FullReportData>>({});

  // TODO (Task 2): پیش‌نویس را در localStorage نگه دارید و بعد از mount بازیابی کنید.
  // جزئیات و شرایط خطا در README، بخش «Task 2» آمده است.

  const updateStep1 = useCallback((data: Step1Data) => {
    setFormData((previous) => ({ ...previous, ...data }));
  }, []);

  const updateStep2 = useCallback((data: Step2Data) => {
    setFormData((previous) => ({ ...previous, ...data }));
  }, []);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);

    // TODO (Task 3): پرش به جلو را وقتی مراحل قبلی معتبر نیستند مسدود کنید.
    // جزئیات در README، بخش «Task 3».
  }, []);

  // TODO (Task 2): ورودی localStorage را هم پاک کنید و یک دکمه «پاک کردن پیش‌نویس»
  // در <WizardShell /> اضافه کنید.
  const resetWizard = useCallback(() => {
    setFormData({});
    setCurrentStep(1);
  }, []);

  const value = useMemo<WizardContextValue>(
    () => ({
      currentStep,
      formData,
      updateStep1,
      updateStep2,
      goToStep,
      resetWizard,
    }),
    [currentStep, formData, updateStep1, updateStep2, goToStep, resetWizard],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardContextValue {
  const context = useContext(WizardContext);

  if (!context) {
    throw new Error("useWizard باید داخل <WizardProvider> استفاده شود.");
  }

  return context;
}
