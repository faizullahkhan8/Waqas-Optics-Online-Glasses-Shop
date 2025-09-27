import { useState } from "react";
import {
    CogIcon,
    BellIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const Settings = () => {
    const [settings, setSettings] = useState({
        siteName: "Waqas Optics",
        siteDescription: "Premium eyewear and optical solutions",
        currency: "USD",
        timezone: "UTC",
        emailNotifications: true,
        orderNotifications: true,
        inventoryAlerts: true,
        marketingEmails: false,
        twoFactorAuth: false,
        allowGuestCheckout: true,
        autoApproveReviews: false,
    });

    const handleInputChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        toast.success("Settings saved successfully!");
    };

    const settingSections = [
        {
            title: "General Settings",
            icon: CogIcon,
            fields: [
                {
                    label: "Site Name",
                    key: "siteName",
                    type: "text",
                    description: "The name of your store",
                },
                {
                    label: "Site Description",
                    key: "siteDescription",
                    type: "textarea",
                    description: "Brief description of your store",
                },
                {
                    label: "Currency",
                    key: "currency",
                    type: "select",
                    options: ["USD", "EUR", "GBP", "CAD"],
                    description: "Default currency for your store",
                },
                {
                    label: "Timezone",
                    key: "timezone",
                    type: "select",
                    options: ["UTC", "EST", "PST", "GMT"],
                    description: "Default timezone for your store",
                },
            ],
        },
        {
            title: "Notifications",
            icon: BellIcon,
            fields: [
                {
                    label: "Email Notifications",
                    key: "emailNotifications",
                    type: "toggle",
                    description:
                        "Receive email notifications for important events",
                },
                {
                    label: "Order Notifications",
                    key: "orderNotifications",
                    type: "toggle",
                    description: "Get notified when new orders are placed",
                },
                {
                    label: "Inventory Alerts",
                    key: "inventoryAlerts",
                    type: "toggle",
                    description: "Alert when product stock is low",
                },
                {
                    label: "Marketing Emails",
                    key: "marketingEmails",
                    type: "toggle",
                    description: "Receive marketing and promotional emails",
                },
            ],
        },
        {
            title: "Security",
            icon: ShieldCheckIcon,
            fields: [
                {
                    label: "Two-Factor Authentication",
                    key: "twoFactorAuth",
                    type: "toggle",
                    description:
                        "Add an extra layer of security to your account",
                },
            ],
        },
        {
            title: "Store Settings",
            icon: GlobeAltIcon,
            fields: [
                {
                    label: "Allow Guest Checkout",
                    key: "allowGuestCheckout",
                    type: "toggle",
                    description:
                        "Allow customers to checkout without creating an account",
                },
                {
                    label: "Auto-Approve Reviews",
                    key: "autoApproveReviews",
                    type: "toggle",
                    description: "Automatically approve product reviews",
                },
            ],
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">
                        Settings
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your store settings and preferences.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="mt-4 sm:mt-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Save Changes
                </button>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {settingSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <div
                            key={section.title}
                            className="bg-white shadow-sm rounded-lg border border-gray-200"
                        >
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    <Icon className="w-5 h-5 text-gray-400 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {section.title}
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {section.fields.map((field) => (
                                    <div
                                        key={field.key}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="mb-2 sm:mb-0">
                                            <label className="text-sm font-medium text-gray-900">
                                                {field.label}
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {field.description}
                                            </p>
                                        </div>
                                        <div className="sm:ml-6">
                                            {field.type === "text" && (
                                                <input
                                                    type="text"
                                                    value={settings[field.key]}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            field.key,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                                />
                                            )}
                                            {field.type === "textarea" && (
                                                <textarea
                                                    value={settings[field.key]}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            field.key,
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                                />
                                            )}
                                            {field.type === "select" && (
                                                <select
                                                    value={settings[field.key]}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            field.key,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                                >
                                                    {field.options.map(
                                                        (option) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            )}
                                            {field.type === "toggle" && (
                                                <button
                                                    onClick={() =>
                                                        handleInputChange(
                                                            field.key,
                                                            !settings[field.key]
                                                        )
                                                    }
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                        settings[field.key]
                                                            ? "bg-gray-900"
                                                            : "bg-gray-200"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            settings[field.key]
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                        }`}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Danger Zone */}
            <div className="bg-white shadow-sm rounded-lg border border-red-200">
                <div className="px-6 py-4 border-b border-red-200">
                    <h3 className="text-lg font-semibold text-red-900">
                        Danger Zone
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-red-900">
                                Clear All Data
                            </h4>
                            <p className="text-xs text-red-600 mt-1">
                                Permanently delete all products, orders, and
                                customer data. This action cannot be undone.
                            </p>
                        </div>
                        <button className="mt-4 sm:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                            Clear Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
