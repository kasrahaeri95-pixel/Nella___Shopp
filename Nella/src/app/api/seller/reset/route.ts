import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { initialProducts } from "@/db/seed";

const SESSION_COOKIE = "nella_seller_session";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const hasValidSession = cookieHeader.includes(SESSION_COOKIE);

    if (!hasValidSession) {
      return NextResponse.json(
        { success: false, error: "برای این عملیات باید وارد پنل فروشنده شوید." },
        { status: 403 }
      );
    }

    await db.delete(products);
    await db.insert(products).values(initialProducts);

    return NextResponse.json({
      success: true,
      message: "محصولات پیش‌فرض با موفقیت بارگذاری مجدد شدند",
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ success: false, error: "خطا در بارگذاری مجدد داده‌ها" }, { status: 500 });
  }
}
