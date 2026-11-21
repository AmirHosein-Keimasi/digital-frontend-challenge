"use client";

import { ArrowRight, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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
import { inspectionTypeLabels } from "@/lib/options";
import { useWizard } from "./WizardContext";

export function Step3Review() {
  const { formData, goToStep } = useWizard();
  const inspectionType = formData.inspectionType
    ? inspectionTypeLabels[formData.inspectionType]
    : "تعیین نشده";
  const findingCount = formData.items?.length ?? 0;

  // TODO (Task 4): خلاصه داده‌ها، اتصال به submitReport و مدیریت pending و خطا.
  // جزئیات در README، بخش «Task 4».

  return (
    <Card>
      <CardHeader>
        <CardTitle>مرور و ارسال</CardTitle>
        <CardDescription>
          پیش از ارسال گزارش به سرویس بازرسی، اطلاعات زیر را بررسی کنید.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
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
          </dl>
        </section>

        <section aria-labelledby="review-findings">
          <div className="flex items-center justify-between gap-3">
            <h3 id="review-findings" className="text-xs font-semibold text-slate-500">
              یافته‌ها
            </h3>
            <Badge tone={findingCount > 0 ? "info" : "warning"}>
              {toPersianDigits(findingCount)} ثبت‌شده
            </Badge>
          </div>

          <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
            پس از ثبت یافته‌ها، خلاصه آن‌ها در این بخش نمایش داده می‌شود.
          </div>
        </section>
      </CardContent>

      <CardFooter>
        <Button
          variant="secondary"
          onClick={() => goToStep(2)}
          startIcon={<ArrowRight className="size-4" aria-hidden="true" />}
        >
          بازگشت
        </Button>

        <Button disabled startIcon={<Send className="size-4" aria-hidden="true" />}>
          ارسال گزارش
        </Button>
      </CardFooter>
    </Card>
  );
}
