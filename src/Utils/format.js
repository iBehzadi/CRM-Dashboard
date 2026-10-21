export const formatDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString("fa-IR") : "-";

export const toman = (n) => Number(n || 0).toLocaleString("fa-IR") + " تومان";
export const inputClass =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]";

