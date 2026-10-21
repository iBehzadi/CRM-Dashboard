import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiEye, FiEyeOff, FiLogOut, FiMail, FiUser, FiCalendar } from "react-icons/fi";
import useAuthStore from "../../Store/authStore";
import fetchData from "../../Utils/fetchData";
import notify from "../../Utils/notify";

const focusClass =
  "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-[#6366F1]/25 dark:focus:border-[#818CF8]";

const inputClass = `w-full h-11 px-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 outline-none transition dark:border-[#2A3548] dark:bg-[#111827] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] ${focusClass}`;

const labelClass =
  "block text-sm font-medium text-slate-700 mb-2 dark:text-[#CBD5E1]";

const errorClass = "mt-1 text-xs text-red-500 dark:text-red-400";

const cardClass =
  "bg-white border border-slate-200 rounded-xl shadow-sm dark:bg-[#172033] dark:border-[#2A3548] dark:shadow-none";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fa-IR") : "-");

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-500/10 dark:text-[#818CF8]">
      <Icon size={17} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-500 dark:text-[#94A3B8]">{label}</p>
      <p className="text-sm font-medium text-slate-800 truncate dark:text-[#F1F5F9]" dir="ltr" style={{ textAlign: "right" }}>
        {value || "-"}
      </p>
    </div>
  </div>
);

const PasswordField = ({ id, label, formik }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={id === "currentPassword" ? "current-password" : "new-password"}
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          dir="ltr"
          className={`${inputClass} pl-11`}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "پنهان کردن رمز" : "نمایش رمز"}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition dark:text-[#64748B] dark:hover:text-white dark:hover:bg-[#243247]"
        >
          {visible ? <FiEyeOff size={17} /> : <FiEye size={17} />}
        </button>
      </div>

      {formik.touched[id] && formik.errors[id] && (
        <p className={errorClass}>{formik.errors[id]}</p>
      )}
    </div>
  );
};

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("رمز عبور فعلی الزامی است"),
      password: Yup.string()
        .min(6, "رمز عبور جدید حداقل ۶ کاراکتر باشد")
        .notOneOf([Yup.ref("currentPassword")], "رمز جدید با رمز فعلی یکسان است")
        .required("رمز عبور جدید الزامی است"),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password")], "تکرار رمز با رمز جدید یکسان نیست")
        .required("تکرار رمز عبور الزامی است"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const data = await fetchData("auth/change-password", {
          method: "POST",
          body: JSON.stringify(values),
        });

        // Strapi بعد از تغییر رمز یک JWT جدید برمی‌گرداند
        if (data?.jwt) {
          login({ jwt: data.jwt, user: data.user || user });
        }

        notify("success", "رمز عبور با موفقیت تغییر کرد");
        resetForm();
      } catch (error) {
        notify("error", error.message || "تغییر رمز عبور انجام نشد");
      }
    },
  });

  const handleLogout = () => {
    if (window.confirm("از حساب کاربری خارج می‌شوید؟")) logout();
  };

  const initial = (user?.username || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-6 text-slate-800 dark:text-[#F1F5F9]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F1F5F9]">
          پروفایل
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">
          اطلاعات حساب و امنیت
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account info */}
        <div className={`${cardClass} p-6 lg:col-span-1 h-fit`}>
          <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100 dark:border-[#2A3548]">
            <div
              aria-hidden="true"
              className="w-20 h-20 rounded-full bg-indigo-600 text-white text-3xl font-bold flex items-center justify-center dark:bg-indigo-500"
            >
              {initial}
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-[#F1F5F9]">
              {user?.username || "کاربر"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-[#94A3B8]" dir="ltr">
              {user?.email}
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <InfoRow icon={FiUser} label="نام کاربری" value={user?.username} />
            <InfoRow icon={FiMail} label="ایمیل" value={user?.email} />
            <InfoRow
              icon={FiCalendar}
              label="تاریخ عضویت"
              value={formatDate(user?.createdAt)}
            />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20 dark:hover:bg-red-500 dark:hover:text-white"
          >
            <FiLogOut size={17} />
            خروج از حساب
          </button>
        </div>

        {/* Change password */}
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="p-5 border-b border-slate-100 dark:border-[#2A3548]">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F1F5F9]">
              تغییر رمز عبور
            </h2>
            <p className="text-sm text-slate-500 mt-1 dark:text-[#94A3B8]">
              برای امنیت بیشتر از رمز عبور قوی و منحصر‌به‌فرد استفاده کنید
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-5 space-y-4 max-w-lg">
            <PasswordField id="currentPassword" label="رمز عبور فعلی" formik={formik} />
            <PasswordField id="password" label="رمز عبور جدید" formik={formik} />
            <PasswordField
              id="passwordConfirmation"
              label="تکرار رمز عبور جدید"
              formik={formik}
            />

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-[#2A3548]">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {formik.isSubmitting ? "در حال ذخیره ..." : "تغییر رمز عبور"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}