import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    ChartBarIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { toggleSidebar } from "../../store/uiSlice";
import { clearCredentials as logout } from "../../store/authSlice";
import toast from "react-hot-toast";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { sidebarCollapsed } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        {
            name: "Dashboard",
            icon: HomeIcon,
            path: "/dashboard",
            active: location.pathname === "/dashboard",
        },
        {
            name: "Products",
            icon: ShoppingBagIcon,
            path: "/products",
            active: location.pathname === "/products",
        },
        {
            name: "Orders",
            icon: ClipboardDocumentListIcon,
            path: "/orders",
            active: location.pathname === "/orders",
        },
        {
            name: "Users",
            icon: UsersIcon,
            path: "/users",
            active: location.pathname === "/users",
        },
        {
            name: "Analytics",
            icon: ChartBarIcon,
            path: "/analytics",
            active: location.pathname === "/analytics",
        },
        {
            name: "Settings",
            icon: CogIcon,
            path: "/settings",
            active: location.pathname === "/settings",
        },
    ];

    const handleLogout = async () => {
        try {
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch {
            toast.error("Error logging out");
        }
    };

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const handleViewSite = () => {
        window.open("http://localhost:5173", "_blank");
    };

    return (
        <>
            {/* Mobile overlay */}
            {!sidebarCollapsed && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => dispatch(toggleSidebar())}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed top-0 left-0 z-50 h-full bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarCollapsed ? "-translate-x-full" : "translate-x-0"}
        lg:translate-x-0 lg:static lg:z-auto
        w-64 flex flex-col
      `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                WO
                            </span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Admin Panel
                        </h1>
                    </div>
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || "A"}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">
                                {user?.name || "Admin User"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user?.email || "admin@example.com"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => handleMenuClick(item.path)}
                                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                  transition-colors duration-200
                  ${
                      item.active
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                            >
                                <Icon
                                    className={`w-5 h-5 ${
                                        item.active
                                            ? "text-indigo-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <span className="font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <button
                        onClick={handleViewSite}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                     text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">View Site</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                     text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-500" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
