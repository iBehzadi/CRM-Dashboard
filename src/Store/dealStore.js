import { create } from "zustand";
import fetchData from "../Utils/fetchData";
import notify from "../Utils/notify";

const useDealStore = create((set, get) => ({
  deals: [],
  loading: false,

  fetchDeals: async ({ silent = false } = {}) => {
    if (!silent) set({ loading: true });
    try {
      const res = await fetchData(
        "deals?populate=customer&sort=createdAt:desc&pagination[pageSize]=100",
      );
      set({ deals: res.data });
    } catch (error) {
      notify("error", "خطا در دریافت معاملات");
      console.error(error);
    } finally {
      if (!silent) set({ loading: false });
    }
  },

  createDeal: async (deal) => {
    set({ loading: true });
    try {
      const res = await fetchData("deals", {
        method: "POST",
        body: JSON.stringify({
          data: deal,
        }),
      });
      notify("success", "معامله با موفقیت ایجاد شد");
      await get().fetchDeals({ silent: true });
      return res.data;
    } catch (error) {
      notify("error", "خطا در ایجاد معامله");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  updateDeal: async (id, deal) => {
    set({ loading: true });
    try {
      const res = await fetchData(`deals/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          data: deal,
        }),
      });
      notify("success", "معامله با موفقیت به‌روزرسانی شد");
      await get().fetchDeals({ silent: true });
      return res.data;
    } catch (error) {
      notify("error", "خطا در به‌روزرسانی معامله");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  removeDeal: async (id) => {
    set({ loading: true });
    try {
      await fetchData(`deals/${id}`, {
        method: "DELETE",
      });
      notify("success", "معامله با موفقیت حذف شد");
      await get().fetchDeals({ silent: true });
    } catch (error) {
      notify("error", "خطا در حذف معامله");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDealStore;
