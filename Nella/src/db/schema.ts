import { pgTable, serial, text, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug"),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  discountPercent: integer("discount_percent").default(0),
  stock: integer("stock").notNull().default(10),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  specs: text("specs"), // JSON string
  colors: text("colors"), // JSON array string
  rating: real("rating").default(4.8),
  reviewCount: integer("review_count").default(12),
  salesCount: integer("sales_count").default(0),
  isSpecialOffer: boolean("is_special_offer").default(false),
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  sellerName: text("seller_name").default("نلا شاپ رسمی"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  items: text("items").notNull(), // JSON string
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("processing"), // processing, preparing, shipped, delivered, cancelled
  paymentMethod: text("payment_method").default("آنلاین"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  reply: text("reply"),
  status: text("status").default("pending"), // pending, answered
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sellerSettings = pgTable("seller_settings", {
  id: serial("id").primaryKey(),
  shopName: text("shop_name").default("NELLA_SHOPP"),
  shopBio: text("shop_bio").default("فروشگاه تخصصی محصولات زیبایی، مد و اکسسوری فانتزی"),
  phone: text("phone").default("021-88997788"),
  instagram: text("instagram").default("@nella_shopp"),
  telegram: text("telegram").default("@nella_support"),
  announcement: text("announcement").default("ارسال رایگان برای خریدهای بالای ۴۰۰ هزار تومان با بسته‌بندی ویژه کادویی نلا! 🌸✨"),
  bannerUrl: text("banner_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type SupportMessage = typeof supportMessages.$inferSelect;
