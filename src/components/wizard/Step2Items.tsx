"use client";

import { ArrowLeft, ArrowRight, Plus, ShieldAlert } from "lucide-react";
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
import { useWizard } from "./WizardContext";

export function Step2Items() {
  const { formData, goToStep } = useWizard();
  const isEmergency = formData.inspectionType === "emergency";
  const findingCount = formData.items?.length ?? 0;

  // TODO (Task 1): فرم یافته‌ها و فیلد مخاطب اضطراری را پیاده‌سازی کنید.
  // جزئیات اعتبارسنجی و رفتار دکمه‌ها در README، بخش «Task 1» آمده است.

  return (
    <Card>
      <CardHeader>
        <CardTitle>یافته‌های بازرسی</CardTitle>
        <CardDescription>
          هر مشکلی را که در محل مشاهده کرده‌اید ثبت کنید. پیش از ارسال، همه موارد را مرور خواهید
          کرد.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEmergency ? (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>این بازرسی اضطراری است؛ برای ادامه باید مخاطب اضطراری را وارد کنید.</p>
          </div>
        ) : null}

        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
          <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-medium text-slate-700">هنوز یافته‌ای ثبت نشده است</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
            برای هر مورد عنوان، شدت و در صورت نیاز توضیحات را وارد کنید.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            size="sm"
            disabled
            startIcon={<Plus className="size-4" aria-hidden="true" />}
          >
            افزودن یافته
          </Button>
        </div>

        <p className="text-xs text-slate-500">
          {findingCount === 1 ? "۱ یافته" : `${toPersianDigits(findingCount)} یافته`} در پیش‌نویس
          فعلی.
        </p>
      </CardContent>

      <CardFooter>
        <Button
          variant="secondary"
          onClick={() => goToStep(1)}
          startIcon={<ArrowRight className="size-4" aria-hidden="true" />}
        >
          بازگشت
        </Button>

        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-slate-500 sm:block">مرحله ۲ از ۳</p>
          <Button disabled endIcon={<ArrowLeft className="size-4" aria-hidden="true" />}>
            بعدی
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
