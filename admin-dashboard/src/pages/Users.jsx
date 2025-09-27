import { useState } from "react";
import {
    MagnifyingGlassIcon,
    UserPlusIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/adminService";

const Users = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin", "users"],
        queryFn: getAllUsers,
        staleTime: 1000 * 30,
    });

    const users = data?.users || [];

    // status color helper removed (not used in this view)

    const getRoleColor = (role) => {
        switch (role) {
            case "Admin":
                return "bg-purple-100 text-purple-800";
            case "Customer":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleEdit = (userId) => {
        toast.success(`Edit user ${userId}`);
    };

    const handleDelete = (userId) => {
        toast.success(`Delete user ${userId}`);
    };

    const filteredUsers = users.filter((user) => {
        return (
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">
                        Users
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage customer accounts and admin users.
                    </p>
                </div>
                <button className="mt-4 sm:mt-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center">
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Add User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        T
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    892
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
                                        A
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    Active Users
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    743
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
                                        N
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">
                                    New This Month
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    124
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Search users..."
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
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
                                        colSpan={4}
                                        className="px-6 py-4 text-sm text-gray-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-4 text-sm text-red-500"
                                    >
                                        Failed to load users
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {user.name?.charAt(
                                                                0
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.createdAt
                                                ? new Date(user.createdAt)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(user.id)
                                                    }
                                                    className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
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

export default Users;
