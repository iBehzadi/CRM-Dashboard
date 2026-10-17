import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiMoreVertical, FiX } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import useLeadStore from "../../Store/leadStore";
import notify from "../../Utils/notify";

const statusStyles = {
  new: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  following:
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-300",
  negotiation:
    "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300",
  converted:
    "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-300",
};

const statusTranslate = {
  new: "جدید",
  following: "درحال پیگیری",
  negotiation: "مذاکره",
  converted: "تبدیل‌شده",
};

const sourceTranslate = {
  instagram: "اینستاگرام",
  website: "وبسایت",
  referral: "معرفی",
  advertisement: "تبلیغات",
};

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]";

const Leads = () => {
  const createLead = useLeadStore((state) => state.createLead);
  const updateLead = useLeadStore((state) => state.updateLead);
  const removeLead = useLeadStore((state) => state.removeLead);
  const leads = useLeadStore((state) => state.leads);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [editingLead, setEditingLead] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      source: "",
      leadStatus: "new",
      description: "",
      date: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("نام و نام خانوادگی الزامی است"),
      phone: Yup.string().required("شماره تماس الزامی است"),
      date: Yup.date().required("تاریخ را مشخص کنید"),
      email: Yup.string().email("ایمیل معتبر نیست"),
      source: Yup.string().required("منبع سرنخ را انتخاب کنید"),
      leadStatus: Yup.string().required("وضعیت را انتخاب کنید"),
    }),

    onSubmit: async (values) => {
      try {
        if (editingLead) {
          const result = await updateLead(editingLead.documentId, values);
          if (result === null) return;
          closeModal();
        } else {
          const created = await createLead(values);
          if (!created) return;
          closeModal();
        }
      } catch (error) {
        notify("error", error.message);
        console.log(error.message);
      }
    },
  });

  const handleEdit = (lead) => {
    setEditingLead(lead);

    formik.setValues({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      source: lead.source,
      date: lead.date,
      leadStatus: lead.leadStatus,
      description: lead.description || "",
    });

    setShowModal(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const q = search.trim().toLowerCase();

    const matchesSearch =
      (lead.name || "").toLowerCase().includes(q) ||
      (lead.phone || "").includes(search.trim());

    const matchesStatus =
      statusFilter === "all" || lead.leadStatus === statusFilter;

    const matchesSource =
      sourceFilter === "all" || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingLead(null);
    formik.resetForm();
  };

  const handleRemove = (documentId) => {
    if (!window.confirm("از حذف این سرنخ مطمئن هستید؟")) return;
    removeLead(documentId).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-[#F1F5F9]">
            سرنخ‌ها
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-[#94A3B8]">
            مدیریت و پیگیری مشتریان بالقوه
          </p>
        </div>

        <button
          onClick={() => {
            setEditingLead(null);
            formik.resetForm();
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <FiPlus size={18} />
          افزودن سرنخ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 dark:bg-[#172033] dark:border-[#2A3548]">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#64748B]"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجوی نام یا شماره تماس..."
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#111827] dark:border-[#2A3548] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]"
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#111827] dark:border-[#2A3548] dark:text-[#F1F5F9]"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="new">جدید</option>
            <option value="following">در حال پیگیری</option>
            <option value="negotiation">مذاکره</option>
            <option value="converted">تبدیل‌شده</option>
          </select>

          {/* Source */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-[#111827] dark:border-[#2A3548] dark:text-[#F1F5F9]"
          >
            <option value="all">همه منابع</option>
            <option value="instagram">اینستاگرام</option>
            <option value="website">وب‌سایت</option>
            <option value="referral">معرفی</option>
            <option value="advertisement">تبلیغات</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden dark:bg-[#172033] dark:border-[#2A3548]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200 dark:bg-[#111827] dark:border-[#2A3548]">
              <tr>
                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500 dark:text-[#94A3B8]">
                  نام
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500 dark:text-[#94A3B8]">
                  شماره تماس
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500 dark:text-[#94A3B8]">
                  منبع
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500 dark:text-[#94A3B8]">
                  وضعیت
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500 dark:text-[#94A3B8]">
                  تاریخ
                </th>

                <th className="px-5 py-4"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#2A3548]">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.documentId}
                  className="hover:bg-gray-50 transition-colors dark:hover:bg-[#243247]"
                >
                  <td className="px-5 py-4 font-medium">
                    <Link
                      to={`/leads/${lead.documentId}`}
                      className="font-medium text-blue-600 hover:underline dark:text-[#818CF8]"
                    >
                      {lead.name}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-[#CBD5E1]">
                    {lead.phone}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-[#CBD5E1]">
                    {sourceTranslate[lead.source] || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[lead.leadStatus] ||
                        "bg-gray-100 text-gray-600 dark:bg-[#243247] dark:text-[#CBD5E1]"
                      }`}
                    >
                      {statusTranslate[lead.leadStatus] || "نامشخص"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-500 dark:text-[#94A3B8]">
                    {lead.date || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="relative flex justify-center">
                      <details className="relative group">
                        <summary className="list-none cursor-pointer flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition dark:text-[#94A3B8] dark:hover:bg-[#243247] dark:hover:text-[#818CF8]">
                          <FiMoreVertical size={20} />
                        </summary>

                        <div className="absolute left-0 top-full mt-1 z-20 w-32 p-1 rounded-lg border border-gray-200 bg-white shadow-lg dark:bg-[#172033] dark:border-[#2A3548]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.currentTarget.closest("details").open = false;
                              handleEdit(lead);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition dark:text-[#CBD5E1] dark:hover:bg-[#243247]"
                          >
                            <FaEdit className="text-green-500" />
                            ویرایش
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.currentTarget.closest("details").open = false;
                              handleRemove(lead.documentId);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-red-50 transition dark:text-[#CBD5E1] dark:hover:bg-red-950/40"
                          >
                            <MdDelete className="text-red-500" />
                            حذف
                          </button>
                        </div>
                      </details>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500 dark:text-[#94A3B8]"
                  >
                    {leads.length === 0
                      ? "هنوز سرنخی ثبت نشده است."
                      : "سرنخی با این مشخصات پیدا نشد."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl dark:bg-[#172033] dark:border dark:border-[#2A3548]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-[#2A3548]">
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-[#F1F5F9]">
                  {editingLead ? "ویرایش سرنخ" : "افزودن سرنخ"}
                </h2>

                <p className="text-sm text-gray-500 mt-1 dark:text-[#94A3B8]">
                  اطلاعات مشتری بالقوه را وارد کنید
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition dark:text-[#94A3B8] dark:hover:bg-[#243247]"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#CBD5E1]">
                    نام و نام خانوادگی{" "}
                    <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثلاً علی رضایی"
                    className={inputClass}
                  />

                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#CBD5E1]">
                    شماره تماس <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثلاً 09331234567"
                    className={inputClass}
                  />

                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#CBD5E1]">
                  ایمیل
                </label>

                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="example@gmail.com"
                  className={inputClass}
                />

                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#CBD5E1]">
                  تاریخ <span className="text-red-400">*</span>
                </label>

                <input
                  type="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputClass}
                />

                {formik.touched.date && formik.errors.date && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.date}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#CBD5E1]">
                    منبع سرنخ <span className="text-red-400">*</span>
                  </label>

                  <select
                    name="source"
                    value={formik.values.source}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  >
                    <option value="">انتخاب منبع</option>
                    <option value="instagram">اینستاگرام</option>
                    <option value="website">وب‌سایت</option>
                    <option value="referral">معرفی</option>
                    <option value="advertisement">تبلیغات</option>
                  </select>

                  {formik.touched.source && formik.errors.source && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.source}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#CBD5E1]">
                    وضعیت
                  </label>

                  <select
                    name="leadStatus"
                    value={formik.values.leadStatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  >
                    <option value="new">جدید</option>
                    <option value="following">در حال پیگیری</option>
                    <option value="negotiation">مذاکره</option>
                    <option value="converted" disabled>
                      تبدیل‌شده
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-[#CBD5E1]">
                  توضیحات
                </label>

                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="3"
                  placeholder="توضیحات مربوط به این سرنخ..."
                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none resize-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]"
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#2A3548]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition dark:border-[#2A3548] dark:text-[#CBD5E1] dark:hover:bg-[#243247]"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                  disabled={formik.isSubmitting}
                >
                  {!formik.isSubmitting
                    ? editingLead
                      ? "ذخیره تغییرات"
                      : "ذخیره سرنخ"
                    : "در حال ذخیره..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;