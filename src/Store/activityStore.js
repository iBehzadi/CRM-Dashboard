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
      // پیام خطا را fetchData قبلاً نشان داده است
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
      console.error(error);
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
    // فیلد lead در استیت یک آبجکت است. اگر رشته‌ی id روی آن بنشیند،
    // activity.lead.documentId از بین می‌رود و فعالیت از لیست ناپدید می‌شود.
    // eslint-disable-next-line no-unused-vars
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
