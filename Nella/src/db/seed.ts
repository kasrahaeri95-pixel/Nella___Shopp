import { db } from "@/db";
import { products, sellerSettings, orders } from "@/db/schema";
import { sql } from "drizzle-orm";

export const initialProducts = [
  {
    title: "رژ لب جامد مات مخملی نلا کالکشن صورتی کالباسی کد ۲۰۲",
    slug: "nella-matte-lipstick-202",
    category: "لوازم آرایشی",
    price: 185000,
    originalPrice: 245000,
    discountPercent: 24,
    stock: 25,
    imageUrl: "https://images.pexels.com/photos/25533521/pexels-photo-25533521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "رژ لب جامد و مات نلا با بافت فوق‌العاده نرم و مخملی، بدون خشک کردن لب‌ها. ماندگاری ۱۲ ساعته با پیگمنت رنگی بسیار بالا و رایحه ملایم وانیلی.",
    specs: JSON.stringify([
      { key: "نوع بافت", value: "مات و مخملی" },
      { key: "ماندگاری", value: "۱۲ ساعته" },
      { key: "کشور سازنده", value: "کره جنوبی / فرمولاسیون ویژه نلا" },
      { key: "ویژگی خاص", value: "حاوی ویتامین E و روغن جوجوبا" }
    ]),
    colors: JSON.stringify([
      { name: "صورتی نود", code: "#f472b6" },
      { name: "کالباسی روشن", code: "#f9a8d4" },
      { name: "شکلاتی ملایم", code: "#fda4af" }
    ]),
    rating: 4.9,
    reviewCount: 38,
    salesCount: 142,
    isSpecialOffer: true,
    isFeatured: true,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  },
  {
    title: "سرم آبرسان و روشن‌کننده هیالورونیک اسید پینک گلو نلا شاپ",
    slug: "nella-pink-glow-hyaluronic-serum",
    category: "مراقبت پوستی",
    price: 340000,
    originalPrice: 480000,
    discountPercent: 29,
    stock: 18,
    imageUrl: "https://images.pexels.com/photos/24602077/pexels-photo-24602077.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "سرم مغذی و جوانساز پوست نلا با قطرات درخشان صورتی. سرشار از اسید هیالورونیک پنج‌لایه، نیاسینامید و عصاره گل رز صدتومانی جهت شادابی و شفافیت سریع پوست.",
    specs: JSON.stringify([
      { key: "حجم", value: "۵۰ میلی‌لیتر" },
      { key: "نوع پوست", value: "انواع پوست بخصوص خشک و دهیدراته" },
      { key: "ترکیبات اصلی", value: "هیالورونیک اسید، نیاسینامید، عصاره رز" },
      { key: "تاثیر فوری", value: "درخشندگی شیشه‌ای و آبرسانی عمیق" }
    ]),
    colors: JSON.stringify([]),
    rating: 4.8,
    reviewCount: 52,
    salesCount: 96,
    isSpecialOffer: true,
    isFeatured: true,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  },
  {
    title: "ادو پرفیوم زنانه مینیاتوری فلاور کیس نلا شاپ ۲۵ میل",
    slug: "nella-flower-kiss-perfume",
    category: "عطر و ادکلن",
    price: 295000,
    originalPrice: 390000,
    discountPercent: 24,
    stock: 14,
    imageUrl: "https://images.pexels.com/photos/31449823/pexels-photo-31449823.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "عطر جیبی شیک با رایحه‌ای بسیار شیرین و خنک از شکوفه‌های بهاری، توت‌فرنگی وحشی و مشک سفید. بطری کریستالی زیبا با درپوش پاپیونی طلایی.",
    specs: JSON.stringify([
      { key: "طبع", value: "خنک و شیرین ملایم" },
      { key: "گروه بویایی", value: "گلی میوه‌ای" },
      { key: "پخش بو", value: "عالی تا ۶ ساعت" },
      { key: "حجم", value: "۲۵ میلی‌لیتر مسافرتی" }
    ]),
    colors: JSON.stringify([]),
    rating: 4.7,
    reviewCount: 29,
    salesCount: 88,
    isSpecialOffer: true,
    isFeatured: true,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  },
  {
    title: "بالم لب حرارتی شاین‌دار کریستالی طرح پاپیون نلا",
    slug: "nella-crystal-magic-lip-balm",
    category: "لوازم آرایشی",
    price: 95000,
    originalPrice: 135000,
    discountPercent: 30,
    stock: 45,
    imageUrl: "https://images.pexels.com/photos/3373741/pexels-photo-3373741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "بالم لب جادویی که با تغییر دمای بدن، رنگ صورتی طبیعی و جذابی به لب‌ها می‌دهد. حاوی ذرات براق نانو و ویتامین A و E جهت درمان خشکی و ترک لب.",
    specs: JSON.stringify([
      { key: "تغییر رنگ", value: "هوشمند بر اساس دمای لب" },
      { key: "براق‌کنندگی", value: "شاین ملایم و درخشان" },
      { key: "خواص", value: "ترمیم‌کننده و نرم‌کننده" }
    ]),
    colors: JSON.stringify([
      { name: "صورتی ملایم", code: "#f472b6" },
      { name: "رزگلد شاین", code: "#fb7185" }
    ]),
    rating: 4.9,
    reviewCount: 64,
    salesCount: 310,
    isSpecialOffer: true,
    isFeatured: false,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  },
  {
    title: "دستبند نقره ۹۲۵ عیار نگین‌دار طرح پاپیون صورتی نلا",
    slug: "nella-silver-bow-bracelet",
    category: "زیورآلات و اکسسوری",
    price: 490000,
    originalPrice: 620000,
    discountPercent: 21,
    stock: 9,
    imageUrl: "https://images.pexels.com/photos/2866796/pexels-photo-2866796.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "دستبند ظریف نقره استرلینگ با نگین‌های زیرکنیا درخشان صورتی و سفید. ضد حساسیت، رنگ ثابت با آبکاری رادیوم و دارای قفل قابل تنظیم زنجیری.",
    specs: JSON.stringify([
      { key: "عیار", value: "نقره ۹۲۵ استرلینگ اصل" },
      { key: "طول زنجیر", value: "۱۶ + ۴ سانتی‌متر زنجیر اضافه" },
      { key: "نوع نگین", value: "زیرکونیا سواروسکی AAAA" },
      { key: "بسته‌بندی", value: "جعبه کادویی هاردباکس نلا شاپ" }
    ]),
    colors: JSON.stringify([
      { name: "نقره‌ای با نگین صورتی", code: "#e2e8f0" },
      { name: "رزگلد لوکس", code: "#fecdd3" }
    ]),
    rating: 5.0,
    reviewCount: 19,
    salesCount: 45,
    isSpecialOffer: false,
    isFeatured: true,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  },
  {
    title: "کلیپس مو فانتزی ساتن کره‌ای طرح پاپیون مینیاتوری",
    slug: "nella-korean-bow-hair-claw",
    category: "زیورآلات و اکسسوری",
    price: 68000,
    originalPrice: 90000,
    discountPercent: 24,
    stock: 50,
    imageUrl: "https://images.pexels.com/photos/7810600/pexels-photo-7810600.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "کلیپس موی بسیار ترند و خاص مدل نلا با پارچه ساتن لطیف، دندانه‌های محکم بدون آسیب به موها و نگهداری فوق‌العاده قوی موهای بلند و متوسط.",
    specs: JSON.stringify([
      { key: "جنس گیره", value: "اکریلیک نشکن درجه یک + ساتن ابریشمی" },
      { key: "سایز", value: "بزرگ (۱۰ سانتی‌متر)" },
      { key: "مناسب برای", value: "استایل روزمره، مهمانی، هدیه دخترانه" }
    ]),
    colors: JSON.stringify([
      { name: "صورتی پاستلی", code: "#fbcfe8" },
      { name: "آبی آسمانی", code: "#bae6fd" },
      { name: "سفید صدفی", code: "#f8fafc" }
    ]),
    rating: 4.8,
    reviewCount: 43,
    salesCount: 220,
    isSpecialOffer: false,
    isFeatured: true,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  },
  {
    title: "کرم دست و ناخن مرطوب‌کننده رایحه شکوفه گیلاس ساستینا",
    slug: "cherry-blossom-hand-cream",
    category: "مراقبت پوستی",
    price: 88000,
    originalPrice: 110000,
    discountPercent: 20,
    stock: 35,
    imageUrl: "https://images.pexels.com/photos/7664873/pexels-photo-7664873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "کرم لطیف دست با جذب بسیار سریع بدون چربی و سنگینی، حاوی شی‌باتر، عصاره گیلاس ژاپنی و ویتامین B5 جهت تقویت ناخن‌ها و نرمی دست‌ها.",
    specs: JSON.stringify([
      { key: "حجم", value: "۸۰ میلی‌لیتر" },
      { key: "رایحه", value: "شکوفه‌های گیلاس بهاری" },
      { key: "ویژگی", value: "تقویت کوتیکول و رفع خشکی دست" }
    ]),
    colors: JSON.stringify([]),
    rating: 4.6,
    reviewCount: 22,
    salesCount: 115,
    isSpecialOffer: false,
    isFeatured: false,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  },
  {
    title: "دفترچه برنامه‌ریزی فانتزی پلنر هفتگی نلا شاپ طرح پاستلی",
    slug: "nella-planner-notebook",
    category: "لوازم فانتزی و کادویی",
    price: 135000,
    originalPrice: 175000,
    discountPercent: 23,
    stock: 20,
    imageUrl: "https://images.pexels.com/photos/25906586/pexels-photo-25906586.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    description: "پلنر ۱۰۰ برگ تمام رنگی با کاغذ تحریر باکیفیت ۸۰ گرمی، جلد سخت سلفونی مات با طرح اختصاصی NELLA_SHOPP همراه با برچسب‌های استیکری هدیه.",
    specs: JSON.stringify([
      { key: "تعداد برگ", value: "۱۰۰ برگ گلاسه رنگی" },
      { key: "جلد", value: "هاردکاور سلفون مات ضد آب" },
      { key: "اقلام همراه", value: "۲ برگ استیکر پلنر کیوت" }
    ]),
    colors: JSON.stringify([
      { name: "صورتی لایت", code: "#fce7f3" },
      { name: "آبی ملایم", code: "#e0f2fe" }
    ]),
    rating: 4.9,
    reviewCount: 31,
    salesCount: 79,
    isSpecialOffer: true,
    isFeatured: true,
    isActive: true,
    sellerName: "نلا شاپ رسمی (NELLA_SHOPP)",
  }
];

export async function ensureSeedData() {
  try {
    const existingCount = await db.select({ count: sql<number>`count(*)` }).from(products);
    const count = Number(existingCount[0]?.count || 0);
    if (count === 0) {
      await db.insert(products).values(initialProducts);
      await db.insert(sellerSettings).values({
        shopName: "NELLA_SHOPP",
        shopBio: "مرکز تخصصی محصولات زیبایی، اکسسوری فانتزی و هدایای شیک دخترانه نلا",
        phone: "021-88997788",
        instagram: "@nella_shopp",
        telegram: "@nella_support",
        announcement: "🌸 به فروشگاه رسمی نلا شاپ خوش آمدید! تخفیف افتتاحیه روی تمامی محصولات فعال شد.",
      });
      // Add sample initial order for the seller to see!
      await db.insert(orders).values({
        orderNumber: "NEL-98214",
        customerName: "سارا محمدی",
        customerPhone: "09123456789",
        customerAddress: "تهران، سعادت‌آباد، میدان کاج، خیابان نهم، پلاک ۱۲ واحد ۴",
        items: JSON.stringify([
          { id: 1, title: "رژ لب جامد مات مخملی نلا کالکشن", price: 185000, quantity: 1, color: "صورتی نود" },
          { id: 4, title: "بالم لب حرارتی شاین‌دار کریستالی طرح پاپیون", price: 95000, quantity: 2, color: "صورتی ملایم" }
        ]),
        totalAmount: 375000,
        status: "preparing",
        paymentMethod: "درگاه پرداخت آنلاین شاپرک",
        notes: "لطفاً با بسته‌بندی کادویی نلا ارسال شود.",
      });
    }
  } catch (error) {
    console.error("Seed error:", error);
  }
}
