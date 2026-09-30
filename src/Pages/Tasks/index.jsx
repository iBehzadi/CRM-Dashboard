import {
  FiCheckSquare,
  FiClock,
  FiMoreVertical,
} from "react-icons/fi";

import useTaskStore from "../../Store/taskStore";

const Tasks = () => {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            وظایف
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            مدیریت و پیگیری وظایف
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          + افزودن وظیفه
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-gray-200 text-right">
                <th className="px-5 py-4 text-sm font-medium text-gray-500">
                  عنوان
                </th>

                <th className="px-5 py-4 text-sm font-medium text-gray-500">
                  تاریخ سررسید
                </th>

                <th className="px-5 py-4 text-sm font-medium text-gray-500">
                  اولویت
                </th>

                <th className="px-5 py-4 text-sm font-medium text-gray-500">
                  وضعیت
                </th>

                <th className="px-5 py-4 text-sm font-medium text-gray-500">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  {/* عنوان */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FiCheckSquare />
                      </div>

                      <div>
                        <p className="font-medium text-gray-800">
                          {task.title}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* تاریخ */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiClock />
                      {task.dueDate}
                    </div>
                  </td>

                  {/* اولویت */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-block
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        ${
                          task.priority === "زیاد"
                            ? "bg-red-50 text-red-600"
                            : task.priority === "متوسط"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-gray-50 text-gray-600"
                        }
                      `}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* وضعیت */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-block
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        ${
                          task.status === "انجام شده"
                            ? "bg-green-50 text-green-600"
                            : task.status === "در حال انجام"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-50 text-gray-600"
                        }
                      `}
                    >
                      {task.status}
                    </span>
                  </td>

                  {/* عملیات */}
                  <td className="px-5 py-4">
                    <button className="text-gray-500 hover:text-blue-600">
                      <FiMoreVertical size={18} />
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

export default Tasks;