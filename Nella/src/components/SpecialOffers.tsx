"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Timer, ShoppingCart, ArrowLeft, Percent, Eye } from "lucide-react";
import type { Product } from "@/db/schema";
import { toPersianDigits, formatToman } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface SpecialOffersProps {
  products: Product[];
  onOpenProductDetail: (product: Product) => void;
}

export function SpecialOffers({ products, onOpenProductDetail }: SpecialOffersProps) {
  const { addToCart } = useCart();
  const specialProducts = products.filter((p) => p.isSpecialOffer);

  // Countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (specialProducts.length === 0) return null;

  return (
    <section id="special-offers" className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-gradient-to-r from-pink-400 via-pink-500 to-sky-400 rounded-3xl p-4 sm:p-6 shadow-lg shadow-pink-200/50">
        <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6">
          {/* Header Banner side */}
          <div className="flex flex-col justify-between items-center lg:items-start text-white text-center lg:text-right lg:w-56 shrink-0 py-2">
            <div className="flex flex-col items-center lg:items-start gap-2">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/30 shadow-md">
                <Percent className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                پیشنهاد<br />شگفت‌انگیز
              </h2>
              <span className="text-xs text-pink-100 font-medium">
                تخفیف‌های استثنایی نلا شاپ
              </span>
            </div>

            {/* Countdown Box */}
            <div className="mt-4 lg:mt-6 bg-white/15 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 flex items-center gap-2">
              <Timer className="w-4 h-4 text-white animate-pulse" />
              <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black text-white" dir="ltr">
                <span className="bg-white text-pink-600 px-1.5 py-0.5 rounded shadow-sm">
                  {toPersianDigits(String(timeLeft.hours).padStart(2, "0"))}
                </span>
                <span>:</span>
                <span className="bg-white text-pink-600 px-1.5 py-0.5 rounded shadow-sm">
                  {toPersianDigits(String(timeLeft.minutes).padStart(2, "0"))}
                </span>
                <span>:</span>
                <span className="bg-white text-pink-600 px-1.5 py-0.5 rounded shadow-sm">
                  {toPersianDigits(String(timeLeft.seconds).padStart(2, "0"))}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable product cards */}
          <div className="flex-1 flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none pt-1">
            {specialProducts.map((prod) => (
              <div
                key={prod.id}
                className="w-52 sm:w-56 shrink-0 bg-white rounded-2xl p-3 flex flex-col justify-between shadow-md hover:shadow-xl transition-all border border-pink-100 group relative"
              >
                {/* Product Image */}
                <div
                  className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-50 mb-3 cursor-pointer"
                  onClick={() => onOpenProductDetail(prod)}
                >
                  <Image
                    src={prod.imageUrl}
                    alt={prod.title}
                    fill
                    sizes="(max-width: 768px) 180px, 220px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.discountPercent && prod.discountPercent > 0 && (
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      {toPersianDigits(prod.discountPercent)}٪ تخفیف
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <h3
                    onClick={() => onOpenProductDetail(prod)}
                    className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-pink-600 cursor-pointer mb-2 leading-relaxed"
                  >
                    {prod.title}
                  </h3>

                  {/* Stock progress */}
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>فقط {toPersianDigits(prod.stock)} عدد در انبار</span>
                      <span className="text-pink-600 font-bold">شگفت‌انگیز</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-sky-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(15, prod.stock * 3))}%` }}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-end mb-3">
                    {prod.originalPrice && prod.originalPrice > prod.price && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {toPersianDigits(prod.originalPrice.toLocaleString("en-US"))}
                      </span>
                    )}
                    <span className="text-sm font-black text-pink-600">
                      {formatToman(prod.price)}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => addToCart(prod)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-pink-50 hover:bg-pink-500 text-pink-600 hover:text-white font-bold text-xs py-2 rounded-xl transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>افزودن</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenProductDetail(prod)}
                      className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                      title="مشاهده جزئیات"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
