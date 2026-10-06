import { create } from "zustand";
import fetchData from "../Utils/fetchData";
import notify from "../Utils/notify";

const useActivityStore = create((set, get) => ({
  activities: [],

  //fetch activity - get activity
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
  //add activity
  addActivity: async (activity) => {
    try {
      await fetchData("activities", {
        method: "POST",
        body: JSON.stringify({
          data: activity,
        }),
      });
      await get().fetchActivities();
      notify("success", "فعالیت ایجاد شد");
      return true;
    } catch (error) {
      notify("error", "خطا در ایجاد فعالیت");
      throw error;
    }
  },
  //remove activity
  removeActivity: async (activityId) => {
    try {
      await fetchData(`activities/${activityId}`, {
        method: "DELETE",
      });
      set((state) => ({
        activities: state.activities.filter(
          (activity) => activity.documentId !== activityId,
        ),
      }));
      notify("success", "فعالیت حذف شد");
    } catch (error) {
      notify("error", "خطا در حذف فعالیت");
      console.error(error);
    }
  },
  //update activity
  updateActivity: async (actId, updatedActivity) => {
    const { ...changes } = updatedActivity;
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
