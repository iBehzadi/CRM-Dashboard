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
    const res = await fetchData("leads");
    set({ leads: res.data });
  },
  removeLead: async (leadId) => {
    try {
      await fetchData(`leads/${leadId}`, {
        method: "DELETE",
      });

      notify("success", "سرنخ حذف شد");
    } catch (error) {
      notify("error", error.message);
      throw error;
    }
    set((state) => ({
      leads: state.leads.filter((item) => item.documentId !== leadId),
    }));
  },
  clearLeads: () => set({ leads: [] }),

  updateLead: async (documentId, updatedLead) => {
    try {
      await fetchData(`leads/${documentId}`, {
        method: "PUT",
        body: JSON.stringify({
          data: updatedLead,
        }),
      });

      notify("success", "سرنخ به‌روزرسانی شد");
    } catch (error) {
      notify("error", error.message);
      throw error;
    }
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.documentId === documentId ? { ...lead, ...updatedLead } : lead,
      ),
    }));
  },
}));

export default useLeadStore;
