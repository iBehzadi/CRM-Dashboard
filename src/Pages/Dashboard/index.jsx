import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiUserPlus,
  FiCheckSquare,
  FiTrendingUp,
  FiCheck,
} from "react-icons/fi";
import useLeadStore from "../../Store/leadStore";
import useCustomerStore from "../../Store/customerStore";
import useTaskStore from "../../Store/taskStore";
import useActivityStore from "../../Store/activityStore";

const statusTranslate = {
  new: "جدید",
  following: "درحال پیگیری",
  negotiation: "مذاکره",
  converted: "تبدیل‌شده",
};
const statusStyles = {
  new: "bg-blue-50 text-blue-600",
  following: "bg-yellow-50 text-yellow-600",
  negotiation: "bg-purple-50 text-purple-600",
  converted: "bg-green-50 text-green-600",
};
const statusBar = {
  new: "bg-blue-500",
  following: "bg-yellow-500",
  negotiation: "bg-purple-500",
  converted: "bg-green-500",
};

const priorityTranslate = { low: "کم", medium: "متوسط", high: "بالا" };
const priorityStyles = {
  low: "bg-gray-50 text-gray-600",
  medium: "bg-yellow-50 text-yellow-600",
  high: "bg-red-50 text-red-600",
};

const typeTranslate = {
  call: "تماس تلفنی",
  text: "پیام",
  email: "ایمیل",
  meet: "جلسه",
  note: "یادداشت",
  following: "پیگیری",
};

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;


const formatDate = (d) =>
  d ? new Date(`${d.slice(0, 10)}T00:00:00`).toLocaleDateString("fa-IR") : "-";

const num = (n) => n.toLocaleString("fa-IR");

const Card = ({ title, action, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-bold text-gray-800">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const Empty = ({ text }) => (
  <p className="py-6 text-center text-sm text-gray-400">{text}</p>
);

const Dashboard = () => {
  const leads = useLeadStore((state) => state.leads);
  const customers = useCustomerStore((state) => state.customers);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const activities = useActivityStore((state) => state.activities);
  const fetchActivities = useActivityStore((state) => state.fetchActivities);

  useEffect(() => {
    // سرنخ‌ها را App.jsx قبلاً می‌خواند
    fetchCustomers({ silent: true });
    fetchTasks({ silent: true });
    fetchActivities();
  }, [fetchCustomers, fetchTasks, fetchActivities]);

  const data = useMemo(() => {
    const today = toISO(new Date());

    const openTasks = tasks.filter((t) => t.customerStatus !== "done");
    const overdueCount = openTasks.filter(
      (t) => t.dueDate && t.dueDate < today,
    ).length;
    const dueTasks = openTasks
      .filter((t) => t.dueDate && t.dueDate <= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 6);

    const countByStatus = Object.keys(statusTranslate).reduce((acc, key) => {
      acc[key] = leads.filter((l) => l.leadStatus === key).length;
      return acc;
    }, {});

    const converted = countByStatus.converted;
    const conversionRate = leads.length
      ? Math.round((converted / leads.length) * 100)
      : 0;

    const recentLeads = [...leads]
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      .slice(0, 5);

    const recentActivities = [...activities]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, 5);

    return {
      today,
      openCount: openTasks.length,
      overdueCount,
      dueTasks,
      countByStatus,
      conversionRate,
      recentLeads,
      recentActivities,
    };
  }, [leads, tasks, activities]);

  const stats = [
    { title: "مشتریان", value: num(customers.length), icon: FiUsers },
    {
      title: "سرنخ‌های جدید",
      value: num(data.countByStatus.new),
      icon: FiUserPlus,
    },
    {
      title: "وظایف باز",
      value: num(data.openCount),
      hint: data.overdueCount ? `${num(data.overdueCount)} مورد عقب‌افتاده` : "",
      icon: FiCheckSquare,
    },
    {
      title: "نرخ تبدیل سرنخ",
      value: `${num(data.conversionRate)}٪`,
      icon: FiTrendingUp,
    },
  ];

  const handleDone = (task) => {
    updateTask(task.documentId, { customerStatus: "done" }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">داشبورد</h1>
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
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">
                  {item.value}
                </p>
                {item.hint && (
                  <p className="mt-1 text-xs text-red-500">{item.hint}</p>
                )}
              </div>
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tasks */}
        <Card
          title="وظایف امروز و عقب‌افتاده"
          action={
            <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
              همه وظایف
            </Link>
          }
        >
          {data.dueTasks.length === 0 ? (
            <Empty text="وظیفه‌ی بازی برای امروز ندارید" />
          ) : (
            <div className="space-y-3">
              {data.dueTasks.map((task) => {
                const overdue = task.dueDate < data.today;
                return (
                  <div
                    key={task.documentId}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {task.title}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          overdue ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {overdue ? "عقب‌افتاده: " : "امروز: "}
                        {formatDate(task.dueDate)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          priorityStyles[task.priority] || priorityStyles.low
                        }`}
                      >
                        {priorityTranslate[task.priority] || "-"}
                      </span>
                      <button
                        type="button"
                        title="انجام شد"
                        onClick={() => handleDone(task)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 border border-green-100 hover:bg-green-600 hover:text-white transition"
                      >
                        <FiCheck size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Funnel */}
        <Card title="وضعیت سرنخ‌ها">
          {leads.length === 0 ? (
            <Empty text="هنوز سرنخی ثبت نشده است" />
          ) : (
            <div className="space-y-4">
              {Object.keys(statusTranslate).map((key) => {
                const count = data.countByStatus[key];
                const percent = Math.round((count / leads.length) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="text-gray-600">
                        {statusTranslate[key]}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {num(count)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusBar[key]}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent leads */}
        <Card
          title="آخرین سرنخ‌ها"
          action={
            <Link to="/leads" className="text-sm text-blue-600 hover:underline">
              همه سرنخ‌ها
            </Link>
          }
        >
          {data.recentLeads.length === 0 ? (
            <Empty text="هنوز سرنخی ثبت نشده است" />
          ) : (
            <div className="space-y-3">
              {data.recentLeads.map((lead) => (
                <Link
                  key={lead.documentId}
                  to={`/leads/${lead.documentId}`}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {lead.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs shrink-0 ${
                      statusStyles[lead.leadStatus] || "bg-gray-50 text-gray-600"
                    }`}
                  >
                    {statusTranslate[lead.leadStatus] || "-"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Recent activities */}
        <Card title="آخرین فعالیت‌ها">
          {data.recentActivities.length === 0 ? (
            <Empty text="هنوز فعالیتی ثبت نشده است" />
          ) : (
            <div className="space-y-3">
              {data.recentActivities.map((activity) => (
                <div
                  key={activity.documentId}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {activity.lead?.name ? `${activity.lead.name} • ` : ""}
                      {formatDate(activity.date)}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs shrink-0 bg-blue-50 text-blue-600">
                    {typeTranslate[activity.type] || "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;