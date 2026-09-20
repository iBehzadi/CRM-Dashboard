import {
  FiPlus,
  FiSearch,
  FiMoreVertical,
} from "react-icons/fi";

const leads = [
  {
    id: 1,
    name: "علی رضایی",
    phone: "09121234567",
    source: "اینستاگرام",
    status: "جدید",
    date: "1405/06/28",
  },
  {
    id: 2,
    name: "محمد احمدی",
    phone: "09129876543",
    source: "وب‌سایت",
    status: "در حال پیگیری",
    date: "1405/06/27",
  },
  {
    id: 3,
    name: "سارا کریمی",
    phone: "09351234567",
    source: "معرفی",
    status: "مذاکره",
    date: "1405/06/26",
  },
  {
    id: 4,
    name: "رضا محمدی",
    phone: "09117654321",
    source: "اینستاگرام",
    status: "جدید",
    date: "1405/06/25",
  },
];

const statusStyles = {
  جدید: "bg-blue-50 text-blue-600",
  "در حال پیگیری": "bg-yellow-50 text-yellow-600",
  مذاکره: "bg-purple-50 text-purple-600",
};

const Leads = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            سرنخ‌ها
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            مدیریت و پیگیری مشتریان بالقوه
          </p>
        </div>

        <button
          className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-lg
            bg-blue-600
            text-white
            hover:bg-blue-700
            transition
          "
        >
          <FiPlus size={18} />
          افزودن سرنخ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="جستجوی نام یا شماره تماس..."
              className="
                w-full
                h-10
                pr-10
                pl-4
                rounded-lg
                bg-gray-50
                border
                border-gray-200
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          {/* Status */}
          <select
            className="
              h-10
              px-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              outline-none
            "
          >
            <option>همه وضعیت‌ها</option>
            <option>جدید</option>
            <option>در حال پیگیری</option>
            <option>مذاکره</option>
          </select>

          {/* Source */}
          <select
            className="
              h-10
              px-4
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              outline-none
            "
          >
            <option>همه منابع</option>
            <option>اینستاگرام</option>
            <option>وب‌سایت</option>
            <option>معرفی</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  نام
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  شماره تماس
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  منبع
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  وضعیت
                </th>

                <th className="px-5 py-4 text-right text-sm font-medium text-gray-500">
                  تاریخ
                </th>

                <th className="px-5 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {lead.name}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {lead.phone}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {lead.source}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        ${statusStyles[lead.status]}
                      `}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    {lead.date}
                  </td>

                  <td className="px-5 py-4">
                    <button className="text-gray-500 hover:text-blue-600">
                      <FiMoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;