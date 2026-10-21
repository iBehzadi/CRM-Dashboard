import notify from "./notify";
import useAuthStore from "../Store/authStore";

const fetchData = async (url, options = {}) => {
  const { skipAuth = false, ...fetchOptions } = options;
  const finalUrl = import.meta.env.VITE_BASE_URL + url;

  const jwt = useAuthStore.getState().jwt;
  const sendToken = Boolean(jwt) && !skipAuth;

  const headers = { ...fetchOptions.headers };

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (sendToken) {
    headers.Authorization = `Bearer ${jwt}`;
  }

  let res;
  try {
    res = await fetch(finalUrl, { ...fetchOptions, headers });
  } catch (error) {
    const message = "ارتباط با سرور برقرار نشد";
    notify("error", message);
    throw new Error(message);
  }

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
    // توکن منقضی یا نامعتبر: خروج کاربر (ProtectedRoute خودش به /auth می‌برد)
    if (res.status === 401 && sendToken) {
      useAuthStore.getState().logout();
      const message = "نشست شما منقضی شده است. دوباره وارد شوید";
      notify("error", message);
      throw new Error(message);
    }

    if (res.status === 403) {
      const message = "شما دسترسی لازم برای این عملیات را ندارید";
      notify("error", message);
      throw new Error(message);
    }

    const message = data?.error?.message || "خطایی در درخواست رخ داده است";
    // notify("error", message);
    console.log(message);
    throw new Error(message);
  }

  return data;
};

export default fetchData;
