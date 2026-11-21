"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
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
import { inspectionTypeLabels } from "@/lib/options";
import { step1Schema, type FieldErrors, type Step1Data } from "@/lib/schemas";
import { useWizard } from "./WizardContext";

export function Step1General() {
  const { formData, updateStep1, goToStep } = useWizard();
  const [errors, setErrors] = useState<FieldErrors>({});

  // استیت فرم مستقیماً از Context (منبع واحد حقیقت) مشتق می‌شود
  const values: Step1Data = {
    siteName: formData.siteName ?? "",
    inspectorEmail: formData.inspectorEmail ?? "",
    inspectionType: formData.inspectionType ?? "routine",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = step1Schema.safeParse(values);

    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setErrors({});
    updateStep1(parsed.data);
    goToStep(2);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات عمومی</CardTitle>
          <CardDescription>
            مشخص کنید بازرسی در کجا انجام شده و چه کسی این گزارش را ثبت می‌کند.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5">
          <Input
            label="نام سایت"
            name="siteName"
            required
            autoComplete="organization"
            placeholder="مثلاً انبار مرکزی شمال"
            hint="نامی را وارد کنید که روی تابلو یا قرارداد سایت درج شده است."
            value={values.siteName}
            error={errors.siteName?.[0]}
            onChange={(event) => {
              updateStep1({ siteName: event.target.value });
              setErrors((previous) => ({ ...previous, siteName: undefined }));
            }}
          />

          <Input
            label="ایمیل بازرس"
            name="inspectorEmail"
            type="email"
            dir="ltr"
            required
            autoComplete="email"
            placeholder="inspector@company.com"
            value={values.inspectorEmail}
            error={errors.inspectorEmail?.[0]}
            onChange={(event) => {
              updateStep1({ inspectorEmail: event.target.value });
              setErrors((previous) => ({ ...previous, inspectorEmail: undefined }));
            }}
          />

          <Select
            label="نوع بازرسی"
            name="inspectionType"
            required
            value={values.inspectionType}
            error={errors.inspectionType?.[0]}
            onChange={(event) => {
              updateStep1({
                inspectionType: event.target.value as Step1Data["inspectionType"],
              });
              setErrors((previous) => ({ ...previous, inspectionType: undefined }));
            }}
          >
            {Object.entries(inspectionTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </CardContent>

        <CardFooter>
          <p className="text-xs text-slate-500">مرحله ۱ از ۳</p>
          <Button type="submit" endIcon={<ArrowLeft className="size-4" aria-hidden="true" />}>
            ادامه
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
