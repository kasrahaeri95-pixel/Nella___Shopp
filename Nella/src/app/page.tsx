"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryNav } from "@/components/CategoryNav";
import { SpecialOffers } from "@/components/SpecialOffers";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { CartDrawer } from "@/components/CartDrawer";
import { SupportChat } from "@/components/SupportChat";
import { OrderTrackerModal } from "@/components/OrderTrackerModal";
import { Footer } from "@/components/Footer";
import type { Product } from "@/db/schema";
import {
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  Search,
  Layers,
  Heart,
  RefreshCw,
  Gift,
  CheckCircle,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export default function StorefrontPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals & Drawers
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "همه") {
        params.append("category", selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      if (sortBy) {
        params.append("sort", sortBy);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const filteredProducts = products.filter((p) => {
    if (inStockOnly && p.stock <= 0) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f9]">
      {/* Digikala Style Header with Logo & NELLA_SHOPP Name */}
      <Header
        onSearch={(q) => setSearchQuery(q)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenOrderTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 space-y-6">
        {/* Only show slider and category bubbles if no active search query */}
        {!searchQuery && (
          <>
            {/* Hero Slider & Side Banners */}
            <HeroSlider
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Incredible Offers (پیشنهاد شگفت‌انگیز) */}
            <SpecialOffers
              products={products}
              onOpenProductDetail={(prod) => setSelectedProduct(prod)}
            />

            {/* Circular Category Navigation */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </>
        )}

        {/* Product Catalogue Section with Filters */}
        <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Active Search & Category Header */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-800">
                  {searchQuery
                    ? `نتایج جستجو برای: «${searchQuery}»`
                    : selectedCategory === "همه"
                    ? "تمامی محصولات نلا شاپ (NELLA_SHOPP)"
                    : `محصولات دسته‌بندی ${selectedCategory}`}
                </h1>
                <span className="text-xs text-slate-500">
                  نمایش {toPersianDigits(filteredProducts.length)} کالا با کیفیت تضمین شده
                </span>
              </div>
            </div>

            {/* Filter and Sort Toolbar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              {/* In stock toggle */}
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
                  inStockOnly
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : "bg-slate-50 text-slate-600 hover:bg-pink-50 border border-slate-200"
                }`}
              >
                <CheckCircle className={`w-3.5 h-3.5 ${inStockOnly ? "text-emerald-500" : "text-slate-400"}`} />
                <span>فقط کالاهای موجود</span>
              </button>

              {/* Sort Tabs */}
              <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[11px] px-2 hidden sm:inline">مرتب‌سازی:</span>
                <button
                  type="button"
                  onClick={() => setSortBy("newest")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    sortBy === "newest"
                      ? "bg-pink-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  جدیدترین
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("sales")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    sortBy === "sales"
                      ? "bg-pink-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  پرفروش‌ترین
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("price_asc")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    sortBy === "price_asc"
                      ? "bg-pink-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  ارزان‌ترین
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("price_desc")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    sortBy === "price_desc"
                      ? "bg-pink-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-pink-600"
                  }`}
                >
                  گران‌ترین
                </button>
              </div>

              {/* Reset filter button */}
              {(searchQuery || selectedCategory !== "همه" || inStockOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("همه");
                    setInStockOnly(false);
                  }}
                  className="text-pink-600 hover:underline px-2 font-bold"
                >
                  حذف فیلترها
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-4 border border-pink-100 shadow-sm animate-pulse space-y-3"
                >
                  <div className="w-full h-44 bg-pink-100/60 rounded-2xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-pink-50 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-pink-100 shadow-sm space-y-3">
              <div className="w-16 h-16 bg-pink-50 text-pink-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">کالایی یافت نشد!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                هیچ کالایی با فیلترهای انتخابی پیدا نشد. لطفاً عبارت جستجو را تغییر دهید یا فیلترها را حذف کنید.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("همه");
                  setInStockOnly(false);
                }}
                className="bg-pink-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors"
              >
                مشاهده همه محصولات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={(prod) => setSelectedProduct(prod)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* 24/7 Floating Support Chat */}
      <SupportChat
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onToggle={() => setIsSupportOpen(!isSupportOpen)}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Digikala Style Footer */}
      <Footer />
    </div>
  );
}
