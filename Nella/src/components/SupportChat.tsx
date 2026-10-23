"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  CheckCircle2,
  Sparkles,
  Phone,
  HelpCircle,
} from "lucide-react";

const quickQuestions = [
  {
    q: "هزینه و زمان ارسال چقدر است؟",
    a: "تمامی سفارش‌های نلا شاپ در تهران با پیک اختصاصی همان روز و شهرستان‌ها ظرف ۲ الی ۳ روز کاری با پست پیشتاز ارسال می‌شوند. سفارش‌های بالای ۴۰۰ هزار تومان ارسال رایگان دارند! 🌸",
  },
  {
    q: "آیا محصولات نلا شاپ اصل و دارای ضمانت هستند؟",
    a: "بله، تمامی محصولات نلا شاپ ۱۰۰٪ اورجینال و با ضمانت اصالت و ۷ روز ضمانت بازگشت بی‌قید و شرط تقدیم شما می‌شوند.",
  },
  {
    q: "نحوه ورود به پنل فروشنده چگونه است؟",
    a: "ورود به پنل مدیریت فروشگاه با رمز عبور اختصاصی انجام می‌شود که تنها در اختیار مدیریت قرار دارد. برای دریافت دسترسی یا تغییر رمز، با پشتیبانی نلا شاپ تماس بگیرید.",
  },
];

export function SupportChat({
  isOpen,
  onClose,
  onToggle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}) {
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string; time: string }[]
  >([
    {
      sender: "bot",
      text: "سلام به پشتیبانی آنلاین نلا شاپ خوش آمدید! چطور می‌تونم کمکتون کنم؟ 🌸✨",
      time: "الان",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isLeavingTicket, setIsLeavingTicket] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    const newMsgs = [
      ...messages,
      { sender: "user" as const, text: userText, time: "هم‌اکنون" },
    ];
    setMessages(newMsgs);

    // Check if matches known quick response
    const matched = quickQuestions.find(
      (item) => userText.includes("ارسال") || userText.includes("هزینه")
        ? item.q.includes("ارسال")
        : userText.includes("اصل") || userText.includes("گارانتی")
        ? item.q.includes("اصل")
        : userText.includes("فروشنده") || userText.includes("رمز")
        ? item.q.includes("فروشنده")
        : false
    );

    setTimeout(() => {
      if (matched) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: matched.a, time: "هم‌اکنون" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "پیام شما دریافت شد. در صورت تمایل می‌توانید شماره تماس خود را ارسال کنید تا همکاران پشتیبانی نلا شاپ مستقیماً با شما تماس بگیرند.",
            time: "هم‌اکنون",
          },
        ]);
      }
    }, 600);
  };

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !inputText.trim()) {
      alert("لطفاً نام، شماره تماس و پیام خود را وارد کنید.");
      return;
    }

    try {
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          contact: contactPhone,
          message: inputText,
        }),
      });
      setTicketSent(true);
      setInputText("");
      setTimeout(() => {
        setTicketSent(false);
        setIsLeavingTicket(false);
      }, 3500);
    } catch {
      alert("خطا در ارسال پیام پشتیبانی");
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        className="fixed bottom-5 left-5 z-40 bg-gradient-to-r from-pink-500 via-pink-400 to-sky-400 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-2 border-white ring-4 ring-pink-200/50"
        aria-label="پشتیبانی آنلاین"
        title="گفتگوی آنلاین با پشتیبانی نلا شاپ"
      >
        <Headphones className="w-6 h-6 animate-pulse" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 w-[92vw] max-w-sm bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col h-[480px] animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 via-pink-500 to-sky-400 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black">پشتیبانی نلا شاپ</h3>
                <span className="text-[11px] text-pink-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  پاسخگوی آنلاین
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-pink-50/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] text-xs p-3 rounded-2xl leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-tl-none"
                      : "bg-white text-slate-800 border border-pink-100 rounded-tr-none"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {/* Quick Questions Chips */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 font-bold block mb-1.5">
                پرسش‌های پرتکرار:
              </span>
              <div className="flex flex-col gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setMessages((prev) => [
                        ...prev,
                        { sender: "user", text: q.q, time: "هم‌اکنون" },
                        { sender: "bot", text: q.a, time: "هم‌اکنون" },
                      ]);
                    }}
                    className="text-right text-[11px] bg-white hover:bg-pink-50 text-pink-700 p-2 rounded-xl border border-pink-100 transition-colors"
                  >
                    💬 {q.q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Input or Ticket Form */}
          <div className="p-3 border-t border-pink-100 bg-white">
            {isLeavingTicket ? (
              <form onSubmit={handleSendTicket} className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  ثبت پیام مستقیم برای کارشناس نلا:
                </span>
                <input
                  type="text"
                  required
                  placeholder="نام شما"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-xs bg-slate-50 p-2 rounded-xl border border-pink-200"
                />
                <input
                  type="text"
                  required
                  placeholder="شماره تماس (جهت پاسخ)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full text-xs bg-slate-50 p-2 rounded-xl border border-pink-200"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="متن پیام شما..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full text-xs bg-slate-50 p-2 rounded-xl border border-pink-200"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 text-white font-bold text-xs py-2 rounded-xl"
                  >
                    {ticketSent ? "پیام ارسال شد ✓" : "ارسال پیام"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLeavingTicket(false)}
                    className="text-xs text-slate-500 px-3"
                  >
                    لغو
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>تلفن تماس: ۰۲۱-۸۸۹۹۷۷۸۸</span>
                  <button
                    type="button"
                    onClick={() => setIsLeavingTicket(true)}
                    className="text-sky-600 hover:underline font-bold"
                  >
                    ثبت تیکت اختصاصی
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
