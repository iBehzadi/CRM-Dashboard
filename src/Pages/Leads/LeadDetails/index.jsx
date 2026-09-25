import { useParams, Link } from "react-router-dom";
import { FiArrowRight, FiPhone, FiMail, FiUser } from "react-icons/fi";
import useLeadStore from "../../../Store/leadStore";

const LeadDetails = () => {
  const { id } = useParams();
  const leads = useLeadStore((state) => state.leads);
  const statusTranslate = {
    new: "جدید",
    Following: "درحال پیگیری",
    Negotiation: "مذاکره",
  };
  const statusStyles = {
    new: "bg-blue-50 text-blue-600",
    Following: "bg-yellow-50 text-yellow-600",
    Negotiation: "bg-purple-50 text-purple-600",
  };
  const lead = leads.find((item) => item.id === Number(id));

  if (!lead) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold text-gray-800">سرنخ پیدا نشد</h1>

        <Link
          to="/leads"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          بازگشت به سرنخ‌ها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/leads"
          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
        >
          <FiArrowRight size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lead.name}</h1>

          <p className="text-sm text-gray-500 mt-1">جزئیات سرنخ</p>
        </div>
      </div>

      {/* اطلاعات اصلی */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUser size={22} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">{lead.name}</h2>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
                  statusStyles[lead.status]
                }`}
              >
                {statusTranslate[lead.status]}
              </span>
            </div>
          </div>
        </div>

        {/* اطلاعات تماس */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiPhone />
              شماره تماس
            </div>

            <p className="mt-2 font-medium text-gray-800">{lead.phone}</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiMail />
              ایمیل
            </div>

            <p className="mt-2 font-medium text-gray-800">
              {lead.email || "ثبت نشده"}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">منبع سرنخ</p>

            <p className="mt-2 font-medium text-gray-800">{lead.source}</p>
          </div>
        </div>
      </div>

      {/* توضیحات */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-800 mb-4">توضیحات</h2>

        <p className="text-gray-600 leading-7">
          {lead.description || "توضیحی ثبت نشده است."}
        </p>
      </div>
    </div>
  );
};

export default LeadDetails;
