import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500";

const SaleFormModal = ({ customers, onClose, onCreate }) => {
  const toman = (n) => `${Number(n || 0).toLocaleString("fa-IR")} تومان`;

  const formik = useFormik({
    initialValues: {
      title: "",
      amount: "",
      customer: "",
      closedAt: new Date().toLocaleDateString("en-CA"),
      description: "",
    },

    validationSchema: Yup.object({
      title: Yup.string().trim().required("عنوان فروش الزامی است"),

      amount: Yup.number()
        .typeError("مبلغ را به عدد وارد کنید")
        .integer("مبلغ باید عدد صحیح باشد")
        .moreThan(0, "مبلغ باید بیشتر از صفر باشد")
        .required("مبلغ الزامی است"),

      customer: Yup.string().required("مشتری را انتخاب کنید"),

      closedAt: Yup.string().required("تاریخ فروش الزامی است"),
    }),

    onSubmit: async (values) => {
      const payload = {
        title: values.title.trim(),
        amount: Number(values.amount),
        customer: values.customer,
        closedAt: values.closedAt,
        description: values.description,
        stage: "won",
      };

      try {
        await onCreate(payload);
        onClose();
      } catch {
        // خطا توسط fetchData/store نمایش داده می‌شود.
        // در صورت خطا، مودال باز می‌ماند.
      }
    },
  });

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div
        dir="rtl"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-blue-400">
          <div>
            <h2 className="font-semibold text-gray-800">ثبت فروش جدید</h2>

            <p className="text-sm text-gray-500 mt-1">
              اطلاعات فروش را وارد کنید
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
          {/* عنوان */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان فروش <span className="text-red-400">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="مثلاً فروش پکیج سالانه"
              className={inputClass}
            />

            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.title}</p>
            )}
          </div>

          {/* مشتری */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مشتری <span className="text-red-400">*</span>
            </label>

            <select
              name="customer"
              value={formik.values.customer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            >
              <option value="">انتخاب مشتری</option>

              {customers.map((customer) => (
                <option key={customer.documentId} value={customer.documentId}>
                  {customer.name}
                </option>
              ))}
            </select>

            {customers.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                هنوز مشتری‌ای ندارید.{" "}
                <Link to="/customers" className="text-blue-600 hover:underline">
                  ابتدا یک مشتری ثبت کنید
                </Link>
              </p>
            )}

            {formik.touched.customer && formik.errors.customer && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.customer}
              </p>
            )}
          </div>

          {/* مبلغ و تاریخ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مبلغ فروش (تومان) <span className="text-red-400">*</span>
              </label>

              <input
                type="number"
                min="1"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="مثلاً 12500000"
                className={inputClass}
              />

              {formik.values.amount !== "" && !formik.errors.amount && (
                <p className="mt-1 text-xs text-gray-500">
                  {toman(formik.values.amount)}
                </p>
              )}

              {formik.touched.amount && formik.errors.amount && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاریخ فروش
              </label>

              <input
                type="date"
                name="closedAt"
                value={formik.values.closedAt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
              />

              {formik.touched.closedAt && formik.errors.closedAt && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.closedAt}
                </p>
              )}
            </div>
          </div>

          {/* توضیحات */}
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
              placeholder="توضیحات مربوط به فروش..."
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-blue-400">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {formik.isSubmitting ? "در حال ثبت..." : "ثبت فروش"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleFormModal;
