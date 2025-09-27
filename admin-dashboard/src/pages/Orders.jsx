import { useState } from "react";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon,
    PrinterIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "../services/adminService";

const Orders = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const queryClient = useQueryClient();

    const {
        data: ordersData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["admin", "orders"],
        queryFn: getAllOrders,
        staleTime: 1000 * 30,
    });

    const orders = ordersData?.orders || [];

    const mutation = useMutation({
        mutationFn: ({ id, status }) => updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin", "orders"]);
            toast.success("Order updated");
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.message ||
                err.message ||
                "Failed to update";
            toast.error(msg);
        },
    });

    const statuses = [
        "all",
        "Pending",
        "Processing",
        "Shipped",
        "Completed",
        "Cancelled",
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-800";
            case "Processing":
                return "bg-blue-100 text-blue-800";
            case "Shipped":
                return "bg-purple-100 text-purple-800";
            case "Pending":
                return "bg-yellow-100 text-yellow-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleViewOrder = (orderId) => {
        toast.success(`View order ${orderId}`);
    };

    const handlePrintOrder = (orderId) => {
        toast.success(`Print order ${orderId}`);
    };

    const handleChangeStatus = (id, status) => {
        mutation.mutate({ id, status });
    };

    const filteredOrders = orders.filter((order) => {
        const orderId = order._id
            ? `#${order._id.toString().slice(-6).toUpperCase()}`
            : order.id || "";
        const matchesSearch =
            orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customer || order.user?.name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesStatus =
            selectedStatus === "all" ||
            order.orderStatus === selectedStatus ||
            order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">
                        Orders
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage and track customer orders and shipments.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Export Orders
                    </button>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Bulk Actions
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        P
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Pending
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    23
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        Pr
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Processing
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    47
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        S
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Shipped
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    89
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        C
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    156
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Search orders or customers..."
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <FunnelIcon className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status === "all"
                                            ? "All Statuses"
                                            : status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
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
                                    Products
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-4 text-sm text-gray-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-4 text-sm text-red-500"
                                    >
                                        Failed to load orders
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {`#${order._id
                                                .toString()
                                                .slice(-6)
                                                .toUpperCase()}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.customer}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.products} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.totalPrice
                                                ? `$${order.totalPrice.toFixed(
                                                      2
                                                  )}`
                                                : order.total}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                    order.orderStatus ||
                                                        order.status
                                                )}`}
                                            >
                                                {order.orderStatus ||
                                                    order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.createdAt
                                                ? new Date(order.createdAt)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : order.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleViewOrder(
                                                            order._id
                                                        )
                                                    }
                                                    className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handlePrintOrder(
                                                            order._id
                                                        )
                                                    }
                                                    className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <PrinterIcon className="w-4 h-4" />
                                                </button>
                                                <select
                                                    value={
                                                        order.orderStatus ||
                                                        order.status
                                                    }
                                                    onChange={(e) =>
                                                        handleChangeStatus(
                                                            order._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="ml-2 border rounded px-2 py-1 text-sm"
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>
                                                    <option value="Processing">
                                                        Processing
                                                    </option>
                                                    <option value="Shipped">
                                                        Shipped
                                                    </option>
                                                    <option value="Delivered">
                                                        Delivered
                                                    </option>
                                                    <option value="Cancelled">
                                                        Cancelled
                                                    </option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
