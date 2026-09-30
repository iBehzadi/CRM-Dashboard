import { create } from "zustand";

const useActivityStore = create((set) => ({
  activities: [],

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

  updateActivity: (actId, leadId, updatedActivity) =>
    set((state) => ({
      activities: state.activities.map((activity) =>
        activity.id === actId
          ? {
              ...activity,
              ...updatedActivity,
              id: actId,
              leadId: leadId,
            }
          : activity,
      ),
    })),
}));

export default useActivityStore;
