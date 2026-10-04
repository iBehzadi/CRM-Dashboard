import { useFormik } from "formik";
import * as Yup from "yup";
import { FiX } from "react-icons/fi";
import { useParams, Link } from "react-router-dom";
import { FiArrowRight, FiPhone, FiMail, FiUser } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import useLeadStore from "../../../Store/leadStore";
import useActivityStore from "../../../Store/activityStore";
import { useEffect, useState } from "react";

const LeadDetails = () => {
  const { id } = useParams();
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
    new: "bg-blue-50 text-blue-600",
    following: "bg-yellow-50 text-yellow-600",
    negotiation: "bg-purple-50 text-purple-600",
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
      } catch {
        
      }
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

  useEffect(() => {
    if (leads.length === 0) fetchLeads();
    fetchActivities();
  }, []);
  if (!lead) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold text-gray-800">سرنخ پیدا نشد</h1>

        <Link
          to="/leads"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          بازگشت به سرنخ‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/leads"
          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          <FiArrowRight size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lead.name}</h1>

          <p className="text-sm text-gray-500 mt-1">جزئیات سرنخ</p>
        </div>
      </div>

      {/* اطلاعات اصلی */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUser size={22} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">{lead.name}</h2>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
                  statusStyles[lead.leadStatus]
                }`}
              >
                {statusTranslate[lead.leadStatus]}
              </span>
            </div>
          </div>
        </div>

        {/* اطلاعات تماس */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiPhone />
              شماره تماس
            </div>

            <p className="mt-2 font-medium text-gray-800">{lead.phone}</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiMail />
              ایمیل
            </div>

            <p className="mt-2 font-medium text-gray-800">
              {lead.email || "ثبت نشده"}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">منبع سرنخ</p>

            <p className="mt-2 font-medium text-gray-800">{lead.source}</p>
          </div>
        </div>
      </div>

      {/* توضیحات */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-800 mb-4">توضیحات</h2>

        <p className="text-gray-600 leading-7">
          {lead.description || "توضیحی ثبت نشده است."}
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800">فعالیت‌ها</h2>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setShowModal(true)}
          >
            + ثبت فعالیت
          </button>
        </div>

        <div className="space-y-3">
          {leadActivities.map((activity) => (
            <div key={activity.id} className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">{activity.title}</h3>

                <span className="text-xs text-gray-500">{activity.date}</span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                {activity.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="inline-block mt-3 text-xs text-blue-600">
                  {typeTranslate[activity.type]}
                </span>
                <div className="flex items-center gap-2">
                  {/* Edit */}
                  <button
                    type="button"
                    title="ویرایش"
                    onClick={() => handleActEdit(activity)}
                    className=" flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95 "
                  >
                    <FaEdit size={15} />
                  </button>
                  {/* Delete */}
                  <button
                    type="button"
                    title="حذف"
                    onClick={() => handleActRemove(activity.documentId)}
                    className=" flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-200 transition-all duration-200 active:scale-95 "
                  >
                    <FaTrash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-blue-400">
              <div>
                <h2>{editingAct ? "ویرایش فعالیت" : "افزودن فعالیت"}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  فعالیت های مرتبط با مشتری را وارد کنید
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

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان فعالیت <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="مثلاً تماس مجدد "
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع فعالیت <span className="text-red-400">*</span>
                  </label>

                  <select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ <span className="text-red-400">*</span>
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {formik.touched.date && formik.errors.date && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.date}
                    </p>
                  )}
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
                  placeholder="توضیحات مربوط به این فعالیت ..."
                  className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-blue-400">
                <button
                  type="button"
                  onClick={closeModal}
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
