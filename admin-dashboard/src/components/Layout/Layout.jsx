import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
    const { sidebarCollapsed } = useSelector((state) => state.ui);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`${
                    sidebarCollapsed ? "w-20" : "w-64"
                } transition-all duration-300 ease-in-out`}
            >
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
