import { create } from "zustand";
import fetchData from "../Utils/fetchData";
import notify from "../Utils/notify";

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async ({ silent = false } = {}) => {
    if (!silent) set({ loading: true });
    try {
      const res = await fetchData(
        "tasks?populate[0]=lead&populate[1]=customer&sort=dueDate:asc&pagination[pageSize]=100",
      );
      set({ tasks: res.data });
    } catch (error) {
      notify("error", "خطا در دریافت وظایف");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (task) => {
    try {
      await fetchData("tasks", {
        method: "POST",
        body: JSON.stringify({ data: task }),
      });

      await get().fetchTasks({ silent: true });
      notify("success", "وظیفه ایجاد شد");
    } catch (error) {
      notify("error", "خطا در ایجاد وظیفه");
      console.error(error);
    }
  },

  updateTask: async (documentId, changes) => {
    await fetchData(`tasks/${documentId}`, {
      method: "PUT",
      body: JSON.stringify({ data: changes }),
    });
    await get().fetchTasks({ silent: true });
    notify("success", "وظیفه به‌روزرسانی شد");
  },

  removeTask: async (documentId) => {
    await fetchData(`tasks/${documentId}`, { method: "DELETE" });
    set((state) => ({
      tasks: state.tasks.filter((t) => t.documentId !== documentId),
    }));
    notify("success", "وظیفه حذف شد");
  },
}));

export default useTaskStore;
