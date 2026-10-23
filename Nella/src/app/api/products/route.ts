import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ensureSeedData } from "@/db/seed";
import { desc, asc, ilike, eq, and, or, SQL } from "drizzle-orm";
import { calculateDiscount } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    await ensureSeedData();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isSpecial = searchParams.get("special");
    const sort = searchParams.get("sort");

    const conditions: SQL[] = [];

    if (category && category !== "همه" && category !== "all") {
      conditions.push(eq(products.category, category));
    }

    if (isSpecial === "true") {
      conditions.push(eq(products.isSpecialOffer, true));
    }

    if (search && search.trim() !== "") {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(products.title, q),
          ilike(products.category, q),
          ilike(products.description, q)
        )!
      );
    }

    let orderByClause = desc(products.createdAt);
    if (sort === "price_asc") {
      orderByClause = asc(products.price);
    } else if (sort === "price_desc") {
      orderByClause = desc(products.price);
    } else if (sort === "sales") {
      orderByClause = desc(products.salesCount);
    } else if (sort === "discount") {
      orderByClause = desc(products.discountPercent);
    }

    const query = db.select().from(products);
    const result = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(orderByClause)
      : await query.orderBy(orderByClause);

    return NextResponse.json({
      success: true,
      products: result,
      total: result.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "خطا در دریافت لیست محصولات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      price,
      originalPrice,
      stock,
      imageUrl,
      description,
      specs,
      colors,
      isSpecialOffer,
      isFeatured,
      sellerName,
    } = body;

    if (!title || !category || price === undefined) {
      return NextResponse.json(
        { success: false, error: "عنوان، دسته‌بندی و قیمت الزامی است." },
        { status: 400 }
      );
    }

    const numPrice = Number(price);
    const numOrigPrice = originalPrice ? Number(originalPrice) : numPrice;
    const discount = calculateDiscount(numOrigPrice, numPrice);

    const [newProduct] = await db
      .insert(products)
      .values({
        title,
        category,
        price: numPrice,
        originalPrice: numOrigPrice > numPrice ? numOrigPrice : null,
        discountPercent: discount,
        stock: stock !== undefined ? Number(stock) : 10,
        imageUrl:
          imageUrl && imageUrl.trim() !== ""
            ? imageUrl
            : "https://images.pexels.com/photos/25533521/pexels-photo-25533521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        description: description || "",
        specs: typeof specs === "string" ? specs : JSON.stringify(specs || []),
        colors: typeof colors === "string" ? colors : JSON.stringify(colors || []),
        isSpecialOffer: Boolean(isSpecialOffer),
        isFeatured: Boolean(isFeatured),
        sellerName: sellerName || "نلا شاپ رسمی (NELLA_SHOPP)",
        rating: 5.0,
        reviewCount: 1,
        salesCount: 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "محصول جدید با موفقیت اضافه شد",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت محصول جدید" },
      { status: 500 }
    );
  }
}
