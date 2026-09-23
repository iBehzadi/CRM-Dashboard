import { useFormik } from "formik";
import * as Yup from "yup";

import { FiPlus, FiSearch, FiMoreVertical, FiX } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";

const statusStyles = {
  new: "bg-blue-50 text-blue-600",
  Following: "bg-yellow-50 text-yellow-600",
  Negotiation: "bg-purple-50 text-purple-600",
};
const statusTranslate = {
  new: "جدید",
  Following: "درحال پیگیری",
  Negotiation: "مذاکره",
};
const sourceTranslate = {
  instagram: "اینستاگرام",
  website: "وبسایت",
  referral: "معرفی",
  advertisement: "تبلیغات",
};
const Leads = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "علی رضایی",
      phone: "09121234567",
      source: "instagram",
      status: "new",
      date: "۱۴۰۵/۶/۲۹",
    },
    {
      id: 2,
      name: "محمد احمدی",
      phone: "09129876543",
      source: "website",
      status: "Following",
      date: "۱۴۰۵/۶/۲۱",
    },
  ]);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const [editingLead, setEditingLead] = useState(null);
  const handleEdit = (lead) => {
    setEditingLead(lead);

    formik.setValues({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      source: lead.source,
      status: lead.status,
      description: lead.description || "",
    });

    setShowModal(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.includes(search) || lead.phone.includes(search);
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesSource =
      sourceFilter === "all" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });
  const handleDelete = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      source: "",
      status: "new",
      description: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("نام و نام خانوادگی الزامی است"),

      phone: Yup.string()
        .matches(/^09\d{9}$/, "شماره تماس معتبر نیست")
        .required("شماره تماس الزامی است"),

      email: Yup.string().email("ایمیل معتبر نیست"),

      source: Yup.string().required("منبع سرنخ را انتخاب کنید"),

      status: Yup.string().required("وضعیت را انتخاب کنید"),
    }),

    onSubmit: (values) => {
      if (editingLead) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === editingLead.id
              ? {
                  ...lead,
                  ...values,
                }
              : lead,
          ),
        );
      } else {
        const newLead = {
          id: Date.now(),
          ...values,
          date: new Date().toLocaleDateString("fa-IR"),
        };
        setLeads((prev) => [newLead, ...prev]);
      }

      formik.resetForm();
      setEditingLead(null);
      setShowModal(false);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">سرنخ‌ها</h1>

          <p className="mt-1 text-sm text-gray-500">
            مدیریت و پیگیری مشتریان بالقوه
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiPlus size={18} />
          افزودن سرنخ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجوی نام یا شماره تماس..."
              className="
                w-full
                h-10
                pr-10
                pl-4
                rounded-lg
                bg-gray-50
                border
                border-gray-200
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              h-10
              px-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              outline-none
            "
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="new">جدید</option>
            <option value="Following">در حال پیگیری</option>
            <option value="Negotiation">مذاکره</option>
          </select>

          {/* Source */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="
              h-10
              px-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              outline-none
            "
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
      <div className="bg-white border border-gray-200 rounded-xl ">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  نام
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  شماره تماس
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  منبع
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  وضعیت
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  تاریخ
                </th>

                <th className="px-5 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {lead.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600">{lead.phone}</td>

                  <td className="px-5 py-4 text-gray-600">
                    {sourceTranslate[lead.source]}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${statusStyles[lead.status]}
                      `}
                    >
                      {statusTranslate[lead.status]}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-500">{lead.date}</td>

                  <td className="px-5 py-4">
                    <button className="group relative text-gray-500 hover:text-blue-600">
                      <FiMoreVertical size={20} />
                      <div className="absolute shadow bg-white invisible h-0 group-hover:visible flex flex-col justify-center text-[12px] rounded w-20 group-hover:h-auto -top-15 py-3 px-2 items-center">
                        <button
                          className="text-black bg-gray-100 w-full py-2 mb-1 flex items-center justify-center gap-1 hover:bg-blue-400 hover:text-white rounded"
                          onClick={() => handleDelete(lead.id)}
                        >
                          <MdDelete className="text-red-500" /> حذف
                        </button>
                        <button
                          className="text-black bg-gray-100 w-full py-2 mb-1 flex items-center justify-center gap-1 hover:bg-blue-400 hover:text-white rounded"
                          onClick={() => handleEdit(lead)}
                        >
                          <FaEdit className="text-green-500"/> ویرایش
                        </button>
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-blue-400">
              <div>
                <h2>{editingLead ? "ویرایش سرنخ" : "افزودن سرنخ"}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  اطلاعات مشتری بالقوه را وارد کنید
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام و نام خانوادگی <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثلاً علی رضایی"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شماره تماس <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثلاً 09331234567"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل
                </label>

                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="example@gmail.com"
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    منبع سرنخ <span className="text-red-400">*</span>
                  </label>

                  <select
                    name="source"
                    value={formik.values.source}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وضعیت
                  </label>

                  <select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">جدید</option>
                    <option value="Following">در حال پیگیری</option>
                    <option value="Negotiation">مذاکره</option>
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
                  placeholder="توضیحات مربوط به این سرنخ..."
                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-blue-400">
                <button
                  onClick={() => {
                    setShowModal(false);
                    formik.resetForm();
                  }}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={formik.isSubmitting}
                >
                  {!formik.isSubmitting
                    ? editingLead
                      ? "ذخیره تغییرات"
                      : "ذخیره سرنخ"
                    : "درحال ذخیره ..."}
                </button>
              </div>
            </form>

            {/* Footer */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
