import {
  FiSearch,
  FiBell,
  FiSun,
  FiUser,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import useAuthStore from "../../Store/authStore";
import useThemeStore from "../../Store/themeStore";

const Navbar = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 lg:right-64 z-50 h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-4 dark:bg-[#111827] dark:text-[#F1F5F9] dark:border-[#2A3548]">
        {/* Menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-blue-600 dark:text-[#94A3B8] dark:hover:text-blue-400"
          >
            <FiMenu size={24} />
          </button>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#94A3B8]"
              size={19}
            />

            <input
              type="text"
              placeholder="جستجو..."
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-gray-100 outline-none text-sm focus:ring-2 focus:ring-blue-500 dark:bg-[#172033] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] dark:border dark:border-[#2A3548]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notification
          <button className="relative text-gray-600 hover:text-blue-600 dark:text-[#94A3B8]">
            <FiBell size={21} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button> */}

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="hidden sm:block text-gray-600 hover:text-blue-600 p-2 rounded-full transition dark:text-yellow-400 dark:bg-[#172033] dark:hover:bg-[#243247]"
          >
            <FiSun size={21} />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 group relative">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-500/10">
              <FiUser className="text-blue-600 dark:text-blue-400" size={20} />
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800 dark:text-[#F1F5F9]">
                {user?.username || "ورود"}
              </p>

              {user ? (
                <p className="text-xs text-gray-500 dark:text-[#94A3B8]">
                  کارشناس فروش
                </p>
              ) : (
                ""
              )}
            </div>

            {user ? (
              <>
                <FiChevronDown
                  size={16}
                  className="hidden sm:block text-gray-400 dark:text-[#94A3B8]"
                />

                <div className="absolute left-0 top-10 z-50 w-35 origin-top overflow-hidden rounded-md bg-gray-100 border border-gray-200 opacity-0 invisible scale-y-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 group-hover:scale-y-100 dark:bg-[#172033] dark:border-[#2A3548]">
                  <a
                    onClick={logout}
                    className="h-10 w-full transition-colors duration-200 hover:bg-gray-200 cursor-pointer flex items-center justify-center text-gray-700 dark:text-[#F1F5F9] dark:hover:bg-[#243247]"
                  >
                    خروج
                  </a>
                </div>
              </>
            ) : (
              ""
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
