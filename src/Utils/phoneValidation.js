const FA = "۰۱۲۳۴۵۶۷۸۹";
const AR = "٠١٢٣٤٥٦٧٨٩";

// ارقام فارسی و عربی -> لاتین
export const toEnglishDigits = (value) =>
  String(value ?? "")
    .replace(/[۰-۹]/g, (d) => FA.indexOf(d))
    .replace(/[٠-٩]/g, (d) => AR.indexOf(d));

// شماره موبایل ایران را به شکل استاندارد 09xxxxxxxxx برمی‌گرداند.
// اگر شماره موبایل معتبر نباشد، رشته خالی برمی‌گرداند.
export const normalizePhone = (input) => {
  // فقط رقم‌ها (فاصله، خط تیره، پرانتز و + حذف می‌شن)
  let p = toEnglishDigits(input).replace(/\D/g, "");

  if (p.startsWith("0098")) p = p.slice(4);
  else if (p.startsWith("98") && p.length >= 12) p = p.slice(2);

  // 9121234567 -> 09121234567
  if (p.length === 10 && p.startsWith("9")) p = `0${p}`;

  return /^09\d{9}$/.test(p) ? p : "";
};

export const isValidMobile = (input) => normalizePhone(input) !== "";

// مقایسه دو شماره (برای چک تکراری بودن)
export const isSamePhone = (a, b) => {
  const x = normalizePhone(a);
  return x !== "" && x === normalizePhone(b);
};