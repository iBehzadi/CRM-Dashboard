import { FiClock, FiUser } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";

const isFinalStage = (stage) => stage === "won" || stage === "lost";

const formatDate = (d) =>
  d
    ? new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString("fa-IR")
    : "-";

const toman = (n) => `${Number(n || 0).toLocaleString("fa-IR")} تومان`;

const DealCard = ({
  deal,
  stages,
  onMove,
  onEdit,
  onRemove,
}) => {
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const overdue =
    !isFinalStage(deal.stage) &&
    deal.expectedCloseDate &&
    deal.expectedCloseDate < todayISO;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
      <div>
        <p className="font-medium text-gray-800">{deal.title}</p>
        <p className="mt-1 font-bold text-blue-600">
          {toman(deal.amount)}
        </p>
      </div>

      <div className="space-y-1 text-xs text-gray-500">
        {deal.customer && (
          <p className="flex items-center gap-1.5">
            <FiUser />
            {deal.customer.name}
          </p>
        )}

        {deal.expectedCloseDate && (
          <p
            className={`flex items-center gap-1.5 ${
              overdue ? "text-red-600" : ""
            }`}
          >
            <FiClock />
            {formatDate(deal.expectedCloseDate)}
            {overdue && " (گذشته)"}
          </p>
        )}

        {deal.stage === "won" && deal.closedAt && (
          <p className="text-green-600">
            بسته شد: {formatDate(deal.closedAt)}
          </p>
        )}

        {deal.stage === "lost" && deal.lostReason && (
          <p className="text-red-600">
            دلیل: {deal.lostReason}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
        <select
          value={deal.stage}
          onChange={(e) => onMove(deal, e.target.value)}
          title="انتقال به مرحله"
          className="h-8 px-2 rounded-lg bg-gray-50 border border-gray-200 text-xs outline-none cursor-pointer"
        >
          {stages.map((stage) => (
            <option key={stage.key} value={stage.key}>
              {stage.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="ویرایش"
            onClick={() => onEdit(deal)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition"
          >
            <FaEdit size={13} />
          </button>

          <button
            type="button"
            title="حذف"
            onClick={() => onRemove(deal)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition"
          >
            <FaTrash size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
