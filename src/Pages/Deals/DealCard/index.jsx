import { FiClock, FiUser } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";

const isFinalStage = (stage) => stage === "won" || stage === "lost";

const formatDate = (d) =>
  d
    ? new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString("fa-IR")
    : "-";

const toman = (n) => `${Number(n || 0).toLocaleString("fa-IR")} تومان`;

const DealCard = ({ deal, stages, onMove, onEdit, onRemove }) => {
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const overdue =
    !isFinalStage(deal.stage) &&
    deal.expectedCloseDate &&
    deal.expectedCloseDate < todayISO;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3 transition-colors dark:bg-[#172033] dark:border-[#2A3548]">
      {/* عنوان و مبلغ */}
      <div>
        <p className="font-medium text-gray-800 dark:text-[#F1F5F9]">
          {deal.title}
        </p>

        <p className="mt-1 font-bold text-blue-600 dark:text-[#818CF8]">
          {toman(deal.amount)}
        </p>
      </div>

      {/* اطلاعات معامله */}
      <div className="space-y-1 text-xs text-gray-500 dark:text-[#94A3B8]">
        {deal.customer && (
          <p className="flex items-center gap-1.5">
            <FiUser className="shrink-0" />
            {deal.customer.name}
          </p>
        )}

        {deal.expectedCloseDate && (
          <p
            className={`flex items-center gap-1.5 ${
              overdue
                ? "text-red-600 dark:text-red-400"
                : ""
            }`}
          >
            <FiClock className="shrink-0" />
            {formatDate(deal.expectedCloseDate)}
            {overdue && " (گذشته)"}
          </p>
        )}

        {deal.stage === "won" && deal.closedAt && (
          <p className="text-green-600 dark:text-green-400">
            بسته شد: {formatDate(deal.closedAt)}
          </p>
        )}

        {deal.stage === "lost" && deal.lostReason && (
          <p className="text-red-600 dark:text-red-400">
            دلیل: {deal.lostReason}
          </p>
        )}
      </div>

      {/* عملیات */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-[#2A3548]">
        <select
          value={deal.stage}
          onChange={(e) => onMove(deal, e.target.value)}
          title="انتقال به مرحله"
          className="h-8 min-w-0 px-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-xs outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 dark:bg-[#111827] dark:border-[#2A3548] dark:text-[#F1F5F9]"
        >
          {stages.map((stage) => (
            <option
              key={stage.key}
              value={stage.key}
              className="bg-white text-gray-800 dark:bg-[#111827] dark:text-[#F1F5F9]"
            >
              {stage.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            title="ویرایش"
            onClick={() => onEdit(deal)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900 dark:hover:bg-blue-600 dark:hover:text-white"
          >
            <FaEdit size={13} />
          </button>

          <button
            type="button"
            title="حذف"
            onClick={() => onRemove(deal)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition dark:bg-red-950/40 dark:text-red-300 dark:border-red-900 dark:hover:bg-red-600 dark:hover:text-white"
          >
            <FaTrash size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;