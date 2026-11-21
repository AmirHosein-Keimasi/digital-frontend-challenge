import { z } from "zod";

export const inspectionTypeValues = ["routine", "emergency", "follow_up"] as const;
export const severityValues = ["low", "medium", "high"] as const;

/** مرحله ۱: چه کسی و کجا را بازرسی می‌کند. */
export const step1Schema = z.object({
  siteName: z.string().trim().min(2, "نام سایت باید حداقل ۲ کاراکتر باشد."),
  inspectorEmail: z.string().trim().email("ایمیل معتبر وارد کنید."),
  inspectionType: z.enum(inspectionTypeValues, {
    error: "نوع بازرسی را انتخاب کنید.",
  }),
});

/** یک یافته در مرحله ۲. */
export const findingItemSchema = z.object({
  id: z.string().min(1, "شناسه یافته موجود نیست."),
  title: z.string().trim().min(3, "عنوان باید حداقل ۳ کاراکتر باشد."),
  severity: z.enum(severityValues, {
    error: "شدت را انتخاب کنید.",
  }),
  notes: z.string().optional(),
});

/** مرحله ۲: بخش پویای فرم. */
export const step2Schema = z.object({
  escalationContact: z.string().optional(),
  items: z.array(findingItemSchema).min(1, "حداقل یک یافته اضافه کنید."),
});

/**
 * داده نهایی ارسال به سرور. قاعده اضطراری اینجاست و نه در `step2Schema`، چون مرحله ۲
 * از نوع بازرسی مرحله ۱ خبر ندارد.
 */
export const fullReportSchema = step1Schema.extend(step2Schema.shape).superRefine((data, ctx) => {
  if (data.inspectionType !== "emergency") {
    return;
  }

  const contact = data.escalationContact?.trim() ?? "";

  if (contact.length < 3) {
    ctx.addIssue({
      code: "custom",
      path: ["escalationContact"],
      message: "برای بازرسی اضطراری، مخاطب ارجاع الزامی است (حداقل ۳ کاراکتر).",
    });
  }
});

/** اسکیما برای ذخیره و بازیابی پیش‌نویس (پشتیبانی از داده‌های ناقص در حین تایپ). */
export const draftSchema = step1Schema.partial().extend({
  escalationContact: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        severity: z.enum(severityValues),
        notes: z.string().optional(),
      }),
    )
    .optional(),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type FindingItem = z.infer<typeof findingItemSchema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type FullReportData = z.infer<typeof fullReportSchema>;

/** خطاهای فیلدها با کلید نام فیلد، همان‌طور که `z.flattenError` برمی‌گرداند. */
export type FieldErrors = Record<string, string[] | undefined>;

export type SubmitReportResult =
  | { success: true; reportId: string }
  | { success: false; error: string; fieldErrors?: FieldErrors };
