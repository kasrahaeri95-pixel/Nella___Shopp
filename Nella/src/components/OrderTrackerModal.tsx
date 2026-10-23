"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
} from "lucide-react";
import type { Order } from "@/db/schema";
import { toPersianDigits, formatToman } from "@/lib/utils";

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackerModal({ isOpen, onClose }: OrderTrackerModalProps) {
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setIsLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?track=${encodeURIComponent(trackingCode.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || "سفارشی با این کد رهگیری پیدا نشد. نمونه: NEL-98214");
      }
    } catch {
      setError("خطا در برقراری ارتباط با سامانه رهگیری نلا شاپ");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    if (status === "processing") return 1;
    if (status === "preparing") return 2;
    if (status === "shipped") return 3;
    if (status === "delivered") return 4;
    return 1;
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  let parsedItems: { title: string; price: number; quantity: number }[] = [];
  try {
    if (order?.items) {
      parsedItems = JSON.parse(order.items);
    }
  } catch {
    parsedItems = [];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-pink-100 overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-sky-400 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Truck className="w-6 h-6" />
            <div>
              <h3 className="text-base font-black">پیگیری سفارش نلا شاپ</h3>
              <p className="text-xs text-pink-100">رهگیری مرسوله پستی و وضعیت ارسال</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleTrack} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              شماره پیگیری سفارش را وارد کنید:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="مثال: NEL-98214"
                dir="ltr"
                className="flex-1 uppercase bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500 text-center font-mono font-bold"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>{isLoading ? "جستجو..." : "رهگیری"}</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>کد نمونه برای تست: <b>NEL-98214</b></span>
              <button
                type="button"
                onClick={() => setTrackingCode("NEL-98214")}
                className="text-pink-600 hover:underline"
              >
                درج کد تست
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Details View */}
          {order && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {/* Stepper */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-pink-100">
                <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold text-slate-600 mb-2">
                  <span className={currentStep >= 1 ? "text-pink-600" : "text-slate-400"}>
                    ثبت اولیه
                  </span>
                  <span className={currentStep >= 2 ? "text-pink-600" : "text-slate-400"}>
                    آماده‌سازی
                  </span>
                  <span className={currentStep >= 3 ? "text-sky-600" : "text-slate-400"}>
                    تحویل به پست
                  </span>
                  <span className={currentStep >= 4 ? "text-emerald-600" : "text-slate-400"}>
                    تحویل مشتری
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-sky-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* Order Info Summary */}
              <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">شماره سفارش:</span>
                  <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">تحویل گیرنده:</span>
                  <span className="font-bold text-slate-800">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">مبلغ کل سفارش:</span>
                  <span className="font-black text-pink-600">{formatToman(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">آدرس پستی:</span>
                  <span className="text-slate-700 max-w-[220px] text-left truncate">{order.customerAddress}</span>
                </div>
              </div>

              {/* Items List */}
              {parsedItems.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    اقلام این سفارش:
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {parsedItems.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl"
                      >
                        <span className="text-slate-800">{it.title}</span>
                        <span className="text-pink-600 font-bold">
                          {toPersianDigits(it.quantity)} عدد
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
