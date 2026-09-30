import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [
    {
      id: 1,
      title: "تماس با محمد احمدی",
      leadId: 2,
      dueDate: "1405/07/02",
      priority: "زیاد",
      status: "انجام نشده",
      description: "پیگیری پیشنهاد فروش",
    },
    {
      id: 2,
      title: "ارسال پیشنهاد قیمت",
      leadId: 1,
      dueDate: "1405/07/03",
      priority: "متوسط",
      status: "در حال انجام",
      description: "ارسال پیش‌فاکتور برای مشتری",
    },
  ],
}));

export default useTaskStore;