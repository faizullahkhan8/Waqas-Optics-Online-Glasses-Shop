import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import {
    CurrencyDollarIcon,
    ShoppingBagIcon,
    UsersIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import * as adminService from "../services/adminService";

const Analytics = () => {
    // Fetch analytics overview (sales by month, categories, top products)
    const { data: overviewResp } = useQuery({
        queryKey: ["admin", "analytics", "overview"],
        queryFn: adminService.getAnalyticsOverview,
        retry: 1,
    });
    // Fetch general dashboard stats (totals, revenue, users)
    const { data: statsResp } = useQuery({
        queryKey: ["admin", "dashboard", "stats"],
        queryFn: adminService.getDashboardStats,
        retry: 1,
    });

    const overview = overviewResp?.data || {};
    const statsData = statsResp?.data || {};

    const revenueData =
        overview.salesData?.map((item) => ({
            month: item.month,
            revenue: item.revenue,
            orders: item.orders,
        })) || [];

    const palette = [
        "#1f2937",
        "#4b5563",
        "#6b7280",
        "#9ca3af",
        "#ef4444",
        "#f59e0b",
    ];
    const categoryData =
        overview.categoryData?.map((c, idx) => ({
            name: c.name,
            value: c.value,
            color: palette[idx % palette.length],
        })) || [];

    const topProducts = overview.topProducts || [];

    const stats = [
        {
            name: "Total Revenue",
            value: statsData.totalRevenue?.value
                ? `$${statsData.totalRevenue.value}`
                : "$0",
            change: statsData.totalRevenue?.change || "0%",
            icon: CurrencyDollarIcon,
            color: "bg-green-500",
        },
        {
            name: "Total Orders",
            value: statsData.totalOrders?.value || "0",
            change: statsData.totalOrders?.change || "0%",
            icon: ShoppingBagIcon,
            color: "bg-blue-500",
        },
        {
            name: "New Customers",
            value: statsData.totalUsers?.value || "0",
            change: statsData.totalUsers?.change || "0%",
            icon: UsersIcon,
            color: "bg-purple-500",
        },
        {
            name: "Page Views",
            value: "N/A",
            change: "0%",
            icon: EyeIcon,
            color: "bg-yellow-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">
                        Analytics
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Track your store's performance and growth metrics.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Last 6 months</option>
                        <option>Last year</option>
                    </select>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Export Report
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
                                    <div className="text-right">
                                        <span className="text-sm font-medium text-green-600">
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => [
                                    `$${value.toLocaleString()}`,
                                    "Revenue",
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#1f2937"
                                fill="#1f2937"
                                fillOpacity={0.1}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Sales by Category
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value}%`, "Share"]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {categoryData.map((category) => (
                            <div
                                key={category.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{
                                            backgroundColor: category.color,
                                        }}
                                    ></div>
                                    <span className="text-sm text-gray-600">
                                        {category.name}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {category.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders and Customers Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Orders & New Customers
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="orders"
                            stroke="#1f2937"
                            strokeWidth={2}
                            name="Orders"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="customers"
                            stroke="#6b7280"
                            strokeWidth={2}
                            name="New Customers"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Top Selling Products
                    </h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div
                                key={product.name}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-sm font-medium text-gray-600">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {product.sales} units sold
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {product.revenue}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
