import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />
            <ScrollRestoration />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
