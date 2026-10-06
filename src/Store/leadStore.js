import { create } from "zustand";
import notify from "../Utils/notify";
import fetchData from "../Utils/fetchData";
import useCustomerStore from "./customerStore";

const useLeadStore = create((set, get) => ({
  leads: [],
  //create lead
  createLead: async (lead) => {
    try {
      const exist = get().leads.some((l) => l.phone === lead.phone);
      if (exist) {
        notify("error", "سرنخ با این شماره موبایل قبلاً وجود دارد");
        return;
      }
      const customerExists  = useCustomerStore.getState().customers.some(
        (c) => c.phone === lead.phone,
      );
      if (customerExists ) {
        //page size is 100 if there are more than 100 customers, this check might not be accurate -- repair this if needed
        notify("error", "سرنخ با این شماره موبایل قبلاً در مشتریان وجود دارد");
        return;
      }
      const res = await fetchData("leads", {
        method: "POST",
        body: JSON.stringify({
          data: lead,
        }),
      });

      await get().fetchLeads();
      notify("success", "سرنخ ایجاد شد");
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  //fetch leads
  fetchLeads: async () => {
    try {
      const res = await fetchData("leads?pagination[pageSize]=100");
      set({ leads: res.data });
    } catch (error) {
      console.error(error);
    }
  },

  //remove lead
  removeLead: async (leadId) => {
    await fetchData(`leads/${leadId}`, {
      method: "DELETE",
    });
    notify("success", "سرنخ حذف شد");
    set((state) => ({
      leads: state.leads.filter((item) => item.documentId !== leadId),
    }));
  },

  //clear leads
  clearLeads: () => set({ leads: [] }),

  //update lead
  updateLead: async (documentId, updatedLead) => {
    const exist = get().leads.some((l) => l.phone === updatedLead.phone);
    if (exist) {
      notify("error", "سرنخ با این شماره موبایل قبلاً وجود دارد");
      return null;
    }
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
