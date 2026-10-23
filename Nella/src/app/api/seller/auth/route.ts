import { NextResponse } from "next/server";

/**
 * رمز عبور پنل فروشنده فقط روی سرور نگهداری می‌شود.
 * برای تغییر رمز، متغیر محیطی SELLER_PASSCODE را در فایل .env تنظیم کنید.
 * مقدار پیش‌فرض سمت سرور: 7788
 */
const SELLER_PASSCODE = process.env.SELLER_PASSCODE || "7788";

const SESSION_COOKIE = "nella_seller_session";
const SESSION_TOKEN = process.env.SELLER_SESSION_TOKEN || "ns_" + SELLER_PASSCODE.length + "_secure_session";

function isValidSession(value: string | undefined): boolean {
  return Boolean(value && value === SESSION_TOKEN);
}

// بررسی وضعیت ورود فعلی
export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));

  const token = match ? decodeURIComponent(match.split("=")[1]) : undefined;

  return NextResponse.json({
    success: true,
    authenticated: isValidSession(token),
  });
}

// ورود فروشنده با رمز عبور
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password.trim() : "";

    if (!password) {
      return NextResponse.json(
        { success: false, error: "وارد کردن رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    if (password !== SELLER_PASSCODE) {
      // هیچ اطلاعاتی درباره رمز واقعی در پاسخ برنمی‌گردد
      return NextResponse.json(
        { success: false, error: "رمز عبور نادرست است." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد",
      seller: {
        name: "مدیریت فروشگاه نلا شاپ",
        role: "owner",
        store: "NELLA_SHOPP",
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: SESSION_TOKEN,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // ۸ ساعت
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "خطایی در پردازش درخواست رخ داد" },
      { status: 500 }
    );
  }
}

// خروج از پنل فروشنده
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "از پنل خارج شدید" });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
