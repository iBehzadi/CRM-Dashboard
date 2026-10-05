import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiX, FiUsers } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";
import useCustomerStore from "../../Store/customerStore";

const sourceTranslate = {
  instagram: "اینستاگرام",
  website: "وب‌سایت",
  referral: "معرفی",
  advertisement: "تبلیغات",
};

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("fa-IR") : "-";

const Customers = () => {
  const customers = useCustomerStore((state) => state.customers);
  const loading = useCustomerStore((state) => state.loading);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);
  const createCustomer = useCustomerStore((state) => state.createCustomer);
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);
  const removeCustomer = useCustomerStore((state) => state.removeCustomer);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      source: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("نام و نام خانوادگی الزامی است"),
      phone: Yup.string().trim().required("شماره تماس الزامی است"),
      email: Yup.string().email("ایمیل معتبر نیست"),
      source: Yup.string().required("منبع را انتخاب کنید"),
    }),
    onSubmit: async (values) => {
      try {
        if (editingCustomer) {
          await updateCustomer(editingCustomer.documentId, values);
        } else {
          const created = await createCustomer(values);
         
          if (!created) return;
        }
        closeModal();
      } catch {
        
      }
    },
  });

  
  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
    formik.resetForm();
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    formik.setValues({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      source: customer.source || "",
      description: customer.description || "",
    });
    setShowModal(true);
  };

  const handleRemove = (customer) => {
    if (!window.confirm(`مشتری «${customer.name}» حذف شود؟`)) return;
    removeCustomer(customer.documentId).catch(() => {});
  };

  const filteredCustomers = customers.filter((c) => {
    const q = search.trim();
    const matchesSearch =
      !q ||
      (c.name || "").includes(q) ||
      (c.phone || "").includes(q) ||
      (c.email || "").includes(q);
    const matchesSource = sourceFilter === "all" || c.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مشتریان</h1>
          <p className="mt-1 text-sm text-gray-500">
            مدیریت اطلاعات مشتریان شما
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <FiPlus size={18} />
          افزودن مشتری
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
              placeholder="جستجوی نام، شماره تماس یا ایمیل..."
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none"
          >
            <option value="all">همه منابع</option>
            {Object.entries(sourceTranslate).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["نام", "شماره تماس", "ایمیل", "منبع", "تاریخ ثبت", ""].map(
                  (title, i) => (
                    <th
                      key={i}
                      className="px-5 py-4 text-right text-sm font-medium text-gray-500"
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
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                    در حال بارگذاری...
                  </td>
                </tr>
              )}

              {!loading && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <FiUsers className="mx-auto text-gray-300" size={32} />
                    <p className="mt-3 text-gray-600">
                      {customers.length === 0
                        ? "هنوز مشتری‌ای ثبت نشده است"
                        : "مشتری‌ای با این فیلترها پیدا نشد"}
                    </p>
                    {customers.length === 0 && (
                      <p className="mt-1 text-sm text-gray-400">
                        مشتری جدید اضافه کنید یا یک سرنخ را به مشتری تبدیل کنید.
                      </p>
                    )}
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.documentId}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{customer.name}</p>
                      {customer.lead && (
                        <Link
                          to={`/leads/${customer.lead.documentId}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          مشاهده سرنخ اولیه
                        </Link>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{customer.phone}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {customer.email || "-"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {sourceTranslate[customer.source] || "-"}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="ویرایش"
                          onClick={() => handleEdit(customer)}
                          className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition"
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          type="button"
                          title="حذف"
                          onClick={() => handleRemove(customer)}
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

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-blue-400">
              <div>
                <h2>{editingCustomer ? "ویرایش مشتری" : "افزودن مشتری"}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  اطلاعات مشتری را وارد کنید
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
                    className={inputClass}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
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
                    className={inputClass}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className={inputClass}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    منبع <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="source"
                    value={formik.values.source}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  >
                    <option value="">انتخاب منبع</option>
                    {Object.entries(sourceTranslate).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.source && formik.errors.source && (
                    <p className="mt-1 text-xs text-red-500">{formik.errors.source}</p>
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
                  placeholder="توضیحات مربوط به این مشتری..."
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
                    : editingCustomer
                      ? "ذخیره تغییرات"
                      : "ذخیره مشتری"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;