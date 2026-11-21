"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  draftSchema,
  fullReportSchema,
  step1Schema,
  type FullReportData,
  type Step1Data,
  type Step2Data,
} from "@/lib/schemas";

export type WizardStep = 1 | 2 | 3;

const STORAGE_KEY = "site_inspection_draft_v1";

export interface WizardContextValue {
  currentStep: WizardStep;
  formData: Partial<FullReportData>;
  isHydrated: boolean;
  hasDraft: boolean;
  /** داده‌های مرحله ۱ را در پیش‌نویس ذخیره می‌کند. */
  updateStep1: (data: Partial<Step1Data>) => void;
  /** داده‌های مرحله ۲ را در پیش‌نویس ذخیره می‌کند. */
  updateStep2: (data: Step2Data) => void;
  /** رفتن به مرحله مشخص. */
  goToStep: (step: WizardStep) => void;
  /** بررسی امکان دسترسی به مرحله مشخص بر اساس گارد ناوبری. */
  isStepAccessible: (step: WizardStep) => boolean;
  /** پاک کردن کامل پیش‌نویس از حافظه رم و استوریج. */
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<Partial<FullReportData>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // بازیابی پیش‌نویس از localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed) &&
          parsed.formData &&
          typeof parsed.formData === "object" &&
          !Array.isArray(parsed.formData)
        ) {
          const result = draftSchema.safeParse(parsed.formData);
          if (result.success) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(result.data);

            if ([1, 2, 3].includes(parsed.currentStep)) {
              setCurrentStep(parsed.currentStep as WizardStep);
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage is unavailable
      }
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // ذخیره‌سازی خودکار در localStorage پس از هیدریشن کلاینت
  useEffect(() => {
    if (!isHydrated) return;

    try {
      if (Object.keys(formData).length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
      }
    } catch {
      // در صورت خطای Storage کار در حافظه رم ادامه می‌یابد
    }
  }, [formData, currentStep, isHydrated]);

  const updateStep1 = useCallback((data: Partial<Step1Data>) => {
    setFormData((previous) => ({ ...previous, ...data }));
  }, []);

  const updateStep2 = useCallback((data: Step2Data) => {
    setFormData((previous) => ({ ...previous, ...data }));
  }, []);

  // گارد ناوبری: بررسی دسترسی به هر مرحله بر اساس اعتبار مراحل قبلی (تسک ۳)
  const isStepAccessible = useCallback(
    (step: WizardStep): boolean => {
      // کاربر آزاد است روی هدر مرحله قبلی کلیک کرده و به عقب برگردد
      if (step <= currentStep) return true;

      // پرش به جلو در صورتی که مرحله قبلی نامعتبر است باید مسدود باشد
      if (step === 2) {
        return step1Schema.safeParse(formData).success;
      }

      if (step === 3) {
        return fullReportSchema.safeParse(formData).success;
      }

      return false;
    },
    [currentStep, formData],
  );

  const goToStep = useCallback(
    (step: WizardStep) => {
      // مسدودسازی پرش مستقیم به جلو وقتی مرحله قبلی نامعتبر است
      if (isStepAccessible(step)) {
        setCurrentStep(step);
      }
    },
    [isStepAccessible],
  );

  const resetWizard = useCallback(() => {
    setFormData({});
    setCurrentStep(1);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is unavailable
    }
  }, []);

  const hasDraft = Object.keys(formData).length > 0;

  const value = useMemo<WizardContextValue>(
    () => ({
      currentStep,
      formData,
      isHydrated,
      hasDraft,
      updateStep1,
      updateStep2,
      goToStep,
      isStepAccessible,
      resetWizard,
    }),
    [
      currentStep,
      formData,
      isHydrated,
      hasDraft,
      updateStep1,
      updateStep2,
      goToStep,
      isStepAccessible,
      resetWizard,
    ],
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
