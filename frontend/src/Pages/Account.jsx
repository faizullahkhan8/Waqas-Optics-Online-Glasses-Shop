import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import LoginPage from "./Login";
import Dashboard from "../components/Account/Dashboard";
import Orders from "../components/Account/Orders";
import Addresses from "../components/Account/Addresses";
import Wishlist from "../components/Account/Wishlist";
import Settings from "../components/Account/Settings";
import Button from "../components/UI/Button";
import { useLogout } from "../hooks/useAuth";
import { clearUser } from "../store/userSlice";

export default function AccountPage() {
    const user = useSelector((state) => state.user);
    const [activeSection, setActiveSection] = useState("Dashboard");
    const dispatch = useDispatch();
    const logout = useLogout();

    if (!user) return <LoginPage />;

    const sections = [
        { label: "Dashboard", component: Dashboard },
        { label: "Orders", component: Orders },
        { label: "Addresses", component: Addresses },
        { label: "Wishlist", component: Wishlist },
        { label: "Settings", component: Settings },
    ];

    const ActiveComponent = sections.find(
        (section) => section.label === activeSection
    )?.component;

    return (
        <main>
            <Helmet>
                <title>My Account — GlassesShop</title>
                <meta
                    name="description"
                    content="View your GlassesShop account details and order history"
                />
            </Helmet>
            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-serif font-bold text-gray-900">
                                My Account
                            </h1>
                            <p className="mt-4 text-xl text-gray-600">
                                Welcome back, {user.name}
                            </p>
                        </div>

                        {/* Account Dashboard */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-2xl font-serif text-gray-600">
                                                {user.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="font-medium text-gray-900">
                                                {user.name}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <nav className="space-y-2 mb-6">
                                        {sections.map((section) => (
                                            <button
                                                key={section.label}
                                                onClick={() =>
                                                    setActiveSection(
                                                        section.label
                                                    )
                                                }
                                                className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                                                    activeSection ===
                                                    section.label
                                                        ? "bg-gray-900 text-white"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            >
                                                {section.label}
                                            </button>
                                        ))}
                                    </nav>
                                    <Button
                                        className="w-full bg-red-600 text-white hover:bg-red-700"
                                        onClick={async () => {
                                            try {
                                                await logout.logout();
                                                dispatch(clearUser());
                                            } catch {
                                                dispatch(clearUser());
                                            }
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-8">
                                {ActiveComponent && <ActiveComponent />}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
