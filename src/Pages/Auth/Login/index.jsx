
import React, { useState } from "react";
import {
  FiMail,
  FiLock,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import useAuthStore from "../../../Store/authStore";
import { useNavigate } from "react-router-dom";

export default function Login({ handlePage }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().required('ایمیل الزامی').email("ایمیل معتبر نیست"),
      password: Yup.string().required("لطفا پسورد را وارد کنید"),
    }),

    onSubmit: async () => {
      try {
        const data = await fetchData("auth/local", {
          method: "POST",
          body: JSON.stringify({
            identifier: formik.values.email,
            password: formik.values.password,
          }),
          skipAuth: true,
        });

        if (data.jwt) {
          const authData = {
            jwt: data.jwt,
            user: data.user,
          };

          localStorage.setItem("auth", JSON.stringify(authData));
          login(authData);
          navigate("/");
          notify("success", "ورود موفق");
        }
      } catch (error) {
        error.message === "Invalid identifier or password"
          ? notify("error", "ایمیل یا رمز عبور اشتباه")
          : notify("error", error.message);
      }
    },
  });

  const inputWrapperClass =
    "relative flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-[#2A3548] dark:bg-[#111827] dark:focus-within:border-[#818CF8] dark:focus-within:bg-[#111827] dark:focus-within:ring-[#6366F1]/15";

  const inputClass =
    "w-full bg-transparent py-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]";

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-[#0B1120]"
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/70 md:grid-cols-2 dark:bg-[#172033] dark:shadow-black/20">
        {/* فرم ورود */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 md:py-14">
          <div className="mb-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-950/40">
              <span className="text-2xl font-black">C</span>
            </div>

            <h1 className="mb-3 text-3xl font-extrabold text-slate-800 dark:text-[#F1F5F9]">
              خوش برگشتی!
            </h1>

            <p className="text-sm leading-7 text-slate-500 dark:text-[#94A3B8]">
              برای ورود به پنل کارشناسی، اطلاعات حساب کاربری خودت رو وارد کن.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* ایمیل */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#CBD5E1]"
              >
                ایمیل
              </label>

              <div className={inputWrapperClass}>
                <FiMail className="shrink-0 text-lg text-slate-400 dark:text-[#64748B]" />

                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="ایمیل یا نام کاربری"
                  autoComplete="username"
                  className={inputClass}
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* رمز عبور */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-[#CBD5E1]"
              >
                رمز عبور
              </label>

              <div className={inputWrapperClass}>
                <FiLock className="shrink-0 text-lg text-slate-400 dark:text-[#64748B]" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="رمز عبور"
                  autoComplete="current-password"
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                  className="shrink-0 text-lg text-slate-400 transition hover:text-blue-600 dark:text-[#94A3B8] dark:hover:text-[#818CF8]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* گزینه‌ها */}
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-[#CBD5E1]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-blue-600"
                />
                مرا به خاطر بسپار
              </label>

              <button
                type="button"
                className="font-semibold text-blue-600 transition hover:text-blue-800 dark:text-[#818CF8] dark:hover:text-indigo-300"
              >
                فراموشی رمز؟
              </button>
            </div>

            {/* دکمه ورود */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] dark:shadow-blue-950/40"
            >
              ورود به حساب
              <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-[#64748B]">
            ورود امن به پنل مدیریت ارتباط با مشتریان
          </p>
        </div>

        {/* بخش معرفی CRM */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-indigo-800 p-10 text-white md:flex lg:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl font-black">
                C
              </div>

              <span className="text-lg font-bold tracking-wide">
                CRM PANEL
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-relaxed lg:text-4xl">
              ارتباط بهتر،
              <br />
              فروش بیشتر.
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-8 text-blue-100">
              مشتریانت رو مدیریت کن، فرصت‌های فروش رو دنبال کن و با یک نگاه
              عملکردت رو بررسی کن.
            </p>
          </div>

          <div className="relative z-10 my-10 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-md">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">داشبورد کارشناسی</p>
                <p className="mt-1 font-bold">مدیریت هوشمند مشتریان</p>
              </div>

              <div className="rounded-xl bg-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-200">
                آنلاین
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-blue-100">مشتریان</p>
                <p className="mt-2 text-2xl font-bold">۱۲۸</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-blue-100">سرنخ‌ها</p>
                <p className="mt-2 text-2xl font-bold">۴۶</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-blue-100">فعالیت‌ها</p>
                <p className="mt-2 text-2xl font-bold">۲۴</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-blue-100">
              * اعداد بالا صرفاً نمونه نمایشی هستند.
            </p>
          </div>

          <p className="relative z-10 text-xs text-blue-200">
            همه ارتباطات مشتریانت، یکجا و همیشه در دسترس.
          </p>
        </div>
      </div>
    </div>
  );
}
