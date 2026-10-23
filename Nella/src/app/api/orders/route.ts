import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingCode = searchParams.get("track");

    if (trackingCode) {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, trackingCode.trim().toUpperCase()));

      if (!order) {
        return NextResponse.json({ success: false, error: "سفارشی با این کد پیگیری پیدا نشد" }, { status: 404 });
      }

      return NextResponse.json({ success: true, order });
    }

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json({ success: true, orders: allOrders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ success: false, error: "خطا در دریافت سفارشات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, customerAddress, items, totalAmount, notes, paymentMethod } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: "تمامی فیلدهای مشخصات خریدار و سبد خرید الزامی است" },
        { status: 400 }
      );
    }

    // Generate unique order number like NEL-xxxxx
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NEL-${randomCode}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName,
        customerPhone,
        customerAddress,
        items: JSON.stringify(items),
        totalAmount: Number(totalAmount),
        status: "processing",
        paymentMethod: paymentMethod || "پرداخت اینترنتی موفق",
        notes: notes || "",
      })
      .returning();

    // Deduct stock and increment salesCount
    for (const item of items) {
      if (item.id) {
        const [prod] = await db.select().from(products).where(eq(products.id, item.id));
        if (prod) {
          const newStock = Math.max(0, prod.stock - (item.quantity || 1));
          const newSales = (prod.salesCount || 0) + (item.quantity || 1);
          await db
            .update(products)
            .set({ stock: newStock, salesCount: newSales })
            .where(eq(products.id, item.id));
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: `سفارش شما با شماره پیگیری ${orderNumber} با موفقیت ثبت شد`,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: "خطا در ثبت سفارش" }, { status: 500 });
  }
}
