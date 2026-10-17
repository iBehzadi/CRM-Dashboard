import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#0B1120] dark:text-slate-100 dark:placeholder:text-slate-500";

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
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 dark:bg-black/70"
      />

      <div
        dir="rtl"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl dark:border dark:border-[#2A3548] dark:bg-[#172033]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-[#2A3548]">
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-slate-100">
              ثبت فروش جدید
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              اطلاعات فروش را وارد کنید
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-[#243247]"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
          {/* عنوان */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
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
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
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
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                هنوز مشتری‌ای ندارید.{" "}
                <Link
                  to="/customers"
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
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
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
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
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
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
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
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
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              توضیحات
            </label>

            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows="3"
              placeholder="توضیحات مربوط به فروش..."
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3548] dark:bg-[#0B1120] dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-[#2A3548]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-gray-600 transition hover:bg-gray-50 dark:border-[#2A3548] dark:text-slate-300 dark:hover:bg-[#243247]"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-700 disabled:opacity-50"
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
