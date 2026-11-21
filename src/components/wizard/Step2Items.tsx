"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { toPersianDigits } from "@/lib/format";
import { severityLabels } from "@/lib/options";
import { step2Schema, type FindingItem } from "@/lib/schemas";
import { useWizard } from "./WizardContext";

// ساختار داده‌های فرم مرحله ۲ برای تایپ‌سیف بودن RHF
interface Step2FormValues {
  escalationContact?: string;
  items: FindingItem[];
}

export function Step2Items() {
  // دریافت داده‌های پیش‌نویس و متدهای تغییر مرحله از کانتکست
  const { formData, updateStep2, goToStep } = useWizard();
  const isEmergency = formData.inspectionType === "emergency";

  // ساخت پویای اسکیما: الزامی شدن مخاطب ارجاع تنها در شرایط بازرسی اضطراری
  const schema = useMemo(() => {
    return isEmergency
      ? step2Schema.extend({
          escalationContact: z
            .string()
            .trim()
            .min(3, "برای بازرسی اضطراری، مخاطب ارجاع الزامی است (حداقل ۳ کاراکتر)."),
        })
      : step2Schema;
  }, [isEmergency]);

  // راه‌اندازی React Hook Form به همراه resolver اعتبارسنجی Zod
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Step2FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      escalationContact: formData.escalationContact ?? "",
      items: formData.items ?? [],
    },
  });

  // مدیریت پویای ردیف‌های لیست یافته‌ها با useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // ذخیره ورودی‌های فعلی کاربر در کانتکست پیش از بازگشت به مرحله ۱
  function handleBack() {
    const current = getValues();
    updateStep2({
      escalationContact: isEmergency ? current.escalationContact : undefined,
      items: current.items,
    });
    goToStep(1);
  }

  // ثبت داده‌های تأییدشده در کانتکست و رفتن به مرحله مرور (مرحله ۳)
  function onSubmit(data: Step2FormValues) {
    updateStep2({
      escalationContact: isEmergency ? data.escalationContact?.trim() : undefined,
      items: data.items,
    });
    goToStep(3);
  }

  // افزودن سطر یافته جدید با شناسه منحصر‌به‌فرد
  function handleAddFinding() {
    append({
      id: crypto.randomUUID(),
      title: "",
      severity: "medium",
      notes: "",
    });
  }

  // بررسی خطای سطح آرایه (مانند شرط حداقل یک یافته)
  const itemsError = errors.items?.root?.message ?? errors.items?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>یافته‌های بازرسی</CardTitle>
          <CardDescription>
            مشاهدات و مشکلات محل را ثبت کنید. در مرحله بعد گزارش را مرور خواهید کرد.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* نمایش مشروط مخاطب ارجاع در بازرسی‌های اضطراری */}
          {isEmergency ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p>این بازرسی اضطراری است؛ ثبت مخاطب اضطراری الزامی می‌باشد.</p>
              </div>

              <Input
                label="مخاطب ارجاع"
                required
                placeholder="مثلاً علی رضایی - سرپرست شیفت"
                hint="شخص یا تیمی که در شرایط اضطراری باید فوراً مطلع شود."
                error={errors.escalationContact?.message}
                {...register("escalationContact")}
              />
            </div>
          ) : null}

          {/* نمایش حالت خالی در صورت نبود یافته */}
          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
              <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
                <Plus className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-medium text-slate-700">هنوز یافته‌ای ثبت نشده است</p>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                حداقل یک یافته برای ثبت گزارش لازم است.
              </p>
              <Button
                type="button"
                className="mt-4"
                variant="secondary"
                size="sm"
                onClick={handleAddFinding}
                startIcon={<Plus className="size-4" aria-hidden="true" />}
              >
                افزودن یافته
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* پیمایش روی ردیف‌های پویا با کلید پایدار field.id */}
              {fields.map((field, index) => {
                const itemError = errors.items?.[index];

                return (
                  <div
                    key={field.id}
                    className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4 sm:p-5"
                  >
                    {/* فیلد مخفی برای حفظ و ارسال شناسه پایدار یافته */}
                    <input type="hidden" {...register(`items.${index}.id`)} />

                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-sm font-semibold text-slate-800">
                        یافته {toPersianDigits(index + 1)}
                      </span>
                      {/* دکمه حذف سطر جاری */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        aria-label={`حذف یافته ${toPersianDigits(index + 1)}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        <span className="text-xs">حذف</span>
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <Input
                          label="عنوان یافته"
                          required
                          placeholder="مثلاً نشتی لوله اطفاء حریق"
                          error={itemError?.title?.message}
                          {...register(`items.${index}.title`)}
                        />
                      </div>
                      <div>
                        <Select
                          label="شدت"
                          required
                          error={itemError?.severity?.message}
                          {...register(`items.${index}.severity`)}
                        >
                          {Object.entries(severityLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <Textarea
                      label="توضیحات (اختیاری)"
                      rows={2}
                      placeholder="توضیحات تکمیلی یا مشاهدات مربوطه..."
                      {...register(`items.${index}.notes`)}
                    />
                  </div>
                );
              })}

              {/* دکمه افزودن سطر جدید در انتهای لیست */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddFinding}
                startIcon={<Plus className="size-4" aria-hidden="true" />}
              >
                افزودن یافته جدید
              </Button>
            </div>
          )}

          {/* خطای اعتبارسنجی حداقل تعداد یافته‌ها */}
          {itemsError ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {itemsError}
            </p>
          ) : null}

          <p className="text-xs text-slate-500">
            {toPersianDigits(fields.length)} یافته در پیش‌نویس فعلی.
          </p>
        </CardContent>

        <CardFooter>
          {/* دکمه بازگشت به مرحله ۱ */}
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            startIcon={<ArrowRight className="size-4" aria-hidden="true" />}
          >
            بازگشت
          </Button>

          <div className="flex items-center gap-3">
            <p className="hidden text-xs text-slate-500 sm:block">مرحله ۲ از ۳</p>
            {/* دکمه تأیید و رفتن به مرحله بعدی */}
            <Button type="submit" endIcon={<ArrowLeft className="size-4" aria-hidden="true" />}>
              بعدی
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
