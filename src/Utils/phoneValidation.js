const FA = "۰۱۲۳۴۵۶۷۸۹";
const AR = "٠١٢٣٤٥٦٧٨٩";

// convert persian and arabic digits to english digits
export const toEnglishDigits = (value) =>
  String(value ?? "")
    .replace(/[۰-۹]/g, (d) => FA.indexOf(d))
    .replace(/[٠-٩]/g, (d) => AR.indexOf(d));

// 09xxxxxxxx -> 0912xxxxxxx
export const normalizePhone = (input) => {
  // remove all non-digit characters
  let p = toEnglishDigits(input).replace(/\D/g, "");

  if (p.startsWith("0098")) p = p.slice(4);
  else if (p.startsWith("98") && p.length >= 12) p = p.slice(2);

  // 9121234567 -> 09121234567
  if (p.length === 10 && p.startsWith("9")) p = `0${p}`;

  return /^09\d{9}$/.test(p) ? p : "";
};

export const isValidMobile = (input) => normalizePhone(input) !== "";

// check if two phone numbers are the same
export const isSamePhone = (a, b) => {
  const x = normalizePhone(a);
  return x !== "" && x === normalizePhone(b);
};