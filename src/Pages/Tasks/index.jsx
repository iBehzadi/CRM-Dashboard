import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiX, FiClock, FiCheckSquare } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import useTaskStore from "../../Store/taskStore";
import useLeadStore from "../../Store/leadStore";
import useCustomerStore from "../../Store/customerStore";

const priorityTranslate = { low: "کم", medium: "متوسط", high: "بالا" };
const priorityStyles = {
  low: "bg-gray-50 text-gray-600",
  medium: "bg-yellow-50 text-yellow-600",
  high: "bg-red-50 text-red-600",
};

const statusTranslate = {
  todo: "انجام نشده",
  doing: "در حال انجام",
  done: "انجام شده",
};
const statusStyles = {
  todo: "bg-gray-100 text-gray-600",
  doing: "bg-blue-50 text-blue-600",
  done: "bg-green-50 text-green-600",
};

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500";

// dueDate در Strapi میلادی ذخیره می‌شود (YYYY-MM-DD) و فقط موقع نمایش شمسی می‌شود
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
      // رابطه‌ی خالی باید null باشد تا Strapi آن را قطع کند
      const payload = {
        ...values,
        lead: values.lead || null,
        customer: values.customer || null,
      };
      try {
        if (editingTask) {
          await updateTask(editingTask.documentId, payload);
        } else {
          await createTask(payload);
        }
        closeModal();
      } catch {
        // پیام خطا را fetchData نشان داده؛ مودال باز می‌ماند تا اطلاعات از بین نرود
      }
    },
  });

  // تنها راه بستن مودال: فرم و حالت ویرایش را هم ریست می‌کند
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">وظایف</h1>
          <p className="mt-1 text-sm text-gray-500">مدیریت و پیگیری وظایف</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiPlus size={18} />
          افزودن وظیفه
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجوی عنوان وظیفه..."
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none"
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
            className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none"
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-gray-200 text-right">
                {["عنوان", "تاریخ سررسید", "اولویت", "وضعیت", ""].map(
                  (title, i) => (
                    <th
                      key={i}
                      className="px-5 py-4 text-sm font-medium text-gray-500"
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
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                    در حال بارگذاری...
                  </td>
                </tr>
              )}

              {!loading && filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
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
                    className="border-b border-gray-100 last:border-0"
                  >
                    {/* عنوان */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FiCheckSquare />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              task.customerStatus === "done"
                                ? "text-gray-400 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {task.description}
                            </p>
                          )}
                          {task.lead && (
                            <Link
                              to={`/leads/${task.lead.documentId}`}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              سرنخ: {task.lead.name}
                            </Link>
                          )}
                          {task.customer && (
                            <p className="text-xs text-gray-500">
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
                          isOverdue(task) ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        <FiClock />
                        {formatDate(task.dueDate)}
                        {isOverdue(task) && (
                          <span className="text-xs">(گذشته)</span>
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

                    {/* وضعیت (قابل تغییر مستقیم) */}
                    <td className="px-5 py-4">
                      <select
                        value={task.customerStatus || "todo"}
                        onChange={(e) => handleStatusChange(task, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs outline-none cursor-pointer ${
                          statusStyles[task.customerStatus] || statusStyles.todo
                        }`}
                      >
                        {Object.entries(statusTranslate).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* عملیات */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="ویرایش"
                          onClick={() => handleEdit(task)}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition"
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          type="button"
                          title="حذف"
                          onClick={() => handleRemove(task)}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition"
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
          <div onClick={closeModal} className="absolute inset-0 bg-black/40" />

          <div className="relative w-full max-w-lg max-h-full overflow-y-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-blue-400">
              <div>
                <h2>{editingTask ? "ویرایش وظیفه" : "افزودن وظیفه"}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  اطلاعات وظیفه را وارد کنید
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <p className="mt-1 text-xs text-red-500">{formik.errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.dueDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اولویت
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت
                </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سرنخ مرتبط
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مشتری مرتبط
                  </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات
                </label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="3"
                  placeholder="توضیحات وظیفه..."
                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-blue-400">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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