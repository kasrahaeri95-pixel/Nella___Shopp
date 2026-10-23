"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  ChevronUp,
  Send,
  Phone,
  Mail,
  Heart,
  Lock,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-pink-100 text-slate-700 mt-16">
      {/* Back to top row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-pink-50">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-pink-200">
            <Image src="/logo.png" alt="NELLA_SHOPP Logo" fill sizes="36px" className="object-cover" />
          </div>
          <span className="text-sm font-black text-pink-600">NELLA_SHOPP</span>
        </div>
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-pink-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-pink-200 transition-colors"
        >
          <span>بازگشت به بالا</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Trust Badges - Digikala Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-pink-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 group-hover:bg-pink-100 text-pink-500 flex items-center justify-center transition-colors">
              <Truck className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-slate-800">امکان تحویل اکسپرس</span>
            <span className="text-[11px] text-slate-500">ارسال سریع به تمام نقاط ایران</span>
          </div>

          <div className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 group-hover:bg-sky-100 text-sky-500 flex items-center justify-center transition-colors">
              <Headphones className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-slate-800">پشتیبانی ۲۴ ساعته</span>
            <span className="text-[11px] text-slate-500">پاسخگویی در ۷ روز هفته</span>
          </div>

          <div className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 group-hover:bg-pink-100 text-pink-500 flex items-center justify-center transition-colors">
              <RotateCcw className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-slate-800">۷ روز ضمانت بازگشت کالا</span>
            <span className="text-[11px] text-slate-500">ضمانت بازگشت بی‌قید و شرط</span>
          </div>

          <div className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 group-hover:bg-sky-100 text-sky-500 flex items-center justify-center transition-colors">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-slate-800">ضمانت اصل بودن کالا</span>
            <span className="text-[11px] text-slate-500">کالاهای اورجینال و باکیفیت نلا</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* About Column */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-1.5">
              <span>فروشگاه نلا شاپ</span>
              <span className="text-pink-600 font-mono text-sm">(NELLA_SHOPP)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              نلا شاپ، مرکز تخصصی ارائه محصولات زیبایی، مراقبت پوستی، اکسسوری‌های ترند و فانتزی و هدایای شیک است. هدف ما ایجاد یک تجربه خرید آرامش‌بخش، زیبا و باکیفیت با رنگ‌های صورتی و آبی آسمانی برای تمام همراهان عزیز است.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-pink-500" />
                ۰۲۱-۸۸۹۹۷۷۸۸
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-sky-500" />
                info@nellashopp.ir
              </span>
            </div>
          </div>

          {/* Quick links 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">راهنمای خرید</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#special-offers" className="hover:text-pink-600">شگفت‌انگیزها</a></li>
              <li><span className="hover:text-pink-600 cursor-pointer">نحوه ثبت سفارش</span></li>
              <li><span className="hover:text-pink-600 cursor-pointer">رویه ارسال سفارش</span></li>
              <li><span className="hover:text-pink-600 cursor-pointer">شیوه‌های پرداخت</span></li>
            </ul>
          </div>

          {/* Quick links 2 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">خدمات مشتریان</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><span className="hover:text-pink-600 cursor-pointer">پرسش‌های متداول</span></li>
              <li><span className="hover:text-pink-600 cursor-pointer">رویه بازگرداندن کالا</span></li>
              <li><span className="hover:text-pink-600 cursor-pointer">حریم خصوصی</span></li>
              <li>
                <Link href="/seller" className="text-pink-600 font-bold hover:underline flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>ورود فروشندگان</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social and Trust */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">ما را در شبکه‌های اجتماعی دنبال کنید</h4>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 flex items-center justify-center transition-colors"
                title="اینستاگرام نلا شاپ: @nella_shopp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition-colors"
                title="کانال تلگرام نلا شاپ: @nella_support"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
            <div className="pt-2 text-xs text-slate-500">
              <span>صفحه رسمی اینستاگرام: </span>
              <b className="text-pink-600 font-mono">@nella_shopp</b>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-slate-50 py-4 px-4 text-center text-xs text-slate-500 border-t border-pink-100">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>تمامی حقوق مادی و معنوی این وب‌سایت متعلق به فروشگاه</span>
          <b className="text-pink-600 font-black">NELLA_SHOPP</b>
          <span>(نلا شاپ) می‌باشد.</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline-block" />
        </p>
      </div>
    </footer>
  );
}
