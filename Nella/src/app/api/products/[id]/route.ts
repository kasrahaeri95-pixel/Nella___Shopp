import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { calculateDiscount } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json({ success: false, error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const [item] = await db.select().from(products).where(eq(products.id, prodId));
    if (!item) {
      return NextResponse.json({ success: false, error: "محصول پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: item });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: "خطا در دریافت محصول" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json({ success: false, error: "شناسه نامعتبر است" }, { status: 400 });
    }

    const body = await req.json();

    // Check if item exists
    const [existing] = await db.select().from(products).where(eq(products.id, prodId));
    if (!existing) {
      return NextResponse.json({ success: false, error: "محصول پیدا نشد" }, { status: 404 });
    }

    // Build update object
    const updateData: Partial<typeof products.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.specs !== undefined) {
      updateData.specs = typeof body.specs === "string" ? body.specs : JSON.stringify(body.specs);
    }
    if (body.colors !== undefined) {
      updateData.colors = typeof body.colors === "string" ? body.colors : JSON.stringify(body.colors);
    }
    if (body.isSpecialOffer !== undefined) updateData.isSpecialOffer = Boolean(body.isSpecialOffer);
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    // Handle price and discount recalculation
    const newPrice = body.price !== undefined ? Number(body.price) : existing.price;
    const newOrigPrice = body.originalPrice !== undefined
      ? (body.originalPrice ? Number(body.originalPrice) : null)
      : existing.originalPrice;

    updateData.price = newPrice;
    updateData.originalPrice = newOrigPrice;
    updateData.discountPercent = calculateDiscount(newOrigPrice, newPrice);

    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, prodId))
      .returning();

    return NextResponse.json({
      success: true,
      product: updated,
      message: "اطلاعات و قیمت محصول با موفقیت ویرایش شد",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, error: "خطا در ویرایش محصول" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json({ success: false, error: "شناسه نامعتبر است" }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, prodId));
    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, error: "خطا در حذف محصول" }, { status: 500 });
  }
}
