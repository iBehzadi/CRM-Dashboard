import { create } from "zustand";
import fetchData from "../Utils/fetchData";
import notify from "../Utils/notify";

const useActivityStore = create((set) => ({
  activities: [],

  fetchActivities: async () => {
    try {
      const res = await fetchData(
        "activities?populate=lead&pagination[pageSize]=100",
      );
      set({ activities: res.data });
    } catch (error) {
      notify("error", "خطا در دریافت فعالیت‌ها");
      console.error(error);
    }
  },
  addActivity: async (activity) => {
    try {
      await fetchData("activities", {
        method: "POST",
        body: JSON.stringify({
          data: activity,
        }),
      });

      await useActivityStore.getState().fetchActivities();

      notify("success", "فعالیت ایجاد شد");

      return true;
    } catch (error) {
      notify("error", "خطا در ایجاد فعالیت");
      throw error;
    }
  },
  removeActivity: async (activityId) => {
    await fetchData(`activities/${activityId}`, {
      method: "DELETE",
    });
    set((state) => ({
      activities: state.activities.filter(
        (activity) => activity.documentId !== activityId,
      ),
    }));
    notify("success", "فعالیت حذف شد");
  },

  updateActivity: async (actId, updatedActivity) => {
    
    const { lead, ...changes } = updatedActivity;
    await fetchData(`activities/${actId}`, {
      method: "PUT",
      body: JSON.stringify({
        data: updatedActivity,
      }),
    });
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.documentId === actId
          ? {
              ...activity,
              ...changes,
            }
          : activity,
      ),
    }));
    notify("success", "فعالیت به‌روزرسانی شد");
  },
}));

export default useActivityStore;
