import { useFormik } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiPhone, FiMail, FiUser } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import useLeadStore from "../../../Store/leadStore";
import useActivityStore from "../../../Store/activityStore";
import { useEffect, useState } from "react";
import useCustomerStore from "../../../Store/customerStore";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const convertLead = useCustomerStore((state) => state.convertLead);
  const [converting, setConverting] = useState(false);
  const leads = useLeadStore((state) => state.leads);
  const activities = useActivityStore((state) => state.activities);
  const addActivity = useActivityStore((state) => state.addActivity);
  const updateActivity = useActivityStore((state) => state.updateActivity);
  const removeActivity = useActivityStore((state) => state.removeActivity);
  const fetchActivities = useActivityStore((state) => state.fetchActivities);
  const fetchLeads = useLeadStore((state) => state.fetchLeads);

  const leadActivities = activities.filter(
    (activity) => activity.lead?.documentId === id,
  );
  const [showModal, setShowModal] = useState(false);
  const [editingAct, setEditingAct] = useState(null);

  const statusTranslate = {
    new: "جدید",
    following: "درحال پیگیری",
    negotiation: "مذاکره",
    converted: "تبدیل‌شده",
  };

  const typeTranslate = {
    call: "تماس تلفنی",
    text: "پیام",
    email: "ایمیل",
    meet: "جلسه",
    note: "یادداشت",
    following: "پیگیری",
  };

  const statusStyles = {
    new: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    following:
      "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
    negotiation:
      "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
    converted:
      "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  };

  const lead = leads.find((item) => item.documentId === id);

  const handleActEdit = (act) => {
    setEditingAct(act);
    formik.setValues({
      title: act.title,
      description: act.description || "",
      date: act.date,
      type: act.type,
    });

    setShowModal(true);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "",
      description: "",
      date: "",
      lead: id,
    },

    validationSchema: Yup.object({
      type: Yup.string().required("نوع فعالیت را انتخاب کنید"),
      title: Yup.string().required("عنوان الزامی است"),
      date: Yup.string().required("تاریخ الزامی است"),
    }),

    onSubmit: async (values) => {
      try {
        if (editingAct) {
          await updateActivity(editingAct.documentId, values);
        } else {
          await addActivity({ ...values, lead: id });
        }
        closeModal();
      } catch {}
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingAct(null);
    formik.resetForm();
  };

  const handleActRemove = (documentId) => {
    removeActivity(documentId).catch(() => {});
  };

  const handleConvert = async () => {
    if (!window.confirm(`«${lead.name}» به مشتری تبدیل شود؟`)) return;
    setConverting(true);

    try {
      const customer = await convertLead(lead);
      if (!customer) return;
      await fetchLeads();
      navigate("/customers");
    } catch (error) {
      console.error("خطا در تبدیل سرنخ به مشتری:", error);
    } finally {
      setConverting(false);
    }
  };

  useEffect(() => {
    if (leads.length === 0) fetchLeads();
    fetchActivities();
  }, []);

  if (!lead) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">
          سرنخ پیدا نشد
        </h1>

        <Link
          to="/leads"
          className="inline-block mt-4 text-blue-600 hover:text-blue-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          بازگشت به سرنخ‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/leads"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors dark:border-[#2A3548] dark:text-slate-300 dark:hover:bg-[#243247]"
        >
          <FiArrowRight size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            {lead.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            جزئیات سرنخ
          </p>
        </div>
      </div>

      {/* اطلاعات اصلی */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 dark:bg-[#172033] dark:border-[#2A3548]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              <FiUser size={22} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800 dark:text-slate-100">
                {lead.name}
              </h2>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
                  statusStyles[lead.leadStatus]
                }`}
              >
                {statusTranslate[lead.leadStatus]}
              </span>
            </div>

            {lead.leadStatus !== "converted" && (
              <button
                type="button"
                onClick={handleConvert}
                disabled={converting}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {converting ? "در حال تبدیل ..." : "تبدیل به مشتری"}
              </button>
            )}
          </div>
        </div>

        {/* اطلاعات تماس */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0B1120]">
            <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-slate-400">
              <FiPhone />
              شماره تماس
            </div>

            <p className="mt-2 font-medium text-gray-800 dark:text-slate-100">
              {lead.phone}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0B1120]">
            <div className="flex items-center gap-2 text-gray-500 text-sm dark:text-slate-400">
              <FiMail />
              ایمیل
            </div>

            <p className="mt-2 font-medium text-gray-800 dark:text-slate-100">
              {lead.email || "ثبت نشده"}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0B1120]">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              منبع سرنخ
            </p>

            <p className="mt-2 font-medium text-gray-800 dark:text-slate-100">
              {lead.source}
            </p>
          </div>
        </div>
      </div>

      {/* توضیحات */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 dark:bg-[#172033] dark:border-[#2A3548]">
        <h2 className="font-bold text-gray-800 mb-4 dark:text-slate-100">
          توضیحات
        </h2>

        <p className="text-gray-600 leading-7 dark:text-slate-300">
          {lead.description || "توضیحی ثبت نشده است."}
        </p>
      </div>

      {/* فعالیت‌ها */}
      <div className="p-5 bg-white rounded-xl border border-gray-200 dark:bg-[#172033] dark:border-[#2A3548]">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h2 className="font-bold text-gray-800 dark:text-slate-100">
            فعالیت‌ها
          </h2>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={() => setShowModal(true)}
          >
            + ثبت فعالیت
          </button>
        </div>

        <div className="space-y-3">
          {leadActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 rounded-lg bg-gray-50 border border-transparent transition-colors dark:bg-[#0B1120] dark:border-[#2A3548]"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-medium text-gray-800 dark:text-slate-100">
                  {activity.title}
                </h3>

                <span className="text-xs text-gray-500 dark:text-slate-400">
                  {activity.date}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                {activity.description}
              </p>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="inline-block mt-3 text-xs text-blue-600 dark:text-indigo-400">
                  {typeTranslate[activity.type]}
                </span>

                <div className="flex items-center gap-2">
                  {/* Edit */}
                  <button
                    type="button"
                    title="ویرایش"
                    onClick={() => handleActEdit(activity)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 dark:hover:bg-indigo-600 dark:hover:text-white dark:hover:shadow-none"
                  >
                    <FaEdit size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    title="حذف"
                    onClick={() => handleActRemove(activity.documentId)}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-200 transition-all duration-200 active:scale-95 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-600 dark:hover:text-white dark:hover:shadow-none"
                  >
                    <FaTrash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 dark:bg-black/70"
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl dark:bg-[#172033] dark:border dark:border-[#2A3548]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-[#2A3548]">
              <div>
                <h2 className="font-bold text-gray-800 dark:text-slate-100">
                  {editingAct ? "ویرایش فعالیت" : "افزودن فعالیت"}
                </h2>

                <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
                  فعالیت‌های مرتبط با سرنخ را وارد کنید
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-[#243247]"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                    عنوان فعالیت <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثلاً تماس مجدد"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#0B1120] dark:text-slate-100 dark:placeholder:text-slate-500"
                  />

                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                    نوع فعالیت <span className="text-red-400">*</span>
                  </label>

                  <select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#0B1120] dark:text-slate-100"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                    تاریخ <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#0B1120] dark:text-slate-100"
                  />

                  {formik.touched.date && formik.errors.date && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.date}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                  توضیحات
                </label>

                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows="3"
                  placeholder="توضیحات مربوط به این فعالیت ..."
                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none resize-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#0B1120] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex justify-end gap-3 p-5 border-t border-gray-200 dark:border-[#2A3548]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors dark:border-[#2A3548] dark:text-slate-300 dark:hover:bg-[#243247]"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
};

export default LeadDetails;
