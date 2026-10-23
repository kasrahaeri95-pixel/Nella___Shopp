"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Lock,
  Headphones,
  MapPin,
  Flame,
  Sparkles,
  Layers,
  Percent,
  Truck,
  Heart,
  X,
  PhoneCall,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toPersianDigits, formatToman } from "@/lib/utils";

interface HeaderProps {
  onSearch?: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenSupport?: () => void;
  onOpenOrderTracker?: () => void;
}

export function Header({
  onSearch,
  selectedCategory,
  onSelectCategory,
  onOpenSupport,
  onOpenOrderTracker,
}: HeaderProps) {
  const { itemCount, totalPrice, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const popularSearches = [
    "رژ لب مات مخملی",
    "سرم آبرسان پینک گلو",
    "بالم لب حرارتی",
    "دستبند نقره پاپیونی",
    "کلیپس مو ساتن",
    "پلنر فانتزی",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSelectPopular = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-sky-300 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "6s" }} />
        <span>به فروشگاه رسمی صورتی <b>NELLA_SHOPP</b> خوش آمدید! ارسال رایگان برای خریدهای بالای ۴۰۰ هزار تومان</span>
        <span className="hidden md:inline-block bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
          کد تخفیف: NELLA-PINK
        </span>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden shadow-md ring-2 ring-pink-300 ring-offset-2 transition-transform duration-300 group-hover:scale-105 bg-pink-100">
              <Image
                src="/logo.png"
                alt="NELLA_SHOPP Logo"
                fill
                sizes="52px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-wider text-pink-600 group-hover:text-pink-700 transition-colors">
                  NELLA_SHOPP
                </span>
                <span className="text-xs bg-sky-100 text-sky-700 font-bold px-1.5 py-0.5 rounded-md border border-sky-200">
                  نلا شاپ
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-sky-600 font-medium tracking-tight">
                فروشگاه تخصصی زیبایی و اکسسوری فانتزی
              </span>
            </div>
          </Link>

          {/* Search Box - Digikala Style */}
          <div className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="جستجو در بین محصولات جذاب نلا شاپ (رژ، بالم لب، اکسسوری، عطر...)"
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-xl pr-11 pl-10 py-2.5 border border-pink-200/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
              >
                <Search className="w-5 h-5" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    if (onSearch) onSearch("");
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Popular Searches Dropdown */}
            {isSearchFocused && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSearchFocused(false)}
                />
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-pink-100 p-4 z-20">
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-bold mb-2.5">
                    <Flame className="w-4 h-4 text-pink-500" />
                    <span>بیشترین جستجوهای اخیر در نلا شاپ</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPopular(item)}
                        className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full border border-pink-200 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Actions: Seller Login & Order Tracking & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Seller Portal Button - Clearly visible and highlighted */}
            <Link
              href="/seller"
              className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-pink-200 transition-all hover:scale-102 active:scale-98"
              title="ورود اختصاصی فروشندگان و مدیریت فروشگاه"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">ورود فروشندگان</span>
              <span className="sm:hidden">فروشندگان</span>
            </Link>

            {/* Order Tracking Button */}
            {onOpenOrderTracker && (
              <button
                type="button"
                onClick={onOpenOrderTracker}
                className="hidden lg:flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-2 rounded-xl text-xs font-bold border border-sky-200 transition-colors"
                title="پیگیری سفارش با کد رهگیری"
              >
                <Truck className="w-4 h-4 text-sky-500" />
                <span>پیگیری سفارش</span>
              </button>
            )}

            {/* Support Button */}
            {onOpenSupport && (
              <button
                type="button"
                onClick={onOpenSupport}
                className="hidden sm:flex items-center gap-1 bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-600 px-2.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:border-pink-200 transition-colors"
                title="پشتیبانی آنلاین نلا شاپ"
              >
                <Headphones className="w-4 h-4 text-pink-500" />
                <span>پشتیبانی</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-pink-50 hover:bg-pink-100/90 text-pink-700 px-3 py-2 rounded-xl border border-pink-200 transition-all active:scale-95"
              aria-label="سبد خرید"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {toPersianDigits(itemCount)}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[11px] text-slate-500 font-normal">سبد خرید</span>
                <span className="text-xs font-bold text-pink-700">
                  {totalPrice > 0 ? formatToman(totalPrice) : "خالی"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در محصولات نلا شاپ..."
              className="w-full bg-slate-50 text-slate-800 text-xs rounded-xl pr-9 pl-4 py-2 border border-pink-200 focus:border-pink-400 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-pink-500"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Digikala Style Bottom Navigation Bar */}
      <nav className="bg-gradient-to-b from-white to-pink-50/40 border-t border-pink-100/70 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-4">
          <div className="flex items-center gap-1 sm:gap-4 shrink-0 font-medium">
            <button
              onClick={() => onSelectCategory && onSelectCategory("همه")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                !selectedCategory || selectedCategory === "همه"
                  ? "bg-pink-100 text-pink-800 font-bold"
                  : "hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              <Layers className="w-4 h-4 text-pink-500" />
              <span>همه محصولات</span>
            </button>

            <button
              onClick={() => onSelectCategory && onSelectCategory("لوازم آرایشی")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === "لوازم آرایشی"
                  ? "bg-pink-100 text-pink-800 font-bold"
                  : "hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              لوازم آرایشی
            </button>

            <button
              onClick={() => onSelectCategory && onSelectCategory("مراقبت پوستی")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === "مراقبت پوستی"
                  ? "bg-pink-100 text-pink-800 font-bold"
                  : "hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              مراقبت پوستی
            </button>

            <button
              onClick={() => onSelectCategory && onSelectCategory("عطر و ادکلن")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === "عطر و ادکلن"
                  ? "bg-pink-100 text-pink-800 font-bold"
                  : "hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              عطر و ادکلن
            </button>

            <button
              onClick={() => onSelectCategory && onSelectCategory("زیورآلات و اکسسوری")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === "زیورآلات و اکسسوری"
                  ? "bg-pink-100 text-pink-800 font-bold"
                  : "hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              اکسسوری و زیورآلات
            </button>

            <button
              onClick={() => onSelectCategory && onSelectCategory("لوازم فانتزی و کادویی")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedCategory === "لوازم فانتزی و کادویی"
                  ? "bg-pink-100 text-pink-800 font-bold"
                  : "hover:text-pink-600 hover:bg-pink-50"
              }`}
            >
              فانتزی و کادویی
            </button>

            <div className="h-4 w-[1px] bg-pink-200 mx-1 hidden md:block" />

            <a
              href="#special-offers"
              className="flex items-center gap-1 text-pink-600 hover:text-pink-700 font-bold px-2 py-1"
            >
              <Percent className="w-3.5 h-3.5 text-pink-500" />
              <span>شگفت‌انگیزها</span>
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span>ارسال با پست پیشتاز و تیپاکس به سراسر ایران</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
