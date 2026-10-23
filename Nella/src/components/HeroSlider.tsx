"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Sparkles, Heart, Gift, ArrowLeft } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "جشنواره بهاره نلا شاپ (NELLA_SHOPP)",
    subtitle: "تا ۵۰٪ تخفیف روی محبوب‌ترین محصولات آرایشی و مراقبت پوستی پاستلی",
    badge: "پیشنهاد ویژه این هفته",
    buttonText: "مشاهده تخفیف‌ها",
    category: "لوازم آرایشی",
    gradient: "from-pink-100 via-pink-50 to-sky-100",
    image: "/hero-banner.jpg",
  },
  {
    id: 2,
    title: "کالکشن جدید اکسسوری و پاپیون‌های نلا",
    subtitle: "کلیپس، کش موهای ساتن ابریشمی و زیورآلات نقره ترند دخترانه",
    badge: "جدیدترین‌ها",
    buttonText: "خرید اکسسوری‌ها",
    category: "زیورآلات و اکسسوری",
    gradient: "from-sky-100 via-sky-50 to-pink-100",
    image: "https://images.pexels.com/photos/2866796/pexels-photo-2866796.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: 3,
    title: "پک‌های کادویی و فانتزی ویژه",
    subtitle: "بسته‌بندی صورتی رویایی همراه با اشانتیون و یادداشت دست‌نویس اختصاصی",
    badge: "ارسال رایگان نلا",
    buttonText: "دیدن پک‌های کادویی",
    category: "لوازم فانتزی و کادویی",
    gradient: "from-pink-100 via-sky-50 to-pink-50",
    image: "https://images.pexels.com/photos/31449823/pexels-photo-31449823.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

interface HeroSliderProps {
  onSelectCategory?: (category: string) => void;
}

export function HeroSlider({ onSelectCategory }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Banner Slider (2 cols on large screen) */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-sm border border-pink-100 min-h-[320px] sm:min-h-[360px] flex items-center bg-gradient-to-r from-pink-50 via-white to-sky-50">
          <div className="relative z-10 p-6 sm:p-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {slide.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-snug mb-2">
              {slide.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              {slide.subtitle}
            </p>
            <button
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(slide.category)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-pink-200 transition-all hover:gap-3"
            >
              <span>{slide.buttonText}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Background Image / Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 hidden sm:block opacity-85">
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover mask-gradient-left"
                style={{
                  maskImage: "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                  WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                }}
              />
            </div>
          </div>

          {/* Slider Arrows */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md flex items-center justify-center backdrop-blur-sm transition-all"
            aria-label="قبلی"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md flex items-center justify-center backdrop-blur-sm transition-all"
            aria-label="بعدی"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? "w-6 bg-pink-500" : "w-2 bg-pink-200"
                }`}
                aria-label={`اسلاید ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Side Promo Cards (Digikala style) */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
          {/* Card 1: Sky Blue Theme */}
          <div
            onClick={() => onSelectCategory && onSelectCategory("مراقبت پوستی")}
            className="flex-1 bg-gradient-to-br from-sky-50 via-sky-100/60 to-white rounded-3xl p-5 border border-sky-200 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-sky-600 bg-sky-200/60 px-2 py-0.5 rounded-md">
                روتین شادابی پوست
              </span>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                سرم‌ها و ماسک‌های آبرسان
              </h3>
              <p className="text-xs text-slate-500">حاوی هیالورونیک اسید و ویتامین C</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-inner flex items-center justify-center text-sky-500 shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          {/* Card 2: Light Pink Theme */}
          <div
            onClick={() => onSelectCategory && onSelectCategory("زیورآلات و اکسسوری")}
            className="flex-1 bg-gradient-to-br from-pink-50 via-pink-100/60 to-white rounded-3xl p-5 border border-pink-200 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-pink-600 bg-pink-200/60 px-2 py-0.5 rounded-md">
                کادویی محبوب دخترانه
              </span>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-pink-700 transition-colors">
                اکسسوری و پاپیون صورتی
              </h3>
              <p className="text-xs text-slate-500">طرح‌های ترند اینستاگرام</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-inner flex items-center justify-center text-pink-500 shrink-0 group-hover:scale-105 transition-transform">
              <Gift className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
