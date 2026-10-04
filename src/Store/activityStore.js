import { create } from "zustand";
import fetchData from "../Utils/fetchData";
import notify from "../Utils/notify";

const useActivityStore = create((set) => ({
  activities: [],

  fetchActivities: async () => {
    try {
      const res = await fetchData("activities?populate=lead");
      set({ activities: res.data });
    } catch (error) {
      console.error(error);
      throw error;
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
      console.error(error);
      throw error;
    }
  },
  removeActivity: async (activityId) => {
    try {
      await fetchData(`activities/${activityId}`, {
        method: "DELETE",
      });
    } catch (error) {
      notify("error", error.message);
      throw error;
    }
    set((state) => ({
      activities: state.activities.filter(
        (activity) => activity.documentId !== activityId,
      ),
    }));
    notify("success", "فعالیت حذف شد");
  },

  updateActivity: async (actId, updatedActivity) => {
    try {
      await fetchData(`activities/${actId}`, {
        method: "PUT",
        body: JSON.stringify({
          data: updatedActivity,
        }),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.documentId === actId
          ? {
              ...activity,
              ...updatedActivity,
            }
          : activity,
      ),
    }));
    notify("success", "فعالیت به‌روزرسانی شد");
  },
}));

export default useActivityStore;
