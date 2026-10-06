import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

const stages = [
  { key: "proposal", label: "پیشنهاد" },
  { key: "negotiation", label: "مذاکره" },
  { key: "won", label: "موفق" },
  { key: "lost", label: "ناموفق" },
];

const inputClass =
  "w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500";

const DealFormModal = ({
  deal,
  customers,
  onClose,
  onCreate,
  onUpdate,
  stageChanges,
}) => {
  const editingDeal = Boolean(deal);

  const toman = (n) =>
    `${Number(n || 0).toLocaleString("fa-IR")} تومان`;

  const formik = useFormik({
    initialValues: {
      title: deal?.title || "",
      amount: deal?.amount != null ? String(deal.amount) : "",
      stage: deal?.stage || "proposal",
      customer: deal?.customer?.documentId || "",
      expectedCloseDate: deal?.expectedCloseDate || "",
      description: deal?.description || "",
      lostReason: deal?.lostReason || "",
    },
    enableReinitialize: true,

    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .required("عنوان معامله الزامی است"),

      amount: Yup.number()
        .typeError("مبلغ را به عدد وارد کنید")
        .integer("مبلغ باید عدد صحیح باشد")
        .min(0, "مبلغ نمی‌تواند منفی باشد")
        .required("مبلغ الزامی است"),

      stage: Yup.string().required("مرحله را انتخاب کنید"),

      customer: Yup.string().required("مشتری را انتخاب کنید"),
    }),

    onSubmit: async (values) => {
      const payload = {
        title: values.title.trim(),
        amount: Number(values.amount),
        customer: values.customer,
        expectedCloseDate: values.expectedCloseDate || null,
        description: values.description,
      };

      const stageChanged =
        !deal || deal.stage !== values.stage;

      if (stageChanged) {
        Object.assign(
          payload,
          stageChanges(values.stage, values.lostReason),
        );
      } else {
        payload.stage = values.stage;
        payload.lostReason =
          values.stage === "lost" ? values.lostReason : "";
      }

      try {
        if (deal) {
          await onUpdate(deal.documentId, payload);
        } else {
          await onCreate(payload);
        }

        onClose();
      } catch {
        // خطا توسط fetchData/store نمایش داده می‌شود.
        // Modal باز می‌ماند تا اطلاعات کاربر از بین نرود.
      }
    },
  });

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative w-full max-w-lg max-h-full overflow-y-auto bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-blue-400">
          <div>
            <h2>
              {editingDeal ? "ویرایش معامله" : "افزودن معامله"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              اطلاعات معامله را وارد کنید
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

        <form
          onSubmit={formik.handleSubmit}
          className="p-5 space-y-4"
        >
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
              placeholder="مثلاً پکیج سالانه شرکت آریا"
              className={inputClass}
            />

            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.title}
              </p>
            )}
          </div>

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
                <option
                  key={customer.documentId}
                  value={customer.documentId}
                >
                  {customer.name}
                </option>
              ))}
            </select>

            {customers.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">
                هنوز مشتری‌ای ندارید.{" "}
                <Link
                  to="/customers"
                  className="text-blue-600 hover:underline"
                >
                  ابتدا یک مشتری ثبت کنید
                </Link>
              </p>
            )}

            {formik.touched.customer &&
              formik.errors.customer && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.customer}
                </p>
              )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مبلغ (تومان){" "}
                <span className="text-red-400">*</span>
              </label>

              <input
                type="number"
                min="0"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="مثلاً 12500000"
                className={inputClass}
              />

              {formik.values.amount !== "" &&
                !formik.errors.amount && (
                  <p className="mt-1 text-xs text-gray-500">
                    {toman(formik.values.amount)}
                  </p>
                )}

              {formik.touched.amount &&
                formik.errors.amount && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.amount}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مرحله
              </label>

              <select
                name="stage"
                value={formik.values.stage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
              >
                {stages.map((stage) => (
                  <option key={stage.key} value={stage.key}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ پیش‌بینی بسته شدن
            </label>

            <input
              type="date"
              name="expectedCloseDate"
              value={formik.values.expectedCloseDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            />
          </div>

          {formik.values.stage === "lost" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دلیل ناموفق بودن
              </label>

              <input
                type="text"
                name="lostReason"
                value={formik.values.lostReason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="مثلاً قیمت بالا بود"
                className={inputClass}
              />
            </div>
          )}

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
              placeholder="توضیحات معامله..."
              className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              {formik.isSubmitting
                ? "در حال ذخیره ..."
                : editingDeal
                  ? "ذخیره تغییرات"
                  : "ذخیره معامله"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealFormModal;
