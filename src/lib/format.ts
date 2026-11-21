const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/**
 * ارقام لاتین را به فارسی تبدیل می‌کند. از toLocaleString استفاده نمی‌کنیم، چون خروجی آن
 * ممکن است بین سرور و کلاینت فرق کند و hydration mismatch بسازد.
 */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}
