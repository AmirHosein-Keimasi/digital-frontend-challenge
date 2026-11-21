import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

// Vazirmatn v33.0.3 (SIL OFL 1.1)، برگرفته از بسته npm با همین نام.
// مجوز: src/app/fonts/OFL.txt
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "گزارش بازرسی سایت",
    template: "%s · گزارش بازرسی سایت",
  },
  description: "ثبت و ارسال یافته‌های بازرسی سایت.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
