"use client";

import { Check, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { toPersianDigits } from "@/lib/format";
import { Step1General } from "./Step1General";
import { Step2Items } from "./Step2Items";
import { Step3Review } from "./Step3Review";
import { useWizard, type WizardStep } from "./WizardContext";

const steps: ReadonlyArray<{ id: WizardStep; title: string; description: string }> = [
  { id: 1, title: "اطلاعات عمومی", description: "مشخصات سایت و بازرس" },
  { id: 2, title: "یافته‌های بازرسی", description: "ثبت مشاهدات شما" },
  { id: 3, title: "مرور و ارسال", description: "تأیید و ارسال گزارش" },
];

export function WizardShell() {
  const { currentStep, goToStep } = useWizard();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ClipboardCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">بازرسی سایت</p>
              <p className="text-xs text-slate-500">ویزارد گزارش</p>
            </div>
          </div>
          <Badge>پیش‌نویس</Badge>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <nav aria-label="مراحل تکمیل" className="mb-6">
          <ol className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isComplete = currentStep > step.id;

              return (
                <li key={step.id}>
                  {/*
                    TODO (Task 3): برای مراحل غیرفعال aria-disabled بگذارید و پرش به جلو را
                    وقتی مرحله قبلی معتبر نیست مسدود کنید. جزئیات در README.
                  */}
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start transition-colors sm:gap-3 sm:px-3",
                      isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        isActive
                          ? "border-white/30 bg-white/10 text-white"
                          : isComplete
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-300 bg-white text-slate-500",
                      )}
                    >
                      {isComplete ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : (
                        toPersianDigits(step.id)
                      )}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-xs font-medium sm:text-sm",
                          isActive ? "text-white" : "text-slate-900",
                        )}
                      >
                        {step.title}
                      </span>
                      <span
                        className={cn(
                          "hidden truncate text-xs sm:block",
                          isActive ? "text-slate-300" : "text-slate-500",
                        )}
                      >
                        {step.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {currentStep === 1 ? <Step1General /> : null}
        {currentStep === 2 ? <Step2Items /> : null}
        {currentStep === 3 ? <Step3Review /> : null}

        <p className="mt-6 text-center text-xs text-slate-400">
          گزارش فقط در مرحله پایانی و پس از تأیید شما ارسال می‌شود.
        </p>
      </main>
    </div>
  );
}
