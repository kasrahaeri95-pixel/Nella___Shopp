import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, orders, supportMessages } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const [prodStats] = await db
      .select({
        totalProducts: sql<number>`count(*)`,
        totalStock: sql<number>`coalesce(sum(${products.stock}), 0)`,
        lowStock: sql<number>`coalesce(count(*) filter (where ${products.stock} < 5), 0)`,
      })
      .from(products);

    const [orderStats] = await db
      .select({
        totalOrders: sql<number>`count(*)`,
        totalRevenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
      })
      .from(orders);

    const [msgStats] = await db
      .select({
        pendingMessages: sql<number>`coalesce(count(*) filter (where ${supportMessages.status} = 'pending'), 0)`,
      })
      .from(supportMessages);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: Number(prodStats?.totalProducts || 0),
        totalStock: Number(prodStats?.totalStock || 0),
        lowStock: Number(prodStats?.lowStock || 0),
        totalOrders: Number(orderStats?.totalOrders || 0),
        totalRevenue: Number(orderStats?.totalRevenue || 0),
        pendingMessages: Number(msgStats?.pendingMessages || 0),
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ success: false, error: "خطا در دریافت آمار" }, { status: 500 });
  }
}
