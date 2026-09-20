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

const menuItems = [
  { title: "داشبورد", icon: FiHome },
  { title: "سرنخ‌ها", icon: FiUserPlus },
  { title: "مشتریان", icon: FiUsers },
  { title: "معاملات", icon: FiBriefcase },
  { title: "وظایف", icon: FiCheckSquare },
  { title: "فعالیت‌ها", icon: FiActivity },
  { title: "فروش‌ها", icon: FiShoppingBag },
  { title: "تنظیمات", icon: FiSettings },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
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
          border-l
          border-gray-200
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 px-5 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">CRM</h1>

          <button onClick={onClose} className="lg:hidden text-gray-500">
            <FiX size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map(({ title, icon: Icon }) => (
              <li key={title}>
                <button
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    text-gray-600
                    hover:bg-blue-50
                    hover:text-blue-600
                    transition
                  "
                >
                  <Icon size={20} className="shrink-0" />

                  <span>{title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
