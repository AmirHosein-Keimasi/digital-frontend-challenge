"use server";

import { z } from "zod";
import { fullReportSchema, type SubmitReportResult } from "@/lib/schemas";

const SIMULATED_LATENCY_MS = 1000;

/**
 * اکشن آزمایشی. همه‌چیز در سرور دوباره اعتبارسنجی می‌شود. اگر نام سایت شامل «error»
 * باشد، یک خطای سرویس بالادستی شبیه‌سازی می‌شود.
 */
export async function submitReport(payload: unknown): Promise<SubmitReportResult> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  const parsed = fullReportSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      error: "اعتبارسنجی داده‌ها در سرور ناموفق بود.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (parsed.data.siteName.toLowerCase().includes("error")) {
    return {
      success: false,
      error: "سرویس بازرسی نام این سایت را نپذیرفت. دوباره تلاش کنید یا نام سایت را ویرایش کنید.",
    };
  }

  return {
    success: true,
    reportId: `INSP-${Date.now().toString().slice(-6)}`,
  };
}
