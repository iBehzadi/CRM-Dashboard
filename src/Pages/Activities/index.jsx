import React, { useEffect, useState } from "react";
import useActivityStore from "../../Store/activityStore";
import { FiPlus, FiX } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import useCustomerStore from "../../Store/customerStore";
import useLeadStore from "../../Store/leadStore";

export default function Activities() {
  const fetchActivities = useActivityStore((state) => state.fetchActivities);
  const activities = useActivityStore((state) => state.activities);
  const addActivity = useActivityStore((state) => state.addActivity);
  const updateActivity = useActivityStore((state) => state.updateActivity);
  const leads = useLeadStore((state) => state.leads);

  const customers = useCustomerStore((state) => state.customers);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [relationFilter, setRelationFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingAct, setEditingAct] = useState(null);

  const inputClass =
    "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]";

  const handleActEdit = (act) => {
    setEditingAct(act);
    formik.setValues({
      title: act.title,
      description: act.description || "",
      date: act.date,
      type: act.type,
      lead: act.lead?.documentId || "",
    });

    setShowModal(true);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "",
      description: "",
      date: "",
      lead: "",
    },

    validationSchema: Yup.object({
      type: Yup.string().required("نوع فعالیت را انتخاب کنید"),
      title: Yup.string().required("عنوان الزامی است"),
      date: Yup.string().required("تاریخ الزامی است"),
      lead: Yup.string().required("سرنخ الزامی است"),
    }),

    onSubmit: async (values) => {
      const payload = {
        ...values,
        lead: values.lead || null,
      };

      try {
        if (editingAct) {
          const res = await updateActivity(editingAct.documentId, payload);

          if (res === null) return;
          closeModal();
        } else {
          const res = await addActivity(payload);

          if (res === null) return;
          closeModal();
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingAct(null);
    formik.resetForm();
  };

  useEffect(() => {
    fetchActivities();
    fetchCustomers();
  }, []);

  const activityTypes = [
    { value: "call", label: "تماس تلفنی" },
    { value: "text", label: "پیام" },
    { value: "email", label: "ایمیل" },
    { value: "meet", label: "جلسه" },
    { value: "note", label: "یادداشت" },
    { value: "following", label: "پیگیری" },
  ];

  const typeStyles = {
    call: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
    text: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300",
    email:
      "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
    meet: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
    note: "bg-gray-100 text-gray-600 dark:bg-[#243247] dark:text-[#CBD5E1]",
    following:
      "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300",
  };

  const filteredActivities = activities.filter((act) => {
    const matchesSearch = (act.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || act.type === typeFilter;

    const matchesRelation =
      relationFilter === "all"
        ? true
        : relationFilter === "lead"
          ? !!act.lead && !act.customer
          : relationFilter === "customer"
            ? !!act.customer && !act.lead
            : !act.lead && !act.customer;

    return matchesSearch && matchesType && matchesRelation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-[#F1F5F9]">
            فعالیت‌ها
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-[#94A3B8]">
            مدیریت فعالیت‌های فروش و تعاملات با مشتریان
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          <FiPlus size={18} />
          ثبت فعالیت جدید
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm dark:bg-[#172033] dark:border-[#2A3548]">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#CBD5E1] mb-2">
              جستجو
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در فعالیت‌ها..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#CBD5E1] mb-2">
              نوع فعالیت
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={inputClass}
            >
              <option value="all">همه</option>
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-[#2A3548]">
          <span className="text-sm text-gray-500 dark:text-[#94A3B8]">
            تعداد فعالیت‌ها: {filteredActivities.length}
          </span>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setTypeFilter("all");
              setRelationFilter("all");
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-[#818CF8] dark:hover:text-indigo-300"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-[#172033] dark:border-[#2A3548]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-right">
            <thead>
              <tr className="bg-gray-50/80 text-gray-700 text-sm border-b border-gray-200 dark:bg-[#111827] dark:text-[#F1F5F9] dark:border-[#2A3548]">
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">عنوان</th>
                <th className="px-5 py-4 font-semibold">نوع فعالیت</th>
                <th className="px-5 py-4 font-semibold">مرتبط با</th>
                <th className="px-5 py-4 font-semibold">تاریخ</th>
                <th className="px-5 py-4 font-semibold">توضیحات</th>
                <th className="px-5 py-4 font-semibold">اقدامات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#2A3548]">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act, index) => (
                  <tr
                    key={act.documentId || act.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-[#243247] transition-colors"
                  >
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-[#94A3B8]">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-800 dark:text-[#F1F5F9]">
                        {act.title}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                          typeStyles[act.type] ||
                          "bg-gray-100 text-gray-600 dark:bg-[#243247] dark:text-[#CBD5E1]"
                        }`}
                      >
                        {activityTypes.find((type) => type.value === act.type)
                          ?.label || act.type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-[#CBD5E1]">
                      {act.lead ? (
                        <span>سرنخ: {act.lead.name}</span>
                      ) : act.customer ? (
                        <span>مشتری: {act.customer.name}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-[#64748B]">
                          عمومی
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-[#CBD5E1] whitespace-nowrap">
                      {act.date || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-[#94A3B8] max-w-xs">
                      <p className="truncate">{act.description || "—"}</p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleActEdit(act)}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition text-sm dark:border-[#2A3548] dark:text-[#CBD5E1] dark:hover:bg-[#243247]"
                        >
                          ویرایش
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-500 dark:text-[#94A3B8]"
                  >
                    فعالیتی با این مشخصات پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 dark:border-[#2A3548]">
          <span className="text-sm text-gray-500 dark:text-[#94A3B8]">
            نمایش {filteredActivities.length} فعالیت
          </span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div onClick={closeModal} className="absolute inset-0 bg-black/40" />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl dark:bg-[#172033]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-blue-400 dark:border-[#2A3548]">
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-[#F1F5F9]">
                  {editingAct ? "ویرایش فعالیت" : "افزودن فعالیت"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-[#94A3B8] mt-1">
                  فعالیت های مرتبط با مشتری را وارد کنید
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-[#94A3B8] dark:hover:bg-[#243247]"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#CBD5E1] mb-2">
                    عنوان فعالیت <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثلاً تماس مجدد"
                    className={inputClass}
                  />

                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#CBD5E1] mb-2">
                    نوع فعالیت <span className="text-red-400">*</span>
                  </label>

                  <select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  >
                    <option value="">-</option>
                    <option value="call">تماس تلفنی</option>
                    <option value="text">پیام</option>
                    <option value="email">ایمیل</option>
                    <option value="meet">جلسه</option>
                    <option value="note">یادداشت</option>
                    <option value="following">پیگیری</option>
                  </select>

                  {formik.touched.type && formik.errors.type && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#CBD5E1] mb-2">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#CBD5E1] mb-2">
                    سرنخ مرتبط
                  </label>

                  <select
                    name="lead"
                    value={formik.values.lead}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  >
                    <option value="">بدون سرنخ</option>
                    {leads.map((lead) => (
                      <option key={lead.documentId} value={lead.documentId}>
                        {lead.name}
                      </option>
                    ))}
                  </select>

                  {formik.touched.lead && formik.errors.lead && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.lead}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#CBD5E1] mb-2">
                  توضیحات
                </label>

                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="3"
                  placeholder="توضیحات مربوط به این فعالیت ..."
                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none resize-none focus:ring-2 focus:ring-blue-500 dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]"
                />
              </div>

              <div className="flex justify-end gap-3 p-5 border-t border-blue-400 dark:border-[#2A3548]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-[#2A3548] dark:text-[#CBD5E1] dark:hover:bg-[#243247]"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={formik.isSubmitting}
                >
                  {!formik.isSubmitting
                    ? editingAct
                      ? "ذخیره تغییرات"
                      : "ذخیره فعالیت"
                    : "درحال ذخیره ..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
