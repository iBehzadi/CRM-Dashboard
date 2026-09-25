import { create } from "zustand";

const useLeadStore = create((set) => ({
  leads: [
    {
      id: 1,
      name: "علی رضایی",
      phone: "09121234567",
      source: "instagram",
      status: "new",
      email: "ali@example.com",
      description: "مشتری علاقه‌مند به خدمات طراحی سایت",
      date: new Date().toLocaleDateString("fa-IR"),
    },
  ],

  addLead: (lead) =>
    set((state) => {
      const exist = state.leads.find((item) => item.phone === lead.phone);
      if (exist) {
        return state;
      }
      return {
        leads: [
          ...state.leads,
          {
            ...lead,
          },
        ],
      };
    }),

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
