import { create } from "zustand";
import fetchData from "../Utils/fetchData";
import notify from "../Utils/notify";
import useLeadStore from "./leadStore";

const useCustomerStore = create((set, get) => ({
  customers: [],
  loading: false,

  fetchCustomers: async ({ silent = false } = {}) => {
    if (!silent) set({ loading: true });
    try {
      const res = await fetchData(
        "customers?populate=lead&sort=createdAt:desc&pagination[pageSize]=100",
      );
      set({ customers: res.data });
    } catch (error) {
     
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createCustomer: async (customer) => {
    const exist = get().customers.some((c) => c.phone === customer.phone);
    if (exist) {
      notify("error", "مشتری با این شماره تماس قبلاً وجود دارد");
      return null;
    }
    const res = await fetchData("customers", {
      method: "POST",
      body: JSON.stringify({ data: customer }),
    });
    
    await get().fetchCustomers({ silent: true });
    notify("success", "مشتری ایجاد شد");
    return res.data;
  },

  updateCustomer: async (documentId, updatedCustomer) => {
    await fetchData(`customers/${documentId}`, {
      method: "PUT",
      body: JSON.stringify({ data: updatedCustomer }),
    });
    set((state) => ({
      customers: state.customers.map((c) =>
        c.documentId === documentId ? { ...c, ...updatedCustomer } : c,
      ),
    }));
    notify("success", "مشتری به‌روزرسانی شد");
  },

  removeCustomer: async (documentId) => {
    await fetchData(`customers/${documentId}`, { method: "DELETE" });
    set((state) => ({
      customers: state.customers.filter((c) => c.documentId !== documentId),
    }));
    notify("success", "مشتری حذف شد");
  },

  
  convertLead: async (lead) => {
    if (get().customers.length === 0) {
      await get().fetchCustomers({ silent: true });
    }
    const already = get().customers.some(
      (c) => c.lead?.documentId === lead.documentId || c.phone === lead.phone,
    );
    if (already) {
      notify("error", "این سرنخ قبلاً به مشتری تبدیل شده است");
      return null;
    }

    const res = await fetchData("customers", {
      method: "POST",
      body: JSON.stringify({
        data: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email || "",
          source: lead.source,
          description: lead.description || "",
          lead: lead.documentId,
        },
      }),
    });

    await useLeadStore
      .getState()
      .updateLead(lead.documentId, { leadStatus: "converted" });
    await get().fetchCustomers({ silent: true });
    notify("success", "سرنخ به مشتری تبدیل شد");
    return res.data;
  },
}));

export default useCustomerStore;