import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "NELLA_SHOPP | نلا شاپ - فروشگاه تخصصی زیبایی و اکسسوری",
  description: "خرید آنلاین انواع لوازم آرایشی، مراقبت پوستی، اکسسوری و هدایای فانتزی با ارسال سریع از نلا شاپ",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#faf7f9] text-slate-800 antialiased selection:bg-pink-200 selection:text-pink-900">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
