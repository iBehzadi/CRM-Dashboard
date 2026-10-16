import React, { useEffect } from "react";
import { FiMail, FiLock, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";
import useAuthStore from "../../../Store/authStore";
import { useNavigate } from "react-router-dom";

export default function Login({ handlePage }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("ایمیل معتبر نیست"),
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

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8"
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/70 md:grid-cols-2">
        {/* فرم ورود */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 md:py-14">
          <div className="mb-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <span className="text-2xl font-black">C</span>
            </div>

            <h1 className="mb-3 text-3xl font-extrabold text-slate-800">
              خوش برگشتی!
            </h1>

            <p className="text-sm leading-7 text-slate-500">
              برای ورود به پنل کارشناسی، اطلاعات حساب کاربری خودت رو وارد کن.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                ایمیل یا نام کاربری
              </label>

              <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
                <FiMail className="shrink-0 text-lg text-slate-400" />

                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="ایمیل یا نام کاربری"
                  autoComplete="username"
                  className="w-full  bg-transparent py-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <span className="absolute left-5  ">
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.email}
                    </p>
                  )}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                رمز عبور
              </label>

              <div className="relative flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
                <FiLock className="shrink-0 text-lg text-slate-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formik.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="رمز عبور   "
                  autoComplete="current-password"
                  className="w-full bg-transparent py-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                <span className="absolute left-10  ">
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {formik.errors.password}
                    </p>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                  className="text-lg text-slate-400 transition hover:text-blue-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
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
                className="font-semibold text-blue-600 transition hover:text-blue-800"
              >
                فراموشی رمز؟
              </button>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              ورود به حساب
              <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            ورود امن به پنل مدیریت ارتباط با مشتریان
          </p>
        </div>

        {/* بخش معرفی CRM */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-10 text-white md:flex lg:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl font-black">
                C
              </div>
              <span className="text-lg font-bold tracking-wide">CRM PANEL</span>
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
