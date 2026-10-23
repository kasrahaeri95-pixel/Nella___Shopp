"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ShoppingCart,
  Heart,
  Share2,
  Store,
  Layers,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import type { Product } from "@/db/schema";
import { toPersianDigits, formatToman } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"specs" | "desc" | "reviews">("specs");
  const [newReview, setNewReview] = useState("");
  const [reviewList, setReviewList] = useState([
    { name: "مهسا کریمی", rating: 5, date: "۲ روز پیش", text: "بسیار عالی و باکیفیت! بسته‌بندی صورتی نلا شاپ هم فوق‌العاده شیک بود." },
    { name: "آیدا رضوی", rating: 5, date: "هفته گذشته", text: "دقیقاً مطابق عکس و اصل بود، ارسال خیلی سریع بود ممنون از نلا شاپ." },
  ]);

  if (!product) return null;

  let parsedSpecs: { key: string; value: string }[] = [];
  try {
    if (product.specs) {
      parsedSpecs = typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs;
    }
  } catch {
    parsedSpecs = [];
  }

  let parsedColors: { name: string; code: string }[] = [];
  try {
    if (product.colors) {
      parsedColors = typeof product.colors === "string" ? JSON.parse(product.colors) : product.colors;
    }
  } catch {
    parsedColors = [];
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    setReviewList((prev) => [
      { name: "کاربر نلا شاپ", rating: 5, date: "لحظاتی پیش", text: newReview.trim() },
      ...prev,
    ]);
    setNewReview("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border border-pink-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pink-600 flex items-center justify-center transition-colors"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Breadcrumb */}
        <div className="px-6 py-4 border-b border-pink-50 flex items-center gap-2 text-xs text-slate-500">
          <span>نلا شاپ</span>
          <span>/</span>
          <span className="text-pink-600 font-semibold">{product.category}</span>
          <span>/</span>
          <span className="truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* Modal Main Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Image & Gallery (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-pink-50/50 border border-pink-100 shadow-inner">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                  {toPersianDigits(product.discountPercent)}٪ تخفیف
                </span>
              )}
            </div>

            {/* Badges under image */}
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <div className="flex items-center gap-2 bg-pink-50/80 p-2.5 rounded-xl text-[11px] text-pink-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-pink-500 shrink-0" />
                <span>ضمانت اصالت کالا</span>
              </div>
              <div className="flex items-center gap-2 bg-sky-50/80 p-2.5 rounded-xl text-[11px] text-sky-700 font-medium">
                <RotateCcw className="w-4 h-4 text-sky-500 shrink-0" />
                <span>۷ روز ضمانت بازگشت</span>
              </div>
            </div>
          </div>

          {/* Details & Buy Box (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{toPersianDigits(product.rating || 4.9)}</span>
                  <span className="text-slate-400 font-normal">
                    ({toPersianDigits(product.reviewCount || 15)} نظر ثبت‌شده)
                  </span>
                </div>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-slate-800 leading-relaxed mb-3">
                {product.title}
              </h1>

              {/* Seller Info Box */}
              <div className="bg-gradient-to-r from-pink-50/80 to-sky-50/80 p-3.5 rounded-2xl border border-pink-100/80 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{product.sellerName || "نلا شاپ رسمی (NELLA_SHOPP)"}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      رضایت خریداران: ۱۰۰٪ | عملکرد عالی
                    </span>
                  </div>
                </div>
                <div className="text-left text-[11px] text-sky-600 font-bold bg-white px-2 py-1 rounded-lg border border-sky-100">
                  ارسال سریع نلا
                </div>
              </div>

              {/* Color Selector */}
              {parsedColors.length > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    انتخاب رنگ: {selectedColor || parsedColors[0]?.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {parsedColors.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          (selectedColor || parsedColors[0].name) === color.name
                            ? "border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-200"
                            : "border-slate-200 hover:border-pink-300 text-slate-700"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                          style={{ backgroundColor: color.code }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Specs Preview */}
              {parsedSpecs.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-700 block mb-2">ویژگی‌های برجسته:</span>
                  <ul className="space-y-1.5">
                    {parsedSpecs.slice(0, 3).map((spec, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                        <span className="font-semibold text-slate-700">{spec.key}:</span>
                        <span>{spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Buy Container */}
            <div className="pt-4 border-t border-slate-100 mt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>موجود در انبار، آماده ارسال فوری</span>
                </div>
                <div className="flex flex-col items-end">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      {toPersianDigits(product.originalPrice.toLocaleString("en-US"))} تومان
                    </span>
                  )}
                  <span className="text-xl font-black text-pink-600">
                    {formatToman(product.price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(
                      product,
                      selectedColor || (parsedColors[0] ? parsedColors[0].name : undefined)
                    );
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-pink-200 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>افزودن به سبد خرید</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Area (Specs / Description / Reviews) */}
        <div className="border-t border-pink-100 bg-slate-50/50 p-6">
          <div className="flex items-center gap-2 border-b border-pink-200/60 pb-3 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`text-xs sm:text-sm font-bold pb-1 px-3 border-b-2 transition-all ${
                activeTab === "specs"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              مشخصات فنی و ویژگی‌ها
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("desc")}
              className={`text-xs sm:text-sm font-bold pb-1 px-3 border-b-2 transition-all ${
                activeTab === "desc"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              معرفی و نقد و بررسی
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`text-xs sm:text-sm font-bold pb-1 px-3 border-b-2 transition-all ${
                activeTab === "reviews"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              نظرات خریداران ({toPersianDigits(reviewList.length)})
            </button>
          </div>

          {/* Specs Tab */}
          {activeTab === "specs" && (
            <div className="bg-white rounded-2xl p-4 border border-pink-100">
              {parsedSpecs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {parsedSpecs.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs"
                    >
                      <span className="text-slate-500 font-medium">{s.key}</span>
                      <span className="text-slate-800 font-bold">{s.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">مشخصات تکمیلی به زودی توسط نلا شاپ افزوده می‌شود.</p>
              )}
            </div>
          )}

          {/* Description Tab */}
          {activeTab === "desc" && (
            <div className="bg-white rounded-2xl p-5 border border-pink-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="whitespace-pre-line">{product.description || "توضیحاتی برای این کالا ثبت نشده است."}</p>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {/* Add review form */}
              <form onSubmit={handleAddReview} className="bg-white p-4 rounded-2xl border border-pink-100">
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  ثبت نظر شما درباره این محصول:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="تجربه یا سوال خود درباره این کالا را بنویسید..."
                    className="flex-1 bg-slate-50 text-xs rounded-xl px-4 py-2.5 border border-pink-200 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                  >
                    ارسال نظر
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-2.5">
                {reviewList.map((rev, i) => (
                  <div key={i} className="bg-white p-3.5 rounded-2xl border border-pink-50 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-800">{rev.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, r) => (
                            <Star key={r} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
