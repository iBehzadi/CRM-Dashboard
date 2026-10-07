import React, { useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { MdOutlineWbSunny } from "react-icons/md";
import useDealStore from "../../Store/dealStore";
export default function Sales() {
  const deals = useDealStore((state) => state.deals);
  const fetchDeals = useDealStore((state) => state.fetchDeals);
  const createDeal = useDealStore((state) => state.createDeal);
  const updateDeal = useDealStore((state) => state.updateDeal);
  const removeDeal = useDealStore((state) => state.removeDeal);

  const sales = deals.filter((deal) => deal.stage === "won");
  console.log(sales);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);
  return (
    <div className="space-y-6">
      {/* header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">فروش</h1>
          <p className="mt-1 text-sm text-gray-500">
            مدیریت فروش و اطلاعات مشتریان
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700">
          <FiPlus size={18} />
          ثبت فروش
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* فروش امروز */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">فروش امروز</h2>

            <MdOutlineWbSunny className="h-12 w-12 rounded-full bg-amber-100 p-2 text-3xl text-amber-400" />
          </div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            12.500.000 تومان
          </h3>

          <span className="mt-2 block text-sm text-green-600">
            ۲۵٪ نسبت به دیروز
          </span>
        </div>

        {/* فروش ماه */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">فروش این ماه</h2>

            <MdOutlineWbSunny className="h-12 w-12 rounded-full bg-blue-100 p-2 text-3xl text-blue-400" />
          </div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            125.000.000 تومان
          </h3>

          <span className="mt-2 block text-sm text-green-600">
            ۱۸٪ نسبت به ماه قبل
          </span>
        </div>

        {/* تعداد فروش */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">تعداد فروش</h2>

            <MdOutlineWbSunny className="h-12 w-12 rounded-full bg-green-100 p-2 text-3xl text-green-400" />
          </div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">۲۴ فروش</h3>

          <span className="mt-2 block text-sm text-green-600">
            ۱۲٪ نسبت به ماه قبل
          </span>
        </div>

        {/* میانگین فروش */}
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">میانگین فروش</h2>

            <MdOutlineWbSunny className="h-12 w-12 rounded-full bg-purple-100 p-2 text-3xl text-purple-400" />
          </div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            5.200.000 تومان
          </h3>

          <span className="mt-2 block text-sm text-green-600">
            ۸٪ نسبت به ماه قبل
          </span>
        </div>
      </div>
      {/* filter */}
      <div className="flex flex-wrap items-end gap-5 rounded-lg bg-white p-4">
        {/* clear filter */}
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm text-gray-600 transition hover:border-blue-400 hover:text-blue-500"
        >
          <CiFilter size={20} />
          حذف فیلتر
        </button>

        {/* visitor */}
        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor="visitor" className="text-gray-700">
            کارشناس فروش
          </label>

          <select
            name="visitor"
            id="visitor"
            className="h-10 w-36 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">همه</option>
            <option value="">بهزاد صادقی</option>
          </select>
        </div>

        {/* status */}
        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor="status" className="text-gray-700">
            وضعیت
          </label>

          <select
            name="status"
            id="status"
            className="h-10 w-36 rounded-lg border border-gray-300 bg-white px-2 text-sm text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">همه</option>
            <option value="">فعال</option>
          </select>
        </div>

        {/* date */}
        <div className="flex flex-wrap items-end gap-4 text-sm">
          <label
            htmlFor="fromDate"
            className="flex items-center gap-2 whitespace-nowrap text-gray-700"
          >
            از تاریخ
            <input
              id="fromDate"
              type="date"
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label
            htmlFor="toDate"
            className="flex items-center gap-2 whitespace-nowrap text-gray-700"
          >
            تا تاریخ
            <input
              id="toDate"
              type="date"
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
      </div>
      {/* table */}
      <table className="w-full text-right text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3">مشتری</th>
            <th className="px-4 py-3">محصول</th>
            <th className="px-4 py-3">مبلغ</th>
            <th className="px-4 py-3">کارشناس</th>
            <th className="px-4 py-3">وضعیت</th>
            <th className="px-4 py-3">تاریخ</th>
            <th className="px-4 py-3">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s) => (
            <tr
              key={s.documentId}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium">{s.customer?.name}</td>

              <td className="px-4 py-3">{s.title}</td>

              <td className="px-4 py-3">
                {s.amount?.toLocaleString("fa-IR")} تومان
              </td>

              <td className="px-4 py-3">کارشناس ۱</td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  {s.stage === "won" ? "موفق" : s.stage}
                </span>
              </td>

              <td className="px-4 py-3">{s.closedAt}</td>

              <td className="px-4 py-3">
                <button className="text-blue-600 hover:text-blue-800">
                  مشاهده
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
