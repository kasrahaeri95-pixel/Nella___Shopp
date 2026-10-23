import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ success: false, error: "شناسه سفارش نامعتبر است" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json({
      success: true,
      order: updated,
      message: "وضعیت سفارش با موفقیت بروزرسانی شد",
    });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ success: false, error: "خطا در بروزرسانی سفارش" }, { status: 500 });
  }
}
