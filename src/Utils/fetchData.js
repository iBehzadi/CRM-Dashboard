import notify from "./notify";

const fetchData = async (url, options = {}) => {
  try {
    const finalUrl = import.meta.env.VITE_BASE_URL + url;

    const finalOption = {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(finalUrl, finalOption);

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message =
        data?.error?.message || "خطایی در درخواست رخ داده است";

      notify("error", message);

      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchData;