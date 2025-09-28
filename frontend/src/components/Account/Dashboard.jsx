import { useSelector } from "react-redux";

export default function Dashboard() {
    const user = useSelector((state) => state.user);

    return (
        <div className="space-y-8">
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
                        <p className="text-sm text-gray-500">{stat.label}</p>
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
                        <div key={detail.label} className="space-y-1">
                            <dt className="text-sm font-medium text-gray-500">
                                {detail.label}
                            </dt>
                            <dd className="text-gray-900">{detail.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
