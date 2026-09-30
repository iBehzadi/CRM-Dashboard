import { create } from "zustand";
import notify from "../Utils/notify";
import fetchData from "../Utils/fetchData";

const useLeadStore = create((set) => ({
  leads: [],

  createLead: async (lead) => {
    try {
      const res = await fetchData("leads", {
        method: "POST",
        body: JSON.stringify({
          data: lead,
        }),
      });


      set((state) => ({
        leads: [...state.leads, res.data],
      }));

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
  removeLead: (leadId) =>
    set((state) => ({
      leads: state.leads.filter((item) => item.id !== leadId),
    })),
  clearLeads: () => set({ leads: [] }),

  updateLead: (id, updatedLead) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...updatedLead } : lead,
      ),
    })),
}));

export default useLeadStore;
