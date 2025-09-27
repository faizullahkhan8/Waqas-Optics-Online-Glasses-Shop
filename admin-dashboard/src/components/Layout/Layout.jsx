import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
    const { sidebarCollapsed } = useSelector((state) => state.ui);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar Container */}
            <div
                className={`
                    transition-all duration-300 ease-in-out
                    ${sidebarCollapsed ? "w-0 lg:w-20" : "w-0 lg:w-72"}
                    hidden lg:block
                `}
            >
                <Sidebar />
            </div>

            {/* Mobile Sidebar - Overlay */}
            <div className="lg:hidden">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
