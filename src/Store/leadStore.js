import { create } from "zustand";
import notify from "../Utils/notify";
import fetchData from "../Utils/fetchData";

const useLeadStore = create((set) => ({
  leads: [],

  createLead: async (lead) => {
    try {
      const exist = useLeadStore
        .getState()
        .leads.some((l) => l.phone === lead.phone);
      if (exist) {
        notify("error", "سرنخ با این شماره موبایل قبلاً وجود دارد");
        return;
      }
      const res = await fetchData("leads", {
        method: "POST",
        body: JSON.stringify({
          data: lead,
        }),
      });

      set((state) => ({
        leads: [...state.leads, res.data],
      }));
      notify("success", "سرنخ ایجاد شد");
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  fetchLeads: async () => {
    try {
      // Strapi به‌طور پیش‌فرض فقط ۲۵ رکورد برمی‌گرداند؛ حداکثر مجاز ۱۰۰ است
      const res = await fetchData("leads?pagination[pageSize]=100");
      set({ leads: res.data });
    } catch (error) {
      // پیام خطا را fetchData قبلاً نشان داده است
      console.error(error);
    }
  },
  removeLead: async (leadId) => {
    // اگر درخواست fail شود، fetchData پیام خطا را نشان می‌دهد و اینجا قطع می‌شود
    await fetchData(`leads/${leadId}`, {
      method: "DELETE",
    });
    notify("success", "سرنخ حذف شد");
    set((state) => ({
      leads: state.leads.filter((item) => item.documentId !== leadId),
    }));
  },
  clearLeads: () => set({ leads: [] }),

  updateLead: async (documentId, updatedLead) => {
    await fetchData(`leads/${documentId}`, {
      method: "PUT",
      body: JSON.stringify({
        data: updatedLead,
      }),
    });
    notify("success", "سرنخ به‌روزرسانی شد");
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.documentId === documentId ? { ...lead, ...updatedLead } : lead,
      ),
    }));
  },
}));

export default useLeadStore;
