export type ClassValue = string | false | null | undefined;

/** اتصال نام کلاس‌ها. فعلاً وابستگی جداگانه‌ای لازم نیست. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
