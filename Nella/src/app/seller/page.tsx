"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  PlusCircle,
  Edit3,
  Trash2,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  RefreshCw,
  Eye,
  LogOut,
  Store,
  Layers,
  ArrowRight,
  Save,
  MessageSquare,
  Truck,
} from "lucide-react";
import type { Product, Order, SupportMessage } from "@/db/schema";
import { toPersianDigits, formatToman, calculateDiscount } from "@/lib/utils";

// تنظیمات امنیتی ورود پنل
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_SECONDS = 60;

const categoryOptions = [
  "لوازم آرایشی",
  "مراقبت پوستی",
  "عطر و ادکلن",
  "زیورآلات و اکسسوری",
  "لوازم فانتزی و کادویی",
];

const imagePresets = [
  { label: "رژ لب پاستلی", url: "https://images.pexels.com/photos/25533521/pexels-photo-25533521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { label: "سرم آبرسان صورت", url: "https://images.pexels.com/photos/24602077/pexels-photo-24602077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { label: "عطر مینیاتوری شیک", url: "https://images.pexels.com/photos/31449823/pexels-photo-31449823.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { label: "بالم لب حرارتی", url: "https://images.pexels.com/photos/3373741/pexels-photo-3373741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { label: "دستبند نقره و نگین", url: "https://images.pexels.com/photos/2866796/pexels-photo-2866796.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { label: "کلیپس و اکسسوری مو", url: "https://images.pexels.com/photos/7810600/pexels-photo-7810600.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { label: "کرم دست شکوفه", url: "https://images.pexels.com/photos/7664873/pexels-photo-7664873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
  { label: "پلنر فانتزی", url: "https://images.pexels.com/photos/25906586/pexels-photo-25906586.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
];

export default function SellerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<"pricing" | "add" | "orders" | "messages" | "guide">("pricing");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  // Edit prices inline state map: [productId]: { price, originalPrice, stock, isSaving, saved }
  const [priceEdits, setPriceEdits] = useState<{
    [id: number]: { price: number; originalPrice: number; stock: number; isSaving?: boolean; saved?: boolean };
  }>({});

  // Full product edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(categoryOptions[0]);
  const [newPrice, setNewPrice] = useState("");
  const [newOriginalPrice, setNewOriginalPrice] = useState("");
  const [newStock, setNewStock] = useState("15");
  const [newImageUrl, setNewImageUrl] = useState(imagePresets[0].url);
  const [newDescription, setNewDescription] = useState("");
  const [newIsSpecialOffer, setNewIsSpecialOffer] = useState(false);
  const [newColors, setNewColors] = useState("صورتی, آبی آسمانی, سفید");
  const [isAdding, setIsAdding] = useState(false);

  // Check existing session securely through the server
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const res = await fetch("/api/seller/auth");
        const data = await res.json();
        if (isMounted && data.success && data.authenticated) {
          setIsAuthenticated(true);
        }
      } catch {
        // ignore
      }
    };
    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLockedOut) return;
    setLockSecondsLeft(LOCK_SECONDS);
    const timer = setInterval(() => {
      setLockSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsLockedOut(false);
          setLoginAttempts(0);
          setAuthError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLockedOut]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [pRes, oRes, sRes, mRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/seller/stats"),
        fetch("/api/support"),
      ]);

      const pData = await pRes.json();
      const oData = await oRes.json();
      const sData = await sRes.json();
      const mData = await mRes.json();

      if (pData.success) {
        setProducts(pData.products || []);
        // Initialize price edits
        const edits: typeof priceEdits = {};
        (pData.products || []).forEach((p: Product) => {
          edits[p.id] = {
            price: p.price,
            originalPrice: p.originalPrice || p.price,
            stock: p.stock,
          };
        });
        setPriceEdits(edits);
      }

      if (oData.success) {
        setOrders(oData.orders || []);
      }

      if (sData.success) {
        setStats(sData.stats);
      }

      if (mData.success) {
        setMessages(mData.messages || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (isLockedOut) {
      setAuthError("به دلیل تلاش‌های ناموفق، ورود موقتاً غیرفعال است. لطفاً کمی بعد تلاش کنید.");
      return;
    }

    setIsCheckingLogin(true);
    try {
      const res = await fetch("/api/seller/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setIsLockedOut(false);
        setSuccessBanner("ورود با موفقیت انجام شد. به پنل مدیریت فروشگاه خوش آمدید!");
        setTimeout(() => setSuccessBanner(""), 4000);
      } else {
        const nextAttempts = loginAttempts + 1;
        setLoginAttempts(nextAttempts);
        if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
          setIsLockedOut(true);
          setAuthError(
            `تعداد تلاش‌های ناموفق بیش از حد مجاز بوده است. ورود به مدت ${LOCK_SECONDS} ثانیه غیرفعال شد.`
          );
        } else {
          setAuthError(
            `رمز عبور وارد شده صحیح نمی‌باشد. (${MAX_LOGIN_ATTEMPTS - nextAttempts} تلاش باقی مانده)`
          );
        }
        setPasswordInput("");
      }
    } catch {
      setAuthError("خطا در برقراری ارتباط با سرور. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsCheckingLogin(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setLoginAttempts(0);
    setPasswordInput("");
    try {
      await fetch("/api/seller/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
  };

  // Quick price save
  const handleSavePrice = async (prodId: number) => {
    const edit = priceEdits[prodId];
    if (!edit) return;

    setPriceEdits((prev) => ({
      ...prev,
      [prodId]: { ...prev[prodId], isSaving: true },
    }));

    try {
      const res = await fetch("/api/seller/quick-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: prodId,
          price: edit.price,
          originalPrice: edit.originalPrice,
          stock: edit.stock,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPriceEdits((prev) => ({
          ...prev,
          [prodId]: { ...prev[prodId], isSaving: false, saved: true },
        }));
        setTimeout(() => {
          setPriceEdits((prev) => ({
            ...prev,
            [prodId]: { ...prev[prodId], saved: false },
          }));
        }, 2500);

        // Update local product list
        setProducts((prev) =>
          prev.map((p) => (p.id === prodId ? data.product : p))
        );
      }
    } catch {
      alert("خطا در بروزرسانی قیمت محصول");
      setPriceEdits((prev) => ({
        ...prev,
        [prodId]: { ...prev[prodId], isSaving: false },
      }));
    }
  };

  // Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) {
      alert("لطفاً عنوان و قیمت محصول را وارد کنید.");
      return;
    }

    setIsAdding(true);

    const colorsArray = newColors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((name) => ({ name, code: "#f472b6" }));

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          price: Number(newPrice),
          originalPrice: newOriginalPrice ? Number(newOriginalPrice) : null,
          stock: Number(newStock) || 10,
          imageUrl: newImageUrl,
          description: newDescription,
          isSpecialOffer: newIsSpecialOffer,
          colors: JSON.stringify(colorsArray),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessBanner(`محصول «${newTitle}» با موفقیت به ویترین فروشگاه افزوده شد! ✨`);
        setTimeout(() => setSuccessBanner(""), 4000);
        // Reset form
        setNewTitle("");
        setNewPrice("");
        setNewOriginalPrice("");
        setNewDescription("");
        setNewIsSpecialOffer(false);
        setActiveTab("pricing");
        fetchDashboardData();
      } else {
        alert(data.error || "خطا در افزودن محصول");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setIsAdding(false);
    }
  };

  // Full Product Edit Submit
  const handleSaveFullEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        setSuccessBanner("اطلاعات محصول با موفقیت ذخیره شد");
        setTimeout(() => setSuccessBanner(""), 3000);
        fetchDashboardData();
      }
    } catch {
      alert("خطا در ذخیره محصول");
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number, title: string) => {
    if (!confirm(`آیا از حذف محصول «${title}» اطمینان دارید؟`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setSuccessBanner("محصول با موفقیت حذف شد");
        setTimeout(() => setSuccessBanner(""), 3000);
      }
    } catch {
      alert("خطا در حذف محصول");
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch {
      alert("خطا در بروزرسانی وضعیت سفارش");
    }
  };

  // Re-seed sample data
  const handleResetSampleData = async () => {
    if (!confirm("آیا مایلید تمام محصولات پیش‌فرض نلا شاپ مجدداً بارگذاری شوند؟")) return;
    try {
      const res = await fetch("/api/seller/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessBanner("محصولات نمونه با موفقیت بازیابی شدند");
        setTimeout(() => setSuccessBanner(""), 3000);
        fetchDashboardData();
      }
    } catch {
      alert("خطا در بازیابی داده‌ها");
    }
  };

  // If not authenticated, show passcode screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-sky-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-pink-200 p-6 sm:p-8 relative overflow-hidden">
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-pink-300 to-sky-300" />

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden shadow-lg ring-4 ring-pink-200 mb-3 bg-pink-50">
              <Image
                src="/logo.png"
                alt="NELLA_SHOPP Logo"
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h1 className="text-xl font-black text-pink-600">NELLA_SHOPP</h1>
              <span className="text-xs bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-md">
                پنل فروشنده
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ورود اختصاصی مدیریت و فروشندگان فروشگاه نلا شاپ
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                <span>رمز عبور ورود به پنل فروشنده:</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="رمز عبور را وارد کنید"
                  className="w-full bg-slate-50 text-slate-900 text-base font-mono font-bold text-center tracking-widest rounded-2xl py-3 px-4 border border-pink-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all"
                />
                <KeyRound className="w-5 h-5 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                رمز عبور تنها در اختیار مدیریت فروشگاه قرار دارد.
              </p>
            </div>

            {authError && (
              <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-xl border border-rose-200 text-center font-bold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isCheckingLogin || isLockedOut}
              className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-sky-500 hover:from-pink-600 hover:to-sky-600 disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isCheckingLogin
                  ? "در حال بررسی رمز عبور..."
                  : isLockedOut
                  ? `ورود موقتاً قفل است (${toPersianDigits(lockSecondsLeft)} ثانیه)`
                  : "ورود به پنل مدیریت فروشنده"}
              </span>
            </button>
          </form>

          {/* Quick info */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 flex flex-col gap-2">
            <span>این بخش ویژه مدیریت فروشگاه است و رمز عبور آن محرمانه می‌باشد.</span>
            <Link
              href="/"
              className="text-pink-600 font-bold hover:underline flex items-center justify-center gap-1 mt-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به صفحه اصلی فروشگاه</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Seller Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Seller Top Navigation */}
      <header className="sticky top-0 z-30 bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-300">
              <Image src="/logo.png" alt="Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-pink-600">NELLA_SHOPP</span>
                <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  پنل رسمی فروشنده
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                مدیریت محصولات، ویرایش قیمت‌ها و سفارشات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-xl transition-colors"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">مشاهده فروشگاه نلا</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl border border-slate-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج از پنل</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="border-t border-slate-100 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2">
            <button
              type="button"
              onClick={() => setActiveTab("pricing")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "pricing"
                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                  : "bg-white text-slate-600 hover:bg-pink-50 border border-slate-200"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>ویرایش قیمت و موجودی ({toPersianDigits(products.length)})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("add")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "add"
                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                  : "bg-white text-slate-600 hover:bg-pink-50 border border-slate-200"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>افزودن محصول جدید</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "orders"
                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                  : "bg-white text-slate-600 hover:bg-pink-50 border border-slate-200"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>سفارشات خریداران ({toPersianDigits(orders.length)})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "messages"
                  ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                  : "bg-white text-slate-600 hover:bg-pink-50 border border-slate-200"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>پیام‌های مشتریان ({toPersianDigits(messages.length)})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "guide"
                  ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                  : "bg-white text-slate-600 hover:bg-sky-50 border border-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>راهنمای فروشنده (تحویل کامل به شما)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Success Alert */}
        {successBanner && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessBanner("")}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">تنوع محصولات</span>
              <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {toPersianDigits(stats.totalProducts || products.length)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">مجموع سفارشات</span>
              <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {toPersianDigits(orders.length)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">فروش ثبت شده</span>
              <div className="text-base sm:text-lg font-black text-emerald-600 mt-1">
                {formatToman(
                  orders.reduce((sum, o) => sum + o.totalAmount, 0)
                )}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">موجودی کم انبار</span>
              <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
                {toPersianDigits(products.filter((p) => p.stock < 10).length)}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* TAB 1: EDIT PRICES & INVENTORY (ویرایش قیمت محصولات) */}
        {activeTab === "pricing" && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-pink-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-50">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-pink-500" />
                  <span>ویرایش سریع قیمت و موجودی انبار</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  می‌توانید قیمت فروش، قیمت خط‌خورده قبل از تخفیف، و موجودی هر کالا را مستقیماً تغییر داده و دکمه ذخیره را بزنید.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchDashboardData}
                  className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl border border-slate-200 transition-colors"
                  title="تازه‌سازی لیست"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={handleResetSampleData}
                  className="text-xs text-slate-500 hover:text-pink-600 border border-slate-200 hover:border-pink-200 px-3 py-2 rounded-xl transition-colors"
                >
                  بازیابی داده‌های اولیه
                </button>
              </div>
            </div>

            {/* Price Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-pink-50/50 text-slate-600 font-bold border-b border-pink-100">
                    <th className="p-3 rounded-tr-xl">تصویر و محصول</th>
                    <th className="p-3">دسته‌بندی</th>
                    <th className="p-3">قیمت فروش (تومان)</th>
                    <th className="p-3">قیمت اولیه (تومان)</th>
                    <th className="p-3">درصد تخفیف</th>
                    <th className="p-3">موجودی انبار</th>
                    <th className="p-3 text-center">ذخیره سریع</th>
                    <th className="p-3 rounded-tl-xl text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {products.map((p) => {
                    const edit = priceEdits[p.id] || {
                      price: p.price,
                      originalPrice: p.originalPrice || p.price,
                      stock: p.stock,
                    };
                    const currentDiscount = calculateDiscount(edit.originalPrice, edit.price);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Image & Title */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-pink-100 shrink-0">
                              <Image
                                src={p.imageUrl}
                                alt={p.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="max-w-[200px]">
                              <span className="font-bold text-slate-800 line-clamp-1">
                                {p.title}
                              </span>
                              {p.isSpecialOffer && (
                                <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded font-bold">
                                  شگفت‌انگیز
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {p.category}
                        </td>

                        {/* Price Input */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={edit.price}
                              onChange={(e) =>
                                setPriceEdits((prev) => ({
                                  ...prev,
                                  [p.id]: { ...edit, price: Number(e.target.value) },
                                }))
                              }
                              className="w-28 bg-slate-50 focus:bg-white text-xs font-mono font-bold text-slate-800 p-2 rounded-xl border border-pink-200 focus:border-pink-500 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-400">ت</span>
                          </div>
                        </td>

                        {/* Original Price Input */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={edit.originalPrice || ""}
                              placeholder="اختیاری"
                              onChange={(e) =>
                                setPriceEdits((prev) => ({
                                  ...prev,
                                  [p.id]: {
                                    ...edit,
                                    originalPrice: e.target.value ? Number(e.target.value) : 0,
                                  },
                                }))
                              }
                              className="w-28 bg-slate-50 focus:bg-white text-xs font-mono text-slate-600 p-2 rounded-xl border border-pink-100 focus:border-pink-500 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-400">ت</span>
                          </div>
                        </td>

                        {/* Calculated Discount */}
                        <td className="p-3">
                          {currentDiscount > 0 ? (
                            <span className="bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-full text-xs">
                              {toPersianDigits(currentDiscount)}٪
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* Stock Input */}
                        <td className="p-3">
                          <input
                            type="number"
                            value={edit.stock}
                            onChange={(e) =>
                              setPriceEdits((prev) => ({
                                ...prev,
                                [p.id]: { ...edit, stock: Number(e.target.value) },
                              }))
                            }
                            className={`w-16 text-center text-xs font-mono font-bold p-2 rounded-xl border focus:outline-none ${
                              edit.stock < 5
                                ? "bg-rose-50 border-rose-300 text-rose-700"
                                : "bg-slate-50 border-pink-200 text-slate-800 focus:border-pink-500"
                            }`}
                          />
                        </td>

                        {/* Save Button */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleSavePrice(p.id)}
                            disabled={edit.isSaving}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer ${
                              edit.saved
                                ? "bg-emerald-500 text-white shadow-sm"
                                : "bg-pink-50 hover:bg-pink-500 text-pink-600 hover:text-white border border-pink-200 hover:border-pink-500"
                            }`}
                          >
                            {edit.saved ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>ذخیره شد</span>
                              </>
                            ) : edit.isSaving ? (
                              <span>...</span>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                <span>ثبت</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="ویرایش مشخصات کامل"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="حذف کالا"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADD PRODUCT (افزودن محصول جدید) */}
        {activeTab === "add" && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="pb-4 border-b border-pink-50">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-pink-500" />
                <span>افزودن محصول جدید به ویترین نلا شاپ</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                اطلاعات محصول جدید را وارد کنید تا بلافاصله در فروشگاه نمایش داده شود.
              </p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  عنوان کامل محصول *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: رژ گونه استیکی مایع شاین نلا کالکشن"
                  className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    دسته‌بندی محصول *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500 cursor-pointer"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    موجودی انبار *
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    قیمت فروش (تومان) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="مثال: 195000"
                    className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    قیمت خط‌خورده قبل از تخفیف (تومان - اختیاری)
                  </label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="مثال: 250000"
                    className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  آدرس تصویر محصول (یا از تصاویر آماده زیر انتخاب کنید):
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500 font-mono mb-2 text-left"
                  dir="ltr"
                />
                <div className="flex flex-wrap gap-1.5">
                  {imagePresets.map((pr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewImageUrl(pr.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                        newImageUrl === pr.url
                          ? "bg-pink-500 text-white border-pink-500 font-bold"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-pink-300"
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  رنگ‌ها / تنوع‌ها (با کاما جدا کنید):
                </label>
                <input
                  type="text"
                  value={newColors}
                  onChange={(e) => setNewColors(e.target.value)}
                  placeholder="مثال: صورتی نود, سرخابی, مرجانی"
                  className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  توضیحات و ویژگی‌های محصول:
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="توضیحات کیفیت، خواص، رایحه، و مشخصات کاربردی..."
                  className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                <input
                  type="checkbox"
                  id="specialOfferCheck"
                  checked={newIsSpecialOffer}
                  onChange={(e) => setNewIsSpecialOffer(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded border-pink-300 focus:ring-pink-500 cursor-pointer"
                />
                <label
                  htmlFor="specialOfferCheck"
                  className="text-xs font-bold text-slate-700 cursor-pointer"
                >
                  این محصول در بخش «پیشنهاد شگفت‌انگیز» دیجی‌کالایی نلا شاپ قرار گیرد
                </label>
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{isAdding ? "در حال ثبت..." : "ثبت و انتشار محصول در فروشگاه"}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT (سفارشات خریداران) */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
            <div className="pb-4 border-b border-pink-50 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-500" />
                  <span>مدیریت سفارشات خریداران</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  وضعیت سفارشات را از زمان ثبت تا تحویل به مشتری پیگیری و تغییر دهید.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchDashboardData}
                className="p-2 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl border border-slate-200"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                هنوز سفارشی ثبت نشده است.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  let items: { title: string; quantity: number; price: number }[] = [];
                  try {
                    items = JSON.parse(order.items);
                  } catch {
                    items = [];
                  }

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-pink-100 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-pink-600 text-sm">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-slate-500" dir="ltr">
                            {order.customerPhone}
                          </span>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">وضعیت سفارش:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-white text-xs font-bold p-1.5 rounded-xl border border-pink-200 text-pink-700 focus:outline-none"
                          >
                            <option value="processing">ثبت اولیه (در حال بررسی)</option>
                            <option value="preparing">در حال بسته‌بندی</option>
                            <option value="shipped">تحویل داده شده به پست</option>
                            <option value="delivered">تحویل داده شده به خریدار</option>
                            <option value="cancelled">لغو شده</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {items.map((it, idx) => (
                          <span
                            key={idx}
                            className="bg-white px-2.5 py-1 rounded-lg border border-pink-100 text-slate-700"
                          >
                            {it.title} ({toPersianDigits(it.quantity)} عدد)
                          </span>
                        ))}
                      </div>

                      {/* Address & Total */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400">آدرس گیرنده: </span>
                          <span>{order.customerAddress}</span>
                          {order.notes && (
                            <span className="block text-pink-600 mt-0.5">
                              یادداشت: {order.notes}
                            </span>
                          )}
                        </div>
                        <div className="text-right sm:text-left mt-2 sm:mt-0 font-black text-pink-600 text-sm">
                          مبلغ: {formatToman(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SUPPORT MESSAGES (پیام‌های مشتریان) */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4">
            <div className="pb-4 border-b border-pink-50 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-pink-500" />
                  <span>پیام‌ها و تیکت‌های پشتیبانی خریداران</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  پیام‌هایی که خریداران در بخش پشتیبانی آنلاین سایت ارسال کرده‌اند.
                </p>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                هیچ پیام پشتیبانی دریافت نشده است.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl border border-pink-100 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{m.name}</span>
                        <span className="text-slate-500" dir="ltr">
                          {m.contact}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <p className="text-slate-700 bg-white p-3 rounded-xl border border-pink-50">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SELLER HAND-OFF GUIDE (راهنمای استفاده فروشنده - تحویل کامل) */}
        {activeTab === "guide" && (
          <div className="bg-gradient-to-br from-white via-pink-50/30 to-sky-50/30 rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  دفترچه راهنمای تحویل فروشگاه NELLA_SHOPP به فروشنده
                </h2>
                <p className="text-xs text-slate-600">
                  تمام اطلاعات لازم جهت مدیریت کامل محصولات و قیمت‌ها
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-pink-600">
                  <KeyRound className="w-4 h-4" />
                  <span>امنیت و رمز ورود پنل:</span>
                </h3>
                <p className="text-slate-600">
                  ورود به این بخش با رمز عبور اختصاصی مدیریت محافظت می‌شود. رمز عبور در هیچ‌کجای سایت نمایش داده نمی‌شود و تنها در اختیار خودتان است. در صورت نیاز به تغییر رمز، از بخش تنظیمات سرور (متغیر <b>SELLER_PASSCODE</b>) اقدام کنید. بعد از ۵ تلاش ناموفق، ورود به مدت ۶۰ ثانیه به‌صورت خودکار مسدود می‌شود.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sky-600">
                  <DollarSign className="w-4 h-4" />
                  <span>نحوه تغییر سریع قیمت کالاها:</span>
                </h3>
                <p className="text-slate-600">
                  در تب «ویرایش قیمت و موجودی»، مستقیماً داخل کادر قیمت هر محصول قیمت جدید را تایپ کرده و دکمه «ثبت» را بزنید. درصد تخفیف به صورت خودکار محاسبه شده و روی سایت اعمال خواهد شد.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-pink-600">
                  <PlusCircle className="w-4 h-4" />
                  <span>افزودن محصولات جدید:</span>
                </h3>
                <p className="text-slate-600">
                  از تب «افزودن محصول جدید» می‌توانید عنوان، دسته‌بندی، قیمت، تصویر دلخواه یا تصاویر پیشنهادی را انتخاب کنید و دکمه ثبت را بزنید تا بلافاصله به ویترین اضافه شود.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sky-600">
                  <Truck className="w-4 h-4" />
                  <span>پیگیری سفارشات خریداران:</span>
                </h3>
                <p className="text-slate-600">
                  سفارشات مشتریان در تب «سفارشات خریداران» نمایش داده می‌شود و کد پیگیری نلا مانند NEL-XXXXX به هر مشتری داده می‌شود که می‌تواند در صفحه اصلی سایت آن را رهگیری کند.
                </p>
              </div>
            </div>

            <div className="bg-pink-100/60 p-4 rounded-2xl text-xs text-pink-800 flex items-center justify-between">
              <span>🌸 فروشگاه شما آماده استفاده و شروع فروش می‌باشد!</span>
              <Link
                href="/"
                className="bg-pink-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-pink-700 transition-colors"
              >
                مشاهده ویترین آنلاین
              </Link>
            </div>
          </div>
        )}

        {/* Full Product Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-pink-100 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-pink-50">
                <h3 className="text-sm font-black text-slate-800">
                  ویرایش مشخصات کامل محصول
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pink-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveFullEdit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">عنوان کالا:</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, title: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-pink-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">دسته‌بندی:</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-pink-200"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">موجودی انبار:</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-pink-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">قیمت فروش (تومان):</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-pink-200 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">قیمت قبل تخفیف:</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="w-full bg-slate-50 p-2.5 rounded-xl border border-pink-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">آدرس عکس کالا:</label>
                  <input
                    type="url"
                    value={editingProduct.imageUrl}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-pink-200 font-mono"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">توضیحات کالا:</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-pink-200"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="editSpecialCheck"
                    checked={Boolean(editingProduct.isSpecialOffer)}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isSpecialOffer: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-pink-600 rounded"
                  />
                  <label htmlFor="editSpecialCheck" className="font-bold text-slate-700">
                    نمایش در پیشنهاد شگفت‌انگیز نلا شاپ
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    ذخیره تغییرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
