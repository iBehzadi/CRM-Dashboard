import { useEffect, useMemo, useState } from "react";
import useDealStore from "../../Store/dealStore";
import useCustomerStore from "../../Store/customerStore";
import DealCard from "./DealCard";
import DealFormModal from "./DealFormModal";

const stages = [
  { key: "proposal", label: "پیشنهاد", dot: "bg-blue-500" },
  { key: "negotiation", label: "مذاکره", dot: "bg-purple-500" },
  { key: "won", label: "موفق", dot: "bg-green-500" },
  { key: "lost", label: "ناموفق", dot: "bg-red-500" },
];

const isFinalStage = (stage) => stage === "won" || stage === "lost";

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const toman = (n) => `${Number(n || 0).toLocaleString("fa-IR")} تومان`;

const stageChanges = (stage, lostReason = "") => ({
  stage,
  closedAt: isFinalStage(stage) ? toISO(new Date()) : null,
  lostReason: stage === "lost" ? lostReason : "",
});

const Deals = () => {
  const deals = useDealStore((state) => state.deals);
  const loading = useDealStore((state) => state.loading);
  const fetchDeals = useDealStore((state) => state.fetchDeals);
  const createDeal = useDealStore((state) => state.createDeal);
  const updateDeal = useDealStore((state) => state.updateDeal);
  const removeDeal = useDealStore((state) => state.removeDeal);

  const customers = useCustomerStore((state) => state.customers);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDeals();
    fetchCustomers({ silent: true });
  }, [fetchDeals, fetchCustomers]);

  const closeModal = () => {
    setShowModal(false);
    setEditingDeal(null);
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setShowModal(true);
  };

  const handleRemove = (deal) => {
    if (!window.confirm(`معامله «${deal.title}» حذف شود؟`)) return;
    removeDeal(deal.documentId).catch(() => {});
  };

  const handleMove = (deal, stage) => {
    if (stage === deal.stage) return;
    updateDeal(deal.documentId, stageChanges(stage)).catch(() => {});
  };

  const filteredDeals = useMemo(() => {
    const q = search.trim();
    if (!q) return deals;

    return deals.filter(
      (d) =>
        (d.title || "").includes(q) || (d.customer?.name || "").includes(q),
    );
  }, [deals, search]);

  const summary = useMemo(() => {
    const month = toISO(new Date()).slice(0, 7);
    const active = deals.filter((d) => !isFinalStage(d.stage));
    const won = deals.filter((d) => d.stage === "won");
    const lost = deals.filter((d) => d.stage === "lost");
    const sum = (list) => list.reduce((acc, d) => acc + (d.amount || 0), 0);
    const closed = won.length + lost.length;

    return {
      activeCount: active.length,
      activeSum: sum(active),
      wonThisMonth: sum(
        won.filter((d) => (d.closedAt || "").startsWith(month)),
      ),
      winRate: closed ? Math.round((won.length / closed) * 100) : 0,
    };
  }, [deals]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">معاملات</h1>
          <p className="mt-1 text-sm text-gray-500">
            پیگیری فرصت‌های فروش در مرحله‌های مختلف
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDeal(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          افزودن معامله
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">معاملات فعال</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {summary.activeCount.toLocaleString("fa-IR")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {toman(summary.activeSum)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">فروش این ماه</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {toman(summary.wonThisMonth)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">نرخ موفقیت</p>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {summary.winRate.toLocaleString("fa-IR")}٪
          </p>
          <p className="mt-1 text-xs text-gray-500">موفق نسبت به بسته‌شده‌ها</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="جستجوی عنوان معامله یا نام مشتری..."
          className="w-full h-10 px-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {stages.map((stage) => {
            const list = filteredDeals.filter((d) => d.stage === stage.key);
            const total = list.reduce((acc, d) => acc + (d.amount || 0), 0);

            return (
              <div
                key={stage.key}
                className="bg-gray-50 border border-gray-200 rounded-xl p-3"
              >
                <div className="px-1 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${stage.dot}`}
                      />
                      <h2 className="font-bold text-gray-800">{stage.label}</h2>
                    </div>

                    <span className="text-sm text-gray-500">
                      {list.length.toLocaleString("fa-IR")}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">{toman(total)}</p>
                </div>

                <div className="space-y-3">
                  {list.length === 0 && (
                    <p className="py-6 text-center text-sm text-gray-400">
                      معامله‌ای نیست
                    </p>
                  )}

                  {list.map((deal) => (
                    <DealCard
                      key={deal.documentId}
                      deal={deal}
                      stages={stages}
                      onMove={handleMove}
                      onEdit={handleEdit}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <DealFormModal
          deal={editingDeal}
          customers={customers}
          onClose={closeModal}
          onCreate={createDeal}
          onUpdate={updateDeal}
          isFinalStage={isFinalStage}
          stageChanges={stageChanges}
        />
      )}
    </div>
  );
};

export default Deals;
