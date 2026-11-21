import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

/**
 * استایل مشترک دکمه‌ها؛ برای لینک‌هایی که باید شبیه دکمه دیده شوند هم استفاده می‌شود.
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  /** آیکون ابتدای دکمه. */
  startIcon?: ReactNode;
  /** آیکون انتهای دکمه. */
  endIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : startIcon}
      {children}
      {isLoading ? null : endIcon}
    </button>
  );
}
