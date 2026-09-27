import { create } from "zustand";

const useActivityStore = create((set) => ({
  activities: [
    // {
    //   id: 1,
    //   leadId: 1,
    //   type: "call",
    //   title: "تماس با مشتری",
    //   description: "درباره قیمت محصول صحبت شد.",
    //   date: "2025-01-15",
    // },
    // {
    //   id: 2,
    //   leadId: 1,
    //   type: "note",
    //   title: "پیگیری مشتری",
    //   description: "قرار شد فردا مجدداً تماس گرفته شود.",
    //   date: "2025-01-14",
    // },
    // {
    //   id: 3,
    //   leadId: 2,
    //   type: "meet",
    //   title: "جلسه با مشتری",
    //   description: "جلسه معرفی خدمات برگزار شد.",
    //   date: "2025-01-13",
    // },
  ],

  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
    })),

  removeActivity: (activityId) =>
    set((state) => ({
      activities: state.activities.filter(
        (activity) => activity.id !== activityId,
      ),
    })),

  updateActivity: (updatedActivity) =>
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.id === updatedActivity.id ? updatedActivity : activity,
      ),
    })),
}));

export default useActivityStore;
