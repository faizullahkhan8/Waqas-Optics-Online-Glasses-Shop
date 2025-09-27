import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Sidebar as ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
} from "react-pro-sidebar";
import {
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    ChartBarIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { toggleSidebar } from "../../store/uiSlice";
import { clearCredentials as logout } from "../../store/authSlice";
import { logoutAdmin } from "../../services/adminService";
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
            name: "Profile",
            icon: EyeIcon,
            path: "/profile",
            active: location.pathname === "/profile",
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
            await logoutAdmin();
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

            {/* React Pro Sidebar */}
            <ProSidebar
                collapsed={sidebarCollapsed}
                collapsedWidth="80px"
                width="280px"
                backgroundColor="#ffffff"
                rootStyles={{
                    [`.ps-sidebar-container`]: {
                        backgroundColor: "#ffffff",
                        borderRight: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    },
                    [`.ps-menu-button`]: {
                        backgroundColor: "transparent",
                        color: "#374151",
                        "&:hover": {
                            backgroundColor: "#f9fafb",
                            color: "#111827",
                        },
                    },
                    [`.ps-active`]: {
                        backgroundColor: "#eef2ff !important",
                        color: "#4338ca !important",
                        borderRight: "3px solid #4338ca",
                    },
                }}
                className={`
                    fixed top-0 left-0 z-50 h-full
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarCollapsed ? "-translate-x-full" : "translate-x-0"}
                    lg:translate-x-0 lg:static lg:z-auto
                `}
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                WO
                            </span>
                        </div>
                        {!sidebarCollapsed && (
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Waqas Optics
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Admin Panel
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Info */}
                {!sidebarCollapsed && (
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-medium text-lg">
                                    {user?.name?.charAt(0)?.toUpperCase() ||
                                        "A"}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">
                                    {user?.name || "Admin User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || "admin@example.com"}
                                </p>
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                                    Administrator
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Menu */}
                <Menu
                    menuItemStyles={{
                        button: ({ level, active }) => ({
                            backgroundColor: active ? "#eef2ff" : "transparent",
                            color: active ? "#4338ca" : "#374151",
                            fontWeight: active ? "600" : "500",
                            borderRadius: level === 0 ? "8px" : "6px",
                            margin: "4px 12px",
                            padding: "12px 16px",
                            "&:hover": {
                                backgroundColor: "#f9fafb",
                                color: "#111827",
                            },
                        }),
                        icon: ({ active }) => ({
                            color: active ? "#4338ca" : "#6b7280",
                        }),
                    }}
                    className="py-4"
                >
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <MenuItem
                                key={item.name}
                                active={item.active}
                                icon={<Icon className="w-5 h-5" />}
                                onClick={() => handleMenuClick(item.path)}
                            >
                                {item.name}
                            </MenuItem>
                        );
                    })}
                </Menu>

                {/* Footer Actions */}
                <div className="mt-auto border-t border-gray-200 bg-white">
                    <Menu
                        menuItemStyles={{
                            button: {
                                backgroundColor: "transparent",
                                color: "#374151",
                                fontWeight: "500",
                                borderRadius: "8px",
                                margin: "4px 12px",
                                padding: "12px 16px",
                                "&:hover": {
                                    backgroundColor: "#f9fafb",
                                    color: "#111827",
                                },
                            },
                            icon: {
                                color: "#6b7280",
                            },
                        }}
                        className="py-4"
                    >
                        <MenuItem
                            icon={<EyeIcon className="w-5 h-5" />}
                            onClick={handleViewSite}
                        >
                            View Site
                        </MenuItem>
                        <MenuItem
                            icon={
                                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            }
                            onClick={handleLogout}
                            style={{
                                color: "#dc2626",
                            }}
                            className="hover:bg-red-50 hover:text-red-700"
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </ProSidebar>
        </>
    );
};

export default Sidebar;
