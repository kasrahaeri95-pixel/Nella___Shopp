"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Sparkles,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toPersianDigits, formatToman } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalOriginalPrice,
    totalDiscount,
    itemCount,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    total: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const freeShippingThreshold = 400000;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);
  const freeShippingPercent = Math.min(100, Math.round((totalPrice / freeShippingThreshold) * 100));

  const applyPromo = () => {
    if (discountCode.trim().toUpperCase() === "NELLA-PINK" || discountCode.trim().toUpperCase() === "NELLA") {
      setDiscountApplied(true);
    } else {
      alert("کد تخفیف وارد شده معتبر نیست. از کد NELLA-PINK استفاده کنید.");
    }
  };

  const finalTotal = discountApplied ? Math.round(totalPrice * 0.9) : totalPrice;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMessage("لطفاً تمامی فیلدهای الزامی (نام، تلفن، آدرس) را تکمیل کنید.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          notes: notes.trim(),
          items: items,
          totalAmount: finalTotal,
          paymentMethod: "پرداخت موفق تستی شاپرک",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess({
          orderNumber: data.order.orderNumber,
          total: data.order.totalAmount,
        });
        clearCart();
      } else {
        setErrorMessage(data.error || "خطایی در ثبت سفارش رخ داد");
      }
    } catch {
      setErrorMessage("خطا در برقراری ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-r border-pink-100 animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-sky-50/30">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800">سبد خرید شما</h2>
              <span className="text-xs text-slate-500">
                {toPersianDigits(itemCount)} کالا در سبد
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCartOpen(false);
              setIsCheckingOut(false);
              setOrderSuccess(null);
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pink-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && !orderSuccess && (
          <div className="bg-gradient-to-r from-pink-50 to-sky-50 px-4 py-3 border-b border-pink-100 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 text-pink-600">
                <Truck className="w-4 h-4" />
                {neededForFreeShipping === 0
                  ? "تبریک! ارسال برای این سفارش رایگان شد 🎁"
                  : `تنها ${formatToman(neededForFreeShipping)} تا ارسال رایگان!`}
              </span>
              <span className="text-slate-500">{toPersianDigits(freeShippingPercent)}٪</span>
            </div>
            <div className="w-full bg-pink-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-sky-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orderSuccess ? (
            /* Order Success View */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-black text-slate-800">
                سفارش شما با موفقیت ثبت شد! 🎉
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                همکاران ما در نلا شاپ سفارش شما را آماده و از طریق پست پیشتاز ارسال خواهند کرد.
              </p>

              <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100 max-w-xs mx-auto text-right">
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">شماره پیگیری سفارش:</span>
                  <span className="font-mono font-black text-pink-600 text-sm">
                    {orderSuccess.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">مبلغ پرداخت شده:</span>
                  <span className="font-bold text-slate-800">
                    {formatToman(orderSuccess.total)}
                  </span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">وضعیت فعلی:</span>
                  <span className="font-bold text-sky-600">در حال بررسی و آماده‌سازی</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(null);
                  setIsCheckingOut(false);
                  setIsCartOpen(false);
                }}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-102"
              >
                ادامه خرید از نلا شاپ
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  تکمیل اطلاعات ارسال سفارش
                </span>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs text-pink-600 hover:underline flex items-center gap-1"
                >
                  <span>بازگشت به سبد</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 text-rose-600 text-xs p-2.5 rounded-xl border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  نام و نام خانوادگی تحویل‌گیرنده *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: پریا احمدی"
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-pink-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  شماره موبایل (جهت هماهنگی و پیامک کد رهگیری) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="مثال: 09121234567"
                  dir="ltr"
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2.5 border border-pink-200 focus:outline-none focus:border-pink-500 text-right"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  آدرس دقیق پستی و کد پستی *
                </label>
                <textarea
                  required
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="استان، شهر، خیابان، پلاک، واحد..."
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2 border border-pink-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  توضیحات و یادداشت (اختیاری):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: بسته‌بندی کادویی با روبان صورتی نلا"
                  className="w-full bg-slate-50 text-xs rounded-xl px-3.5 py-2 border border-pink-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Promo Code */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  کد تخفیف (کد پیشنهادی: NELLA-PINK)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="NELLA-PINK"
                    dir="ltr"
                    className="flex-1 bg-slate-50 text-xs rounded-xl px-3 py-2 border border-pink-200 focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-3 py-2 rounded-xl"
                  >
                    اعمال کد
                  </button>
                </div>
                {discountApplied && (
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                    ✓ ۱۰٪ تخفیف ویژه صورتی با موفقیت اعمال شد!
                  </span>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>مجموع سبد:</span>
                  <span>{formatToman(totalPrice)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>تخفیف کوپن نلا:</span>
                    <span>-{formatToman(Math.round(totalPrice * 0.1))}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-pink-600 pt-1 border-t border-slate-200">
                  <span>مبلغ قابل پرداخت:</span>
                  <span>{formatToman(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isSubmitting ? "در حال پردازش..." : "پرداخت و ثبت نهایی سفارش"}</span>
              </button>
            </form>
          ) : items.length === 0 ? (
            /* Empty Cart */
            <div className="py-16 text-center space-y-3">
              <div className="w-20 h-20 bg-pink-50 text-pink-300 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">سبد خرید شما در نلا شاپ خالی است!</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                می‌توانید برای مشاهده محصولات جذاب و شگفت‌انگیز نلا شاپ به صفحه فروشگاه بازگردید.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors"
              >
                مشاهده محصولات
              </button>
            </div>
          ) : (
            /* Cart Items List */
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedColor || "default"}`}
                className="bg-slate-50 hover:bg-pink-50/30 p-3 rounded-2xl border border-pink-100/60 flex items-center gap-3 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-pink-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate mb-1">
                    {item.title}
                  </h4>
                  {item.selectedColor && (
                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-pink-200 text-pink-700 font-medium">
                      رنگ: {item.selectedColor}
                    </span>
                  )}
                  <div className="text-xs font-black text-pink-600 mt-1">
                    {formatToman(item.price)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 bg-white border border-pink-200 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1, item.selectedColor)
                      }
                      className="w-5 h-5 rounded hover:bg-pink-100 text-pink-600 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">
                      {toPersianDigits(item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1, item.selectedColor)
                      }
                      className="w-5 h-5 rounded hover:bg-pink-100 text-pink-600 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id, item.selectedColor)}
                    className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="حذف کالا"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions when in normal cart view */}
        {items.length > 0 && !isCheckingOut && !orderSuccess && (
          <div className="p-4 border-t border-pink-100 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              {totalDiscount > 0 && (
                <div className="flex items-center justify-between text-pink-600">
                  <span>سود شما از خرید:</span>
                  <span className="font-bold">{formatToman(totalDiscount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-black text-base text-slate-800">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-pink-600 font-black">{formatToman(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2"
            >
              <span>ادامه ثبت سفارش و تسویه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
