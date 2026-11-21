"use client";

import { Check, ClipboardCheck, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  const { currentStep, goToStep, isStepAccessible, resetWizard, hasDraft, isHydrated } =
    useWizard();

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

          <div className="flex items-center gap-2">
            {/* دکمه پاک کردن پیش‌نویس فقط زمانی که پیش‌نویسی وجود داشته باشد */}
            {hasDraft && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetWizard}
                className="text-xs text-slate-500 hover:text-red-600"
                startIcon={<RotateCcw className="size-3.5" aria-hidden="true" />}
              >
                پاک کردن پیش‌نویس
              </Button>
            )}
            <Badge>پیش‌نویس</Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <nav aria-label="مراحل تکمیل" className="mb-6">
          <ol className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1.5">
            {steps.map((step) => {
              const isActive = step.id === currentStep;
              const isComplete = currentStep > step.id;
              const isAccessible = isStepAccessible(step.id);

              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    disabled={!isAccessible}
                    aria-disabled={!isAccessible ? "true" : undefined}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start transition-colors sm:gap-3 sm:px-3",
                      isActive
                        ? "bg-slate-900 text-white"
                        : isAccessible
                          ? "text-slate-600 hover:bg-slate-100"
                          : "cursor-not-allowed text-slate-400 opacity-40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        isActive
                          ? "border-white/30 bg-white/10 text-white"
                          : isComplete
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : isAccessible
                              ? "border-slate-300 bg-white text-slate-500"
                              : "border-slate-200 bg-slate-100 text-slate-400",
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
                          isActive
                            ? "text-white"
                            : isAccessible
                              ? "text-slate-900"
                              : "text-slate-400",
                        )}
                      >
                        {step.title}
                      </span>
                      <span
                        className={cn(
                          "hidden truncate text-xs sm:block",
                          isActive
                            ? "text-slate-300"
                            : isAccessible
                              ? "text-slate-500"
                              : "text-slate-400",
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

        {!isHydrated ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            در حال بارگذاری پیش‌نویس...
          </div>
        ) : (
          <>
            {currentStep === 1 && <Step1General />}
            {currentStep === 2 && <Step2Items />}
            {currentStep === 3 && <Step3Review />}
          </>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          گزارش فقط در مرحله پایانی و پس از تأیید شما ارسال می‌شود.
        </p>
      </main>
    </div>
  );
}
