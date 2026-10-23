"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Star, Heart, Check, Sparkles, Truck } from "lucide-react";
import type { Product } from "@/db/schema";
import { toPersianDigits, formatToman } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export function ProductCard({ product, onOpenDetail }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const isInCart = items.some((item) => item.id === product.id);

  return (
    <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
      {/* Top badges */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-[10px] font-semibold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-100">
          {product.category}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{toPersianDigits(product.rating || 4.8)}</span>
        </div>
      </div>

      {/* Image container */}
      <div
        onClick={() => onOpenDetail(product)}
        className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-50 cursor-pointer mb-3"
      >
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs px-2 py-0.5 rounded-full shadow-md">
            {toPersianDigits(product.discountPercent)}٪
          </div>
        )}

        {product.isSpecialOffer && (
          <div className="absolute bottom-2 right-2 bg-pink-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            شگفت‌انگیز
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onOpenDetail(product)}
            className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-pink-600 cursor-pointer leading-snug mb-2"
          >
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
            <Truck className="w-3.5 h-3.5 text-sky-500" />
            <span>ارسال با پست پیشتاز</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-end justify-between mb-3">
            <div className="text-[11px] text-slate-400">
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-medium">موجود در انبار نلا</span>
              ) : (
                <span className="text-rose-500 font-bold">ناموجود</span>
              )}
            </div>
            <div className="flex flex-col items-end">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through">
                  {toPersianDigits(product.originalPrice.toLocaleString("en-US"))}
                </span>
              )}
              <span className="text-sm sm:text-base font-black text-pink-600">
                {formatToman(product.price)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                product.stock <= 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : isInCart
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md shadow-pink-200 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>در سبد خرید</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>افزودن به سبد</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenDetail(product)}
              className="p-2.5 rounded-xl border border-pink-200 hover:border-pink-400 text-pink-600 hover:bg-pink-50 transition-colors"
              title="مشاهده مشخصات کامل"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
