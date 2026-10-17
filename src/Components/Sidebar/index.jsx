import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiBriefcase,
  FiCheckSquare,
  FiActivity,
  FiShoppingBag,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "داشبورد", icon: FiHome, path: "/" },
  { title: "سرنخ‌ها", icon: FiUserPlus, path: "leads" },
  { title: "مشتریان", icon: FiUsers, path: "customers" },
  { title: "معاملات", icon: FiBriefcase, path: "deals" },
  { title: "وظایف", icon: FiCheckSquare, path: "tasks" },
  { title: "فعالیت‌ها", icon: FiActivity, path: "activities" },
  { title: "فروش‌ها", icon: FiShoppingBag, path: "sales" },
  // { title: "تنظیمات", icon: FiSettings, path: "settings" },
];

const Sidebar = ({ open, onCloseMenu }) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onCloseMenu}
          className="fixed inset-0 z-50 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          top-0
          right-0
          z-50
          h-screen
          w-64
          bg-white
          border-l border-gray-200
          transition-all
          duration-300
          dark:bg-[#111827]
          dark:text-[#F1F5F9]
          dark:border-[#2A3548]
          ${open ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 px-5 flex border-b border-gray-200 items-center justify-between dark:bg-[#111827] dark:border-[#2A3548]">
          <h1 className="text-xl font-bold text-blue-600 dark:text-[#818CF8]">
            CRM
          </h1>

          <button
            onClick={onCloseMenu}
            className="lg:hidden text-gray-500 hover:text-blue-600 dark:text-[#94A3B8] dark:hover:text-blue-400"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(({ title, icon: Icon, path }) => (
              <li key={title}>
                <NavLink
                  to={path}
                  onClick={onCloseMenu}
                  className={({ isActive }) => `
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-[#243247] dark:text-[#818CF8]"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:text-[#94A3B8] dark:hover:bg-[#172033] dark:hover:text-[#F1F5F9]"
                    }
                  `}
                >
                  <Icon size={20} className="shrink-0" />

                  <span>{title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
