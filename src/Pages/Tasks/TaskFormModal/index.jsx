import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";

import useTaskStore from "../../../Store/taskStore";
import useLeadStore from "../../../Store/leadStore";
import useCustomerStore from "../../../Store/customerStore";

const priorityTranslate = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
};

const statusTranslate = {
  todo: "انجام نشده",
  doing: "در حال انجام",
  done: "انجام شده",
};

export default function TaskFormModal({ onClose, task }) {
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const leads = useLeadStore((state) => state.leads);
  const customers = useCustomerStore((state) => state.customers);
  const fetchLeads = useLeadStore((state) => state.fetchLeads);

  useEffect(() => {
    fetchLeads();
  },[leads]);
  
  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate || "",
      priority: task?.priority || "medium",
      customerStatus: task?.customerStatus || "todo",
      lead: task?.lead?.documentId || "",
      customer: task?.customer?.documentId || "",
    },

    validationSchema: Yup.object({
      title: Yup.string().trim().required("عنوان وظیفه الزامی است"),
      dueDate: Yup.string().required("تاریخ سررسید الزامی است"),
      priority: Yup.string().required("اولویت را انتخاب کنید"),
      customerStatus: Yup.string().required("وضعیت را انتخاب کنید"),
    }),

    onSubmit: async (values) => {
      const payload = {
        ...values,
        lead: values.lead || null,
        customer: values.customer || null,
      };

      try {
        const res = task
          ? await updateTask(task.documentId, payload)
          : await createTask(payload);

        if (res === null) return;

        onClose();
      } catch (error) {
        console.error("خطا در ذخیره وظیفه:", error);
      }
    },
  });

  const focusClass =
    "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-[#6366F1]/25 dark:focus:border-[#818CF8]";

  const inputClass = `w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 outline-none transition dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] dark:scheme-dark ${focusClass}`;

  const labelClass =
    "block text-sm font-medium text-slate-700 mb-2 dark:text-[#CBD5E1]";

  const errorClass = "mt-1 text-xs text-red-500 dark:text-red-400";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl dark:bg-[#172033] dark:border-[#2A3548] dark:shadow-black/40"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#2A3548]">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F1F5F9]">
              {task ? "ویرایش وظیفه" : "افزودن وظیفه"}
            </h2>

            <p className="text-sm text-slate-500 mt-1 dark:text-[#94A3B8]">
              اطلاعات وظیفه را وارد کنید
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition dark:text-[#94A3B8] dark:hover:bg-[#243247] dark:hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>
              عنوان <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="مثلاً تماس با مشتری"
              className={inputClass}
            />

            {formik.touched.title && formik.errors.title && (
              <p className={errorClass}>{formik.errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                تاریخ سررسید <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="dueDate"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
              />

              {formik.touched.dueDate && formik.errors.dueDate && (
                <p className={errorClass}>{formik.errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>اولویت</label>

              <select
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
              >
                {Object.entries(priorityTranslate).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>وضعیت</label>

            <select
              name="customerStatus"
              value={formik.values.customerStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            >
              {Object.entries(statusTranslate).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>سرنخ مرتبط</label>

              <select
                name="lead"
                value={formik.values.lead}
                onChange={formik.handleChange}
                className={inputClass}
              >
                <option value="">بدون سرنخ</option>

                {leads.map((lead) => (
                  <option key={lead.documentId} value={lead.documentId}>
                    {lead.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>مشتری مرتبط</label>

              <select
                name="customer"
                value={formik.values.customer}
                onChange={formik.handleChange}
                className={inputClass}
              >
                <option value="">بدون مشتری</option>

                {customers.map((customer) => (
                  <option key={customer.documentId} value={customer.documentId}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>توضیحات</label>

            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              placeholder="توضیحات وظیفه..."
              className={`w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 outline-none resize-none transition dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] ${focusClass}`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#2A3548]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition dark:border-[#2A3548] dark:text-[#CBD5E1] dark:hover:bg-[#243247]"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {formik.isSubmitting
                ? "در حال ذخیره..."
                : task
                  ? "ذخیره تغییرات"
                  : "ذخیره وظیفه"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
