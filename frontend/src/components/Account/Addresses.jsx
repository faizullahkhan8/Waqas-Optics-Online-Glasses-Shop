import { useState } from "react";
import {
    useDeleteAddress,
    useProfile,
    useUpdateAddress,
} from "../../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function Addresses() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const queryClient = useQueryClient();

    // Custom hook for updating address
    const { mutate: updateAddress } = useUpdateAddress({
        onSuccess: () => {
            queryClient.invalidateQueries(["profile"]);
        },
    });
    const { mutate: deleteAddress } = useDeleteAddress({
        onSuccess: () => {
            queryClient.invalidateQueries(["profile"]);
        },
    });

    const { data: profileData } = useProfile();
    const addresses = profileData?.addresses || [];

    console.log(addresses);

    const handleAddAddress = (newAddress) => {
        updateAddress(newAddress); // Call the mutation to update address in backend
        setShowAddForm(false);
    };

    const handleEditAddress = (updatedAddress) => {
        updateAddress(updatedAddress); // Call the mutation to update address in backend
        setEditingAddress(null);
    };

    const handleDeleteAddress = (addressId) => {
        deleteAddress(addressId); // Call the mutation to delete address in backend
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-gray-900">
                    Shipping Addresses
                </h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Add New Address
                </button>
            </div>

            {(Array.isArray(addresses) ? addresses.length : 0) > 0 ? (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {address.line1}
                                        {address.line2 && `, ${address.line2}`}
                                    </p>
                                    <p className="text-gray-600">
                                        {address.city}, {address.state}{" "}
                                        {address.postalCode}
                                    </p>
                                    <p className="text-gray-600">
                                        {address.country}
                                    </p>
                                    {address.phone && (
                                        <p className="text-gray-600 mt-1">
                                            Phone: {address.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setEditingAddress({
                                                ...address,
                                                _id: address._id,
                                            })
                                        }
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteAddress(address._id)
                                        }
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">
                        You haven't added any addresses yet
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Add Your First Address
                    </button>
                </div>
            )}

            {/* Add/Edit Address Form */}
            {(showAddForm || editingAddress) && (
                <AddressForm
                    address={editingAddress}
                    onSubmit={(data) =>
                        editingAddress
                            ? handleEditAddress(data)
                            : handleAddAddress(data)
                    }
                    onCancel={() => {
                        setShowAddForm(false);
                        setEditingAddress(null);
                    }}
                />
            )}
        </div>
    );
}

function AddressForm({ address, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        line1: address?.line1 || "",
        line2: address?.line2 || "",
        city: address?.city || "",
        state: address?.state || "",
        country: address?.country || "",
        postalCode: address?.postalCode || "",
        phone: address?.phone || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(address);
        onSubmit(address ? { ...formData, _id: address._id } : formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                {address ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1 *
                        </label>
                        <input
                            type="text"
                            name="line1"
                            value={formData.line1}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2
                        </label>
                        <input
                            type="text"
                            name="line2"
                            value={formData.line2}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        {address ? "Update Address" : "Add Address"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
