import {
  FiUsers,
  FiUserPlus,
  FiBriefcase,
  FiDollarSign,
  FiCheckSquare,
} from "react-icons/fi";

const stats = [
  {
    title: "مشتریان من",
    value: "128",
    icon: FiUsers,
  },
  {
    title: "سرنخ‌های جدید",
    value: "24",
    icon: FiUserPlus,
  },
  {
    title: "معاملات فعال",
    value: "18",
    icon: FiBriefcase,
  },
  {
    title: "فروش این ماه",
    value: "86,500,000",
    icon: FiDollarSign,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          داشبورد
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          خلاصه‌ای از وضعیت فروش و فعالیت‌های شما
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                bg-white
                rounded-xl
                border
                border-gray-200
                p-5
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-800">
                  {item.value}
                </p>
              </div>

              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800">
              وظایف امروز
            </h2>

            <FiCheckSquare className="text-blue-600" />
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50">
              تماس با مشتری جدید
            </div>

            <div className="p-3 rounded-lg bg-gray-50">
              پیگیری پیشنهاد فروش
            </div>

            <div className="p-3 rounded-lg bg-gray-50">
              جلسه با شرکت آریا
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-800 mb-5">
            معاملات اخیر
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span>شرکت آریا</span>
              <span className="text-sm text-green-600">
                موفق
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span>فروشگاه پارس</span>
              <span className="text-sm text-yellow-600">
                در حال مذاکره
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span>شرکت نوین</span>
              <span className="text-sm text-blue-600">
                پیشنهاد
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;