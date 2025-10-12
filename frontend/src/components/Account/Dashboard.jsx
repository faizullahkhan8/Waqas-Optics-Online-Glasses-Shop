import { useUserDashboardStats } from "../../hooks/useAdditional";
import { useOrders } from "../../hooks/useOrders";
import { useProfile } from "../../hooks/useAuth";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: profileData, fetchProfile } = useProfile();
    const {
        data: dashboardStatsData,
        loading: statsLoading,
        error: statsError,
    } = useUserDashboardStats();
    const {
        data: ordersData,
        loading: ordersLoading,
        error: ordersError,
    } = useOrders();

    // Fetch profile data on mount
    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const user = profileData?.user || {};
    const orders = ordersData?.orders || [];

    // Debug logging
    console.log("Profile data:", profileData);
    console.log("Dashboard stats data:", dashboardStatsData);
    console.log("Orders data:", ordersData);

    // Loading and error states
    if (statsLoading || ordersLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="text-gray-500 text-lg">
                    Loading dashboard...
                </span>
            </div>
        );
    }

    if (statsError || ordersError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <span className="text-red-500 text-lg block mb-2">
                        Failed to load dashboard data.
                    </span>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const ordersCount = dashboardStatsData?.stats?.orders ?? 0;
    const reviewsCount = dashboardStatsData?.stats?.reviews ?? 0;
    const wishlistCount = dashboardStatsData?.stats?.wishlist ?? 0;

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Orders", value: ordersCount },
                    { label: "Wishlist Items", value: wishlistCount },
                    { label: "Reviews", value: reviewsCount },
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
                {Array.isArray(orders) && orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-gray-600">
                                        Order #
                                    </th>
                                    <th className="px-4 py-2 text-gray-600">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 text-gray-600">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-gray-600">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b">
                                        <td className="px-4 py-2">
                                            {order.orderNumber || order._id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.createdAt
                                                ? new Date(
                                                      order.createdAt
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-2">
                                            {order.orderStatus || "-"}
                                        </td>
                                        <td className="px-4 py-2">
                                            $
                                            {order.totalPrice?.toFixed(2) ??
                                                "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
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
                )}
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                    Account Details
                </h2>
                <dl className="grid md:grid-cols-2 gap-6">
                    {[
                        { label: "Full Name", value: user.name },
                        { label: "Email Address", value: user.email },
                        {
                            label: "Member Since",
                            value: user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "-",
                        },
                        {
                            label: "Phone Number",
                            value: user.phone || "-",
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
