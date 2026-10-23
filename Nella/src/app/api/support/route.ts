import { NextResponse } from "next/server";
import { db } from "@/db";
import { supportMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt));
    return NextResponse.json({ success: true, messages: list });
  } catch (error) {
    console.error("Support GET error:", error);
    return NextResponse.json({ success: false, error: "خطا در دریافت پیام‌ها" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, subject, message } = body;

    if (!name || !contact || !message) {
      return NextResponse.json(
        { success: false, error: "نام، شماره تماس یا ایمیل، و پیام الزامی است" },
        { status: 400 }
      );
    }

    const [saved] = await db
      .insert(supportMessages)
      .values({
        name,
        contact,
        subject: subject || "پیام پشتیبانی آنلاین نلا شاپ",
        message,
        status: "pending",
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "پیام شما به پشتیبانی نلا شاپ ارسال شد. به زودی با شما تماس می‌گیریم.",
      data: saved,
    });
  } catch (error) {
    console.error("Support POST error:", error);
    return NextResponse.json({ success: false, error: "خطا در ارسال پیام" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, reply, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "شناسه پیام الزامی است" }, { status: 400 });
    }

    const [updated] = await db
      .update(supportMessages)
      .set({
        reply: reply || "",
        status: status || "answered",
      })
      .where(eq(supportMessages.id, Number(id)))
      .returning();

    return NextResponse.json({ success: true, data: updated, message: "پاسخ با موفقیت ثبت شد" });
  } catch (error) {
    console.error("Support PATCH error:", error);
    return NextResponse.json({ success: false, error: "خطا در ثبت پاسخ" }, { status: 500 });
  }
}
