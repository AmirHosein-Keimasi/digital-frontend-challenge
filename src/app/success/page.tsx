import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "گزارش ثبت شد",
};

type SuccessPageProps = {
  searchParams: Promise<{ id?: string | string[] }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const reportId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-4 py-12">
      <Card>
        <CardContent className="flex flex-col items-center px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            <CircleCheck className="size-6" aria-hidden="true" />
          </span>

          <h1 className="mt-5 text-xl font-semibold text-slate-900">گزارش ثبت شد</h1>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            گزارش در صف سرویس بازرسی قرار گرفت. شناسه زیر را برای پیگیری نگه دارید.
          </p>

          <div className="mt-6 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="block text-xs font-medium text-slate-500">شناسه گزارش</span>
            <span dir="ltr" className="mt-1 block font-mono text-lg font-semibold text-slate-900">
              {reportId ?? "ثبت نشده"}
            </span>
          </div>

          {!reportId ? (
            <p className="mt-3 w-full text-start text-xs text-amber-700">
              شناسه گزارش در نشانی صفحه پیدا نشد. برای دریافت شناسه، ویزارد را کامل کنید.
            </p>
          ) : null}

          <Link href="/" className={buttonClasses("primary", "md", "mt-6 w-full sm:w-auto")}>
            <Plus className="size-4" aria-hidden="true" />
            شروع بازرسی جدید
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
