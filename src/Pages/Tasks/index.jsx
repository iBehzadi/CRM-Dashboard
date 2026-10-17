import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiX, FiClock, FiCheckSquare } from "react-icons/fi";
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
  low: "bg-slate-500/15 text-slate-400",
  medium: "bg-yellow-500/15 text-yellow-400",
  high: "bg-red-500/15 text-red-400",
};

const statusTranslate = {
  todo: "انجام نشده",
  doing: "در حال انجام",
  done: "انجام شده",
};

const statusStyles = {
  todo: "bg-slate-500/15 text-slate-400",
  doing: "bg-blue-500/15 text-blue-400",
  done: "bg-green-500/15 text-green-400",
};

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-[#2A3548] bg-[#0B1120] text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

const labelClass = "block text-sm font-medium text-slate-300 mb-2";

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
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">وظایف</h1>
          <p className="mt-1 text-sm text-slate-400">مدیریت و پیگیری وظایف</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/10"
        >
          <FiPlus size={18} />
          افزودن وظیفه
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#172033] border border-[#2A3548] rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجوی عنوان وظیفه..."
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-[#0B1120] text-slate-100 placeholder:text-slate-500 border border-[#2A3548] outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-[#0B1120] text-slate-200 border border-[#2A3548] outline-none focus:ring-2 focus:ring-indigo-500"
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
            className="h-10 px-4 rounded-lg bg-[#0B1120] text-slate-200 border border-[#2A3548] outline-none focus:ring-2 focus:ring-indigo-500"
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
      <div className="bg-[#172033] rounded-xl border border-[#2A3548] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-[#2A3548] text-right bg-[#111827]/70">
                {["عنوان", "تاریخ سررسید", "اولویت", "وضعیت", ""].map(
                  (title, i) => (
                    <th
                      key={i}
                      className="px-5 py-4 text-sm font-medium text-slate-400"
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
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    در حال بارگذاری...
                  </td>
                </tr>
              )}

              {!loading && filteredTasks.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-slate-400"
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
                    className="border-b border-[#2A3548]/70 last:border-0 hover:bg-[#243247]/40 transition-colors"
                  >
                    {/* عنوان */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                          <FiCheckSquare />
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`font-medium ${
                              task.customerStatus === "done"
                                ? "text-slate-500 line-through"
                                : "text-slate-100"
                            }`}
                          >
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="text-xs text-slate-400 mt-1">
                              {task.description}
                            </p>
                          )}

                          {task.lead && (
                            <Link
                              to={`/leads/${task.lead.documentId}`}
                              className="inline-block text-xs text-indigo-400 hover:text-indigo-300 hover:underline mt-1"
                            >
                              سرنخ: {task.lead.name}
                            </Link>
                          )}

                          {task.customer && (
                            <p className="text-xs text-slate-400 mt-1">
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
                          isOverdue(task) ? "text-red-400" : "text-slate-300"
                        }`}
                      >
                        <FiClock className="shrink-0" />
                        {formatDate(task.dueDate)}

                        {isOverdue(task) && (
                          <span className="text-xs text-red-400">(گذشته)</span>
                        )}
                      </div>
                    </td>

                    {/* اولویت */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${
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
                        className={`px-3 py-1 rounded-full text-xs outline-none cursor-pointer border border-transparent ${
                          statusStyles[task.customerStatus] || statusStyles.todo
                        }`}
                      >
                        {Object.entries(statusTranslate).map(
                          ([value, label]) => (
                            <option
                              key={value}
                              value={value}
                              className="bg-[#172033] text-slate-100"
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
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition"
                        >
                          <FaEdit size={15} />
                        </button>

                        <button
                          type="button"
                          title="حذف"
                          onClick={() => handleRemove(task)}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white transition"
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
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#172033] border border-[#2A3548] rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#2A3548]">
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  {editingTask ? "ویرایش وظیفه" : "افزودن وظیفه"}
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  اطلاعات وظیفه را وارد کنید
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-[#243247] hover:text-white transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={labelClass}>
                  عنوان <span className="text-red-400">*</span>
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
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    تاریخ سررسید <span className="text-red-400">*</span>
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
                    <p className="mt-1 text-xs text-red-400">
                      {formik.errors.dueDate}
                    </p>
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
                      <option
                        key={value}
                        value={value}
                        className="bg-[#172033] text-slate-100"
                      >
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
                    <option
                      key={value}
                      value={value}
                      className="bg-[#172033] text-slate-100"
                    >
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
                      <option
                        key={lead.documentId}
                        value={lead.documentId}
                        className="bg-[#172033] text-slate-100"
                      >
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
                        className="bg-[#172033] text-slate-100"
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
                  className="w-full p-3 rounded-lg border border-[#2A3548] bg-[#0B1120] text-slate-100 placeholder:text-slate-500 outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A3548]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-[#2A3548] text-slate-300 hover:bg-[#243247] transition"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
