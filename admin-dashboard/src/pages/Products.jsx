import { useState } from "react";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
} from "../services/adminService";
import ProductForm from "../components/Product/ProductForm";

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);

    const {
        data: productsData,
        isLoading: productsLoading,
        isError: productsError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: () => fetchProducts({}),
        staleTime: 1000 * 60 * 2,
    });

    const products = productsData?.products || [];

    const categories = ["all", "Sunglasses", "Prescription", "Sports"];

    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteProduct(id),
        onSuccess: () => {
            toast.success("Product deleted");
            queryClient.invalidateQueries(["products"]);
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.message ||
                err.message ||
                "Failed to delete";
            toast.error(msg);
        },
    });

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleDelete = (productId) => {
        if (!confirm("Delete this product?")) return;
        deleteMutation.mutate(productId);
    };

    const createMutation = useMutation({
        mutationFn: (formData) => createProduct(formData),
        onSuccess: () => {
            toast.success("Product created");
            setShowAddModal(false);
            queryClient.invalidateQueries(["products"]);
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.message ||
                err.message ||
                "Failed to create product";
            toast.error(msg);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }) => updateProduct(id, formData),
        onSuccess: () => {
            toast.success("Product updated");
            setShowEditModal(false);
            setEditingProduct(null);
            queryClient.invalidateQueries(["products"]);
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.message ||
                err.message ||
                "Failed to update product";
            toast.error(msg);
        },
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800";
            case "Low Stock":
                return "bg-yellow-100 text-yellow-800";
            case "Out of Stock":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = (product.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" ||
            (product.category || "") === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">
                        Products
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your eyewear inventory and product catalog.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 sm:mt-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Product
                </button>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                Add Product
                            </h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Close
                            </button>
                        </div>

                        <ProductForm
                            onCancel={() => setShowAddModal(false)}
                            onSubmit={(fd) => createMutation.mutate(fd)}
                            submitLabel="Create"
                        />
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                Edit Product
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Close
                            </button>
                        </div>

                        <ProductForm
                            initial={editingProduct}
                            onCancel={() => setShowEditModal(false)}
                            onSubmit={(fd) =>
                                updateMutation.mutate({
                                    id: editingProduct._id || editingProduct.id,
                                    formData: fd,
                                })
                            }
                            submitLabel="Update"
                        />
                    </div>
                </div>
            )}

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
                            placeholder="Search products..."
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <FunnelIcon className="w-5 h-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === "all"
                                            ? "All Categories"
                                            : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productsLoading ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-4 text-sm text-gray-500"
                                    >
                                        Loading products...
                                    </td>
                                </tr>
                            ) : productsError ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-4 text-sm text-red-500"
                                    >
                                        Failed to load products
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product._id || product.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={
                                                            (product.images &&
                                                                product
                                                                    .images[0] &&
                                                                (product
                                                                    .images[0]
                                                                    .url ||
                                                                    product
                                                                        .images[0])) ||
                                                            product.image ||
                                                            ""
                                                        }
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.price
                                                ? `$${Number(
                                                      product.price
                                                  ).toFixed(2)}`
                                                : product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                    product.stock > 0
                                                        ? "Active"
                                                        : "Out of Stock"
                                                )}`}
                                            >
                                                {product.stock > 0
                                                    ? "Active"
                                                    : "Out of Stock"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                    className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            product._id ||
                                                                product.id
                                                        )
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

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">
                            {filteredProducts.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{products.length}</span>{" "}
                        results
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
                            1
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
