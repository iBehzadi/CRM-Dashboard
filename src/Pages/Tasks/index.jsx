import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiClock,
  FiCheckSquare,
} from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import useTaskStore from "../../Store/taskStore";
import useLeadStore from "../../Store/leadStore";
import useCustomerStore from "../../Store/customerStore";

const priorityTranslate = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  high: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

const statusTranslate = {
  todo: "انجام نشده",
  doing: "در حال انجام",
  done: "انجام شده",
};

const statusStyles = {
  todo: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  doing: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  done: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
};

const focusClass =
  "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-[#6366F1]/25 dark:focus:border-[#818CF8]";

const inputClass = `w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 outline-none transition dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] dark:scheme-dark ${focusClass}`;

const filterClass = `h-10 px-4 rounded-lg bg-white text-slate-700 border border-slate-200 outline-none transition dark:bg-[#111827] dark:text-[#F1F5F9] dark:border-[#2A3548] dark:scheme-dark ${focusClass}`;

const labelClass =
  "block text-sm font-medium text-slate-700 mb-2 dark:text-[#CBD5E1]";

const errorClass = "mt-1 text-xs text-red-500 dark:text-red-400";

const formatDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString("fa-IR") : "-";

const isOverdue = (task) =>
  task.dueDate &&
  task.customerStatus !== "done" &&
  new Date(`${task.dueDate}T23:59:59`) < new Date();

const Tasks = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const loading = useTaskStore((state) => state.loading);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const removeTask = useTaskStore((state) => state.removeTask);

  const leads = useLeadStore((state) => state.leads);
  const customers = useCustomerStore((state) => state.customers);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
    fetchCustomers({ silent: true });
  }, [fetchTasks, fetchCustomers]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      customerStatus: "todo",
      lead: "",
      customer: "",
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
        if (editingTask) {
          const res = await updateTask(editingTask.documentId, payload);
          if (res === null) return;
          closeModal();
        } else {
          const res = await createTask(payload);
          if (res === null) return;
          closeModal();
        }
      } catch {}
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    formik.resetForm();
  };

  const handleEdit = (task) => {
    setEditingTask(task);

    formik.setValues({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
      priority: task.priority || "medium",
      customerStatus: task.customerStatus || "todo",
      lead: task.lead?.documentId || "",
      customer: task.customer?.documentId || "",
    });

    setShowModal(true);
  };

  const handleRemove = (task) => {
    if (!window.confirm(`وظیفه «${task.title}» حذف شود؟`)) return;
    removeTask(task.documentId).catch(() => {});
  };

  const handleStatusChange = (task, customerStatus) => {
    updateTask(task.documentId, { customerStatus }).catch(() => {});
  };

  const filteredTasks = tasks.filter((t) => {
    const q = search.trim();
    const matchesSearch = !q || (t.title || "").includes(q);
    const matchesStatus =
      statusFilter === "all" || t.customerStatus === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 text-slate-800 dark:text-[#F1F5F9]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F1F5F9]">
            وظایف
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">
            مدیریت و پیگیری وظایف
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-600/10 dark:shadow-none dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <FiPlus size={18} />
          افزودن وظیفه
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm dark:bg-[#172033] dark:border-[#2A3548] dark:shadow-none">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#64748B]"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجوی عنوان وظیفه..."
              className={`w-full h-10 pr-10 pl-4 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 outline-none transition dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] dark:border-[#2A3548] ${focusClass}`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={filterClass}
          >
            <option value="all">همه وضعیت‌ها</option>
            {Object.entries(statusTranslate).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={filterClass}
          >
            <option value="all">همه اولویت‌ها</option>
            {Object.entries(priorityTranslate).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm dark:bg-[#172033] dark:border-[#2A3548] dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 text-right bg-slate-50 dark:bg-[#111827] dark:border-[#2A3548]">
                {["عنوان", "تاریخ سررسید", "اولویت", "وضعیت", ""].map(
                  (title, i) => (
                    <th
                      key={i}
                      className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-[#94A3B8]"
                    >
                      {title}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500 dark:text-[#94A3B8]"
                  >
                    در حال بارگذاری...
                  </td>
                </tr>
              )}

              {!loading && filteredTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-slate-500 dark:text-[#94A3B8]"
                  >
                    {tasks.length === 0
                      ? "هنوز وظیفه‌ای ثبت نشده است"
                      : "وظیفه‌ای با این فیلترها پیدا نشد"}
                  </td>
                </tr>
              )}

              {!loading &&
                filteredTasks.map((task) => (
                  <tr
                    key={task.documentId}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors dark:border-[#2A3548] dark:hover:bg-[#243247]"
                  >
                    {/* عنوان */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-500/10 dark:text-[#818CF8]">
                          <FiCheckSquare />
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`font-medium ${
                              task.customerStatus === "done"
                                ? "text-slate-400 line-through dark:text-[#64748B]"
                                : "text-slate-800 dark:text-[#F1F5F9]"
                            }`}
                          >
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="text-xs text-slate-500 mt-1 dark:text-[#94A3B8]">
                              {task.description}
                            </p>
                          )}

                          {task.lead && (
                            <Link
                              to={`/leads/${task.lead.documentId}`}
                              className="inline-block text-xs text-indigo-600 hover:text-indigo-800 hover:underline mt-1 dark:text-[#818CF8] dark:hover:text-indigo-300"
                            >
                              سرنخ: {task.lead.name}
                            </Link>
                          )}

                          {task.customer && (
                            <p className="text-xs text-slate-500 mt-1 dark:text-[#94A3B8]">
                              مشتری: {task.customer.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* تاریخ */}
                    <td className="px-5 py-4">
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isOverdue(task)
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-600 dark:text-[#CBD5E1]"
                        }`}
                      >
                        <FiClock className="shrink-0" />
                        {formatDate(task.dueDate)}

                        {isOverdue(task) && (
                          <span className="text-xs text-red-600 dark:text-red-400">
                            (گذشته)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* اولویت */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          priorityStyles[task.priority] || priorityStyles.low
                        }`}
                      >
                        {priorityTranslate[task.priority] || "-"}
                      </span>
                    </td>

                    {/* وضعیت */}
                    <td className="px-5 py-4">
                      <select
                        value={task.customerStatus || "todo"}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs outline-none cursor-pointer border border-transparent dark:scheme-dark ${
                          statusStyles[task.customerStatus] || statusStyles.todo
                        }`}
                      >
                        {Object.entries(statusTranslate).map(
                          ([value, label]) => (
                            <option
                              key={value}
                              value={value}
                              className="bg-white text-slate-800 dark:bg-[#172033] dark:text-[#F1F5F9]"
                            >
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </td>

                    {/* عملیات */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="ویرایش"
                          onClick={() => handleEdit(task)}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20 dark:hover:bg-indigo-500 dark:hover:text-white"
                        >
                          <FaEdit size={15} />
                        </button>

                        <button
                          type="button"
                          title="حذف"
                          onClick={() => handleRemove(task)}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20 dark:hover:bg-red-500 dark:hover:text-white"
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />

          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-2xl dark:bg-[#172033] dark:border-[#2A3548] dark:shadow-black/40">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#2A3548]">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-[#F1F5F9]">
                  {editingTask ? "ویرایش وظیفه" : "افزودن وظیفه"}
                </h2>

                <p className="text-sm text-slate-500 mt-1 dark:text-[#94A3B8]">
                  اطلاعات وظیفه را وارد کنید
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition dark:text-[#94A3B8] dark:hover:bg-[#243247] dark:hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={labelClass}>
                  عنوان <span className="text-red-500 dark:text-red-400">*</span>
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
                    تاریخ سررسید{" "}
                    <span className="text-red-500 dark:text-red-400">*</span>
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
                    {Object.entries(priorityTranslate).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
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
                      <option
                        key={customer.documentId}
                        value={customer.documentId}
                      >
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
                  rows="3"
                  placeholder="توضیحات وظیفه..."
                  className={`w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 outline-none resize-none transition dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] ${focusClass}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#2A3548]">
                <button
                  type="button"
                  onClick={closeModal}
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
                    ? "در حال ذخیره ..."
                    : editingTask
                      ? "ذخیره تغییرات"
                      : "ذخیره وظیفه"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;