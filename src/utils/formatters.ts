export function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

export function formatToman(price: number): string {
  const formatted = new Intl.NumberFormat('en-US').format(price);
  return toPersianDigits(formatted) + ' تومان';
}

export function formatUsd(price: number): string {
  return '$' + new Intl.NumberFormat('en-US').format(price);
}
