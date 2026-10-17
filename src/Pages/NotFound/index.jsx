import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-gray-900 transition-colors dark:bg-[#0B1120] dark:text-slate-100">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15s1.5-2 4-2 4 2 4 2" />
              <path d="M9 9h.01" />
              <path d="M15 9h.01" />
            </svg>
          </div>
        </div>

        <h1 className="mb-3 text-8xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
          404
        </h1>

        <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-slate-100">
          صفحه پیدا نشد!
        </h2>

        <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-gray-500 dark:text-slate-400">
          متأسفیم، صفحه‌ای که دنبالش هستی وجود نداره یا ممکنه آدرسش تغییر کرده
          باشه.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            بازگشت به داشبورد
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-[#2A3548] dark:text-slate-300 dark:hover:bg-[#243247]"
          >
            صفحه قبلی
          </button>
        </div>

        <p className="mt-12 text-xs text-gray-400 dark:text-slate-500">
          CRM Dashboard · Error 404
        </p>
      </div>
    </div>
  );
}
