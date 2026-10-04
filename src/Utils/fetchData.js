import notify from "./notify";

const fetchData = async (url, options = {}) => {
  const finalUrl = import.meta.env.VITE_BASE_URL + url;

  const finalOption = {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  };

  let res;
  try {
    res = await fetch(finalUrl, finalOption);
  } catch (error) {
    // سرور خاموش است یا اینترنت قطع است
    const message = "ارتباط با سرور برقرار نشد";
    notify("error", message);
    throw new Error(message);
  }

  // اول متن را می‌خوانیم و بعد تلاش می‌کنیم JSON بشود.
  // اگر سرور HTML برگرداند (مثلاً خطای 502)، برنامه با SyntaxError نمی‌ترکد.
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = data?.error?.message || "خطایی در درخواست رخ داده است";
    notify("error", message);
    throw new Error(message);
  }

  return data;
};

export default fetchData;
