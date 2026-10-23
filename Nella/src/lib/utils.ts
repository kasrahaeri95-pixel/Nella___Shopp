export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return "";
  const str = String(n);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

export function formatToman(price: number | undefined | null): string {
  if (price === undefined || price === null) return "۰ تومان";
  const formatted = price.toLocaleString("en-US");
  return `${toPersianDigits(formatted)} تومان`;
}

export function calculateDiscount(originalPrice?: number | null, price?: number | null): number {
  if (!originalPrice || !price || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
