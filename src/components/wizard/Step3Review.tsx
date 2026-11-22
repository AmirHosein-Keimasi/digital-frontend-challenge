"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Send } from "lucide-react";
import { submitReport } from "@/app/actions";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { toPersianDigits } from "@/lib/format";
import { inspectionTypeLabels, severityLabels } from "@/lib/options";
import type { FieldErrors, FindingItem } from "@/lib/schemas";
import { useWizard } from "./WizardContext";

const severityTones: Record<FindingItem["severity"], BadgeTone> = {
  low: "info",
  medium: "warning",
  high: "danger",
};

export function Step3Review() {
  const router = useRouter();
  const { formData, goToStep, resetWizard } = useWizard();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | undefined>();
  const [isPending, startTransition] = useTransition();

  const inspectionType = formData.inspectionType
    ? inspectionTypeLabels[formData.inspectionType]
    : "تعیین نشده";
  const items = formData.items ?? [];
  const isEmergency = formData.inspectionType === "emergency";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors(undefined);

    startTransition(async () => {
      const result = await submitReport(formData);

      if (!result.success) {
        setError(result.error);
        setFieldErrors(result.fieldErrors);
        return;
      }

      resetWizard();
      router.push(`/success?id=${encodeURIComponent(result.reportId)}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>مرور و ارسال</CardTitle>
          <CardDescription>
            پیش از ارسال گزارش به سرویس بازرسی، اطلاعات زیر را بررسی کنید.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* بنر نمایش خطای سرور */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-medium">{error}</p>
                {fieldErrors && Object.keys(fieldErrors).length > 0 && (
                  <ul className="list-inside list-disc text-xs text-red-700">
                    {Object.entries(fieldErrors).map(([field, messages]) =>
                      messages?.map((msg, index) => <li key={`${field}-${index}`}>{msg}</li>),
                    )}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* خلاصه اطلاعات مرحله اول */}
          <section aria-labelledby="review-general">
            <h3 id="review-general" className="text-xs font-semibold text-slate-500">
              اطلاعات عمومی
            </h3>
            <dl className="mt-3 grid gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">نام سایت</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">
                  {formData.siteName ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">ایمیل بازرس</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">
                  <bdi dir="ltr">{formData.inspectorEmail ?? "—"}</bdi>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">نوع بازرسی</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900">{inspectionType}</dd>
              </div>
              {isEmergency && (
                <div>
                  <dt className="text-xs text-slate-500">مخاطب ارجاع اضطراری</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-900">
                    {formData.escalationContact ?? "—"}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* خلاصه یافته‌های مرحله دوم */}
          <section aria-labelledby="review-findings">
            <div className="flex items-center justify-between gap-3">
              <h3 id="review-findings" className="text-xs font-semibold text-slate-500">
                یافته‌ها
              </h3>
              <Badge tone={items.length > 0 ? "info" : "warning"}>
                {toPersianDigits(items.length)} ثبت‌شده
              </Badge>
            </div>

            {items.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                {items.map((item, index) => (
                  <li key={item.id ?? index} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-medium text-slate-900">{item.title}</span>
                      <Badge tone={severityTones[item.severity]}>
                        {severityLabels[item.severity]}
                      </Badge>
                    </div>
                    {item.notes && (
                      <p className="mt-1.5 text-xs whitespace-pre-wrap text-slate-500">
                        {item.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                هیچ یافته‌ای ثبت نشده است.
              </div>
            )}
          </section>
        </CardContent>

        <CardFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => goToStep(2)}
            disabled={isPending}
            startIcon={<ArrowRight className="size-4" aria-hidden="true" />}
          >
            بازگشت
          </Button>

          <Button
            type="submit"
            isLoading={isPending}
            startIcon={<Send className="size-4" aria-hidden="true" />}
          >
            ارسال گزارش
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
