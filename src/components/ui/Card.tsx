import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("rounded-xl border border-slate-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 border-b border-slate-100 px-6 py-5", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<"h2">) {
  return <h2 className={cn("text-base font-semibold text-slate-900", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}
