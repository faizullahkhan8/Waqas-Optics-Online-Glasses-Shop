import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../store/uiSlice";
import { clearCredentials } from "../../store/authSlice";
import { logoutAdmin } from "../../services/adminService";
import toast from "react-hot-toast";
import {
    Bars3Icon,
    BellIcon,
    UserCircleIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            dispatch(clearCredentials());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            dispatch(clearCredentials());
            toast.error("Error logging out");
            navigate("/login");
        }
        setDropdownOpen(false);
    };

    const handleProfileClick = () => {
        navigate("/profile");
        setDropdownOpen(false);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                {/* Left Section */}
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    {/* Title for mobile */}
                    <div className="block sm:hidden">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Dashboard
                        </h1>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="relative hidden md:block flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            placeholder="Search products, orders, users..."
                        />
                    </div>

                    {/* Mobile Search Button */}
                    <button
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors md:hidden ml-auto"
                        aria-label="Toggle search"
                    >
                        {mobileSearchOpen ? (
                            <XMarkIcon className="w-5 h-5" />
                        ) : (
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* User Menu */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-expanded={dropdownOpen}
                            aria-haspopup="true"
                        >
                            {/* User Info - Hidden on small screens */}
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                                    {user?.name || "Admin User"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>

                            {/* Avatar */}
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-md">
                                <span className="text-white font-medium text-sm">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        "A"}
                                </span>
                            </div>

                            {/* Dropdown Arrow */}
                            <ChevronDownIcon
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                    dropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 transform opacity-100 scale-100 transition-all duration-200">
                                {/* User info for mobile */}
                                <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name || "Admin User"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.email || "admin@example.com"}
                                    </p>
                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                                        Administrator
                                    </span>
                                </div>

                                <button
                                    onClick={handleProfileClick}
                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                >
                                    <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                                    Profile Settings
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-3 text-red-500" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {mobileSearchOpen && (
                <div className="px-4 pb-4 md:hidden">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Search products, orders, users..."
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
