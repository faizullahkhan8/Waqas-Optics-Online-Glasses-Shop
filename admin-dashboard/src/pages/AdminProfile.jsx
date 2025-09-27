import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PencilIcon } from "@heroicons/react/24/outline";
import { getProfile, updateProfile } from "../services/adminService";

const AdminProfile = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["auth", "me"],
        queryFn: getProfile,
        staleTime: 1000 * 60 * 5,
    });

    const user = data?.user;

    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        if (user)
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
    }, [user]);

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profile updated");
            queryClient.invalidateQueries(["auth", "me"]);
        },
        onError: (err) => {
            const msg =
                err?.response?.data?.message ||
                err.message ||
                "Failed to update profile";
            toast.error(msg);
        },
    });

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    if (isLoading) return <div className="p-6">Loading profile...</div>;
    if (isError)
        return <div className="p-6 text-red-500">Failed to load profile</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">
                        My Profile
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your admin account details.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <PencilIcon className="w-5 h-5 text-gray-500" />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-md text-sm"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-gray-900 text-white px-4 py-2 rounded-md"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
