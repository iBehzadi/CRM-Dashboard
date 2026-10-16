import {
  FiSearch,
  FiBell,
  FiSun,
  FiUser,
  FiChevronDown,
  FiMenu,
} from "react-icons/fi";
import useAuthStore from "../../Store/authStore";

const Navbar = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  return (
    <>
      <nav className="fixed top-0 right-0 left-0 lg:right-64 z-50 h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-blue-600"
          >
            <FiMenu size={24} />
          </button>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <FiSearch
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={19}
            />

            <input
              type="text"
              placeholder="جستجو..."
              className="w-full h-10 pr-10 pl-4 rounded-lg bg-gray-100 outline-none text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notification */}
          <button className="relative text-gray-600 hover:text-blue-600">
            <FiBell size={21} />

            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Theme */}
          <button className="hidden sm:block text-gray-600 hover:text-blue-600">
            <FiSun size={21} />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 group relative">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser className="text-blue-600" size={20} />
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800">
                {user?.username || "ورود"}
              </p>

              {user ? (
                <p className="text-xs text-gray-500">کارشناس فروش</p>
              ) : (
                ""
              )}
            </div>

            {user ? (
              <>
                <FiChevronDown
                  size={16}
                  className="hidden sm:block text-gray-400"
                />
                <div className="absolute left-0 top-10 z-50 w-35 origin-top overflow-hidden rounded-md bg-gray-200 opacity-0 invisible scale-y-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 group-hover:scale-y-100">
                  <a
                    onClick={logout}
                    className=" h-10 w-full transition-colors duration-200 hover:bg-gray-200 cursor-pointer flex items-center justify-center"
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
