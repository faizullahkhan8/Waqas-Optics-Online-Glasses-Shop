const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const ErrorHandler = require("../utils/errorHandler");

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get counts
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: "delivered" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Get recent stats (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentOrders = await Order.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
        });
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            role: "user",
        });

        // Calculate percentage changes (mock data for now)
        const stats = {
            totalProducts: {
                value: totalProducts,
                change: "+12%",
                changeType: "increase",
            },
            totalOrders: {
                value: totalOrders,
                change: "+8%",
                changeType: "increase",
            },
            totalUsers: {
                value: totalUsers,
                change: "+23%",
                changeType: "increase",
            },
            totalRevenue: {
                value: totalRevenue,
                change: "+15%",
                changeType: "increase",
            },
            recentOrders,
            recentUsers,
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// @desc    Get recent orders for dashboard
// @route   GET /api/v1/admin/dashboard/recent-orders
// @access  Private/Admin
exports.getRecentOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("orderItems.product", "name")
            .sort({ createdAt: -1 })
            .limit(10);

        const formattedOrders = orders.map((order) => ({
            id: order._id,
            orderNumber: `#${order._id.toString().slice(-6).toUpperCase()}`,
            customer: order.user?.name || "Guest",
            email: order.user?.email || "N/A",
            products: order.orderItems.length,
            total: `$${order.totalPrice.toFixed(2)}`,
            status: order.orderStatus,
            date: order.createdAt.toISOString().split("T")[0],
            paymentMethod: order.paymentInfo?.type || "Unknown",
        }));

        res.status(200).json({
            success: true,
            data: formattedOrders,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// @desc    Get analytics data
// @route   GET /api/v1/admin/analytics/overview
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
    try {
        // Get monthly sales data for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    orderStatus: "delivered",
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Get category distribution
        const categoryData = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalProducts = await Product.countDocuments();
        const formattedCategoryData = categoryData.map((cat) => ({
            name: cat._id,
            value: Math.round((cat.count / totalProducts) * 100),
            count: cat.count,
        }));

        res.status(200).json({
            success: true,
            data: {
                salesData,
                categoryData: formattedCategoryData,
            },
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// @desc    Get sales data for charts
// @route   GET /api/v1/admin/analytics/sales-data
// @access  Private/Admin
exports.getSalesData = async (req, res, next) => {
    try {
        const { period = "6months" } = req.query;

        let startDate = new Date();
        switch (period) {
            case "30days":
                startDate.setDate(startDate.getDate() - 30);
                break;
            case "3months":
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case "6months":
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case "1year":
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 6);
        }

        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $ne: "cancelled" },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const formattedData = salesData.map((item) => ({
            month: months[item._id.month - 1],
            revenue: item.revenue,
            orders: item.orders,
            year: item._id.year,
        }));

        res.status(200).json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// @desc    Get top selling products
// @route   GET /api/v1/admin/analytics/top-products
// @access  Private/Admin
exports.getTopProducts = async (req, res, next) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    totalSold: { $sum: "$orderItems.quantity" },
                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                "$orderItems.price",
                                "$orderItems.quantity",
                            ],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    name: "$product.name",
                    sales: "$totalSold",
                    revenue: "$totalRevenue",
                },
            },
            { $sort: { sales: -1 } },
            { $limit: 10 },
        ]);

        const formattedData = topProducts.map((product) => ({
            name: product.name,
            sales: product.sales,
            revenue: `$${product.revenue.toFixed(2)}`,
        }));

        res.status(200).json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// @desc    Get all users (admin)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        const formatted = users.map((u) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt,
            addresses: u.addresses || [],
        }));

        res.status(200).json({
            success: true,
            users: formatted,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
