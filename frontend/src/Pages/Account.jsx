import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import LoginPage from "./Login";

export default function AccountPage() {
    const user = useSelector((state) => state.user);
    if (!user) return <LoginPage />;

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

                                    <nav className="space-y-2">
                                        {[
                                            {
                                                label: "Dashboard",
                                                active: true,
                                            },
                                            { label: "Orders", active: false },
                                            {
                                                label: "Addresses",
                                                active: false,
                                            },
                                            {
                                                label: "Wishlist",
                                                active: false,
                                            },
                                            {
                                                label: "Settings",
                                                active: false,
                                            },
                                        ].map((item) => (
                                            <button
                                                key={item.label}
                                                className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                                                    item.active
                                                        ? "bg-gray-900 text-white"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-8">
                                {/* Quick Stats */}
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        { label: "Total Orders", value: "0" },
                                        { label: "Wishlist Items", value: "0" },
                                        { label: "Reviews", value: "0" },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="bg-white rounded-xl shadow-sm p-6"
                                        >
                                            <p className="text-sm text-gray-500">
                                                {stat.label}
                                            </p>
                                            <p className="mt-2 text-2xl font-medium text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                                        Recent Orders
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                                        <p className="text-gray-600 mb-4">
                                            You haven't placed any orders yet
                                        </p>
                                        <a
                                            href="/shop"
                                            className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Start Shopping
                                        </a>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                                        Account Details
                                    </h2>
                                    <dl className="grid md:grid-cols-2 gap-6">
                                        {[
                                            {
                                                label: "Full Name",
                                                value: user.name,
                                            },
                                            {
                                                label: "Email Address",
                                                value: user.email,
                                            },
                                            {
                                                label: "Member Since",
                                                value: "September 2025",
                                            },
                                            {
                                                label: "Account Status",
                                                value: "Active",
                                            },
                                        ].map((detail) => (
                                            <div
                                                key={detail.label}
                                                className="space-y-1"
                                            >
                                                <dt className="text-sm font-medium text-gray-500">
                                                    {detail.label}
                                                </dt>
                                                <dd className="text-gray-900">
                                                    {detail.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
