import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../store/uiSlice";
import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Search products, orders, users..."
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.name || "Admin User"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Administrator
                            </p>
                        </div>
                        <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 transition-colors">
                            <UserCircleIcon className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
