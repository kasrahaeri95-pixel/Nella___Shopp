import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateDiscount } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, price, originalPrice, stock } = body;

    const prodId = Number(id);
    if (!prodId) {
      return NextResponse.json({ success: false, error: "شناسه محصول الزامی است" }, { status: 400 });
    }

    const [existing] = await db.select().from(products).where(eq(products.id, prodId));
    if (!existing) {
      return NextResponse.json({ success: false, error: "محصول یافت نشد" }, { status: 404 });
    }

    const newPrice = price !== undefined ? Number(price) : existing.price;
    const newOrigPrice = originalPrice !== undefined
      ? (originalPrice ? Number(originalPrice) : null)
      : existing.originalPrice;
    const newStock = stock !== undefined ? Number(stock) : existing.stock;
    const discount = calculateDiscount(newOrigPrice, newPrice);

    const [updated] = await db
      .update(products)
      .set({
        price: newPrice,
        originalPrice: newOrigPrice,
        discountPercent: discount,
        stock: newStock,
        updatedAt: new Date(),
      })
      .where(eq(products.id, prodId))
      .returning();

    return NextResponse.json({
      success: true,
      product: updated,
      message: `قیمت محصول «${updated.title}» با موفقیت بروزرسانی شد`,
    });
  } catch (error) {
    console.error("Quick price error:", error);
    return NextResponse.json({ success: false, error: "خطا در بروزرسانی قیمت" }, { status: 500 });
  }
}
