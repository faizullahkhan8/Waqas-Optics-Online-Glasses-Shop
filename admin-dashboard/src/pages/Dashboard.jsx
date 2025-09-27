import {
    CubeIcon,
    ShoppingBagIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import * as adminService from "../services/adminService";

const Dashboard = () => {
    const { data: statsResp } = useQuery({
        queryKey: ["admin", "dashboard", "stats"],
        queryFn: adminService.getDashboardStats,
        retry: 1,
    });

    const { data: recentOrdersResp } = useQuery({
        queryKey: ["admin", "dashboard", "recent-orders"],
        queryFn: adminService.getRecentOrders,
        retry: 1,
    });

    const salesData = [];

    const statsData = statsResp?.data || {};

    const stats = [
        {
            name: "Total Products",
            value: statsData.totalProducts?.value || "0",
            change: statsData.totalProducts?.change || "0%",
            changeType: statsData.totalProducts?.changeType || "increase",
            icon: CubeIcon,
            color: "bg-blue-500",
        },
        {
            name: "Total Orders",
            value: statsData.totalOrders?.value || "0",
            change: statsData.totalOrders?.change || "0%",
            changeType: statsData.totalOrders?.changeType || "increase",
            icon: ShoppingBagIcon,
            color: "bg-green-500",
        },
        {
            name: "Total Users",
            value: statsData.totalUsers?.value || "0",
            change: statsData.totalUsers?.change || "0%",
            changeType: statsData.totalUsers?.changeType || "increase",
            icon: UsersIcon,
            color: "bg-purple-500",
        },
        {
            name: "Revenue",
            value: statsData.totalRevenue?.value
                ? `$${statsData.totalRevenue.value}`
                : "$0",
            change: statsData.totalRevenue?.change || "0%",
            changeType: statsData.totalRevenue?.changeType || "decrease",
            icon: CurrencyDollarIcon,
            color: "bg-yellow-500",
        },
    ];

    const recentOrders = recentOrdersResp?.data || [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome back! Here's what's happening with your store.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`${stat.color} p-3 rounded-lg`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            {stat.name}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        {stat.changeType === "increase" ? (
                                            <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                        ) : (
                                            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                        )}
                                        <span
                                            className={`text-sm font-medium ${
                                                stat.changeType === "increase"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Sales Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#1f2937"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Monthly Orders
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#1f2937" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Recent Orders
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.product}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                order.status === "Completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status ===
                                                      "Processing"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
