import { useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import { MdOutlineWbSunny } from "react-icons/md";
import useDealStore from "../../Store/dealStore";

export default function Sales() {
  const deals = useDealStore((state) => state.deals);
  const fetchDeals = useDealStore((state) => state.fetchDeals);
  const [stageFilter, setStageFilter] = useState("all");

  const statusStyles = {
    won: "bg-green-50 text-green-600",
    lost: "bg-red-50 text-red-600",
    waiting: "bg-yellow-50 text-yellow-600",
  };
  const statusTranslate = {
    won: "موفق",
    lost: "ناموفق",
    waiting: "درانتظار پرداخت",
  };
  const sales = useMemo(() => {
    return deals.filter(
      (deal) =>
        (deal.stage === "won" || deal.stage === "lost") &&
        (stageFilter === "all" || deal.stage === stageFilter),
    );
  }, [deals, stageFilter]);

  const summary = useMemo(() => {
    const salesData = deals.filter((dale) => dale.stage === "won");
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const todaySales = salesData.filter((sale) => {
      if (!sale.closedAt) return false;
      const date = new Date(sale.closedAt);
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const monthSales = salesData.filter((sale) => {
      if (!sale.closedAt) return false;
      const date = new Date(sale.closedAt);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const totalTodaySales = todaySales.reduce(
      (total, sale) => total + Number(sale.amount || 0),
      0,
    );

    const totalMonthSales = monthSales.reduce(
      (total, sale) => total + Number(sale.amount || 0),
      0,
    );

    return {
      totalTodaySales,
      totalMonthSales,
      todayCount: todaySales.length,
      monthCount: monthSales.length,
      averageSales: monthSales.length ? totalMonthSales / monthSales.length : 0,
    };
  }, [sales]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const formatPrice = (amount) =>
    `${Number(amount || 0).toLocaleString("fa-IR")} تومان`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">فروش</h1>
          <p className="mt-1 text-sm text-gray-500">
            مدیریت فروش و اطلاعات مشتریان
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700"
        >
          <FiPlus size={18} />
          ثبت فروش
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "فروش امروز",
            value: formatPrice(summary.totalTodaySales),
            iconBg: "bg-amber-100",
            iconColor: "text-amber-500",
            border: "border-amber-200",
            bg: "bg-amber-50",
          },
          {
            title: "فروش این ماه",
            value: formatPrice(summary.totalMonthSales),
            iconBg: "bg-blue-100",
            iconColor: "text-blue-500",
            border: "border-blue-200",
            bg: "bg-blue-50",
          },
          {
            title: "تعداد فروش این ماه",
            value: `${summary.monthCount.toLocaleString("fa-IR")} فروش`,
            iconBg: "bg-green-100",
            iconColor: "text-green-500",
            border: "border-green-200",
            bg: "bg-green-50",
          },
          {
            title: "میانگین فروش این ماه",
            value: formatPrice(summary.averageSales),
            iconBg: "bg-purple-100",
            iconColor: "text-purple-500",
            border: "border-purple-200",
            bg: "bg-purple-50",
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-xl border ${card.border} ${card.bg} p-4`}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-gray-700">
                {card.title}
              </h2>

              <MdOutlineWbSunny
                className={`h-11 w-11 shrink-0 rounded-full ${card.iconBg} p-2 text-3xl ${card.iconColor}`}
              />
            </div>

            <h3 className="mt-4 wrap-break-word text-lg font-bold text-gray-800">
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="salesStatus" className="text-gray-700">
              وضعیت
            </label>
            <select
              id="salesStatus"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all"> همه</option>
              <option value="won"> موفق</option>
              <option value="lost">ناموفق</option>
              <option value="waiting">در انتظار پرداخت</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="fromDate" className="text-gray-700">
              از تاریخ
            </label>
            <input
              id="fromDate"
              type="date"
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <label htmlFor="toDate" className="text-gray-700">
              تا تاریخ
            </label>
            <input
              id="toDate"
              type="date"
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              document.getElementById("fromDate").value = "";
              document.getElementById("toDate").value = "";
            }}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
          >
            <CiFilter size={20} />
            پاک کردن تاریخ‌ها
          </button>
        </div>
      </div>

      {/* Sales table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-right">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {[
                  "مشتری",
                  "عنوان معامله",
                  "مبلغ",
                  "کارشناس",
                  "وضعیت",
                  "تاریخ",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-5 py-4 text-sm font-medium text-gray-500"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr
                    key={sale.documentId}
                    className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {sale.customer?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {sale.title || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {formatPrice(sale.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {sale.expert?.name || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium  ${statusStyles[sale.stage]}`}
                      >
                        {statusTranslate[sale.stage]}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                      {sale.closedAt || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    هنوز فروش موفقی ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
