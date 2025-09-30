import React from "react";
import {
    safeLength,
    hasItems,
    getCountText,
    getEmptyStateMessage,
} from "../utils/arrayUtils";

/**
 * Error-Safe Component Examples
 *
 * This component demonstrates best practices for safely handling array operations
 * to prevent .length errors throughout the application.
 */

export const SafeArrayDemo = ({ products, cart, wishlist }) => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
                Safe Array Handling Examples
            </h3>

            {/* Safe length checking */}
            <div className="mb-4">
                <h4 className="font-medium text-gray-700">
                    Safe Length Display:
                </h4>
                <p className="text-sm text-gray-600">
                    Products: {safeLength(products)} items
                </p>
                <p className="text-sm text-gray-600">
                    Cart: {getCountText(cart, "item", "items")}
                </p>
                <p className="text-sm text-gray-600">
                    Wishlist: {getCountText(wishlist, "product", "products")}
                </p>
            </div>

            {/* Safe conditional rendering */}
            <div className="mb-4">
                <h4 className="font-medium text-gray-700">
                    Safe Conditional Rendering:
                </h4>
                {hasItems(products) ? (
                    <p className="text-green-600">✓ Products available</p>
                ) : (
                    <p className="text-gray-500">No products available</p>
                )}

                {hasItems(cart) ? (
                    <p className="text-blue-600">✓ Cart has items</p>
                ) : (
                    <p className="text-gray-500">Cart is empty</p>
                )}
            </div>

            {/* Safe empty state messages */}
            <div className="mb-4">
                <h4 className="font-medium text-gray-700">
                    Safe Empty State Messages:
                </h4>
                <div className="text-sm">
                    {getEmptyStateMessage(
                        products,
                        "No products found",
                        "Loading products..."
                    )}
                </div>
            </div>

            {/* Safe badge displays */}
            <div className="flex gap-2">
                {hasItems(cart) && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Cart: {safeLength(cart)}
                    </span>
                )}
                {hasItems(wishlist) && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        Wishlist: {safeLength(wishlist)}
                    </span>
                )}
            </div>
        </div>
    );
};

/**
 * Error Boundary for catching any remaining array-related errors
 */
export class ArrayErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Check if it's a .length related error
        if (error.message && error.message.includes("length")) {
            return { hasError: true, error };
        }
        return null;
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            "Array operation error caught by boundary:",
            error,
            errorInfo
        );
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-red-800 font-medium">
                        Oops! Something went wrong
                    </h3>
                    <p className="text-red-600 text-sm mt-1">
                        We're having trouble displaying this content. Please try
                        refreshing the page.
                    </p>
                    <button
                        onClick={() =>
                            this.setState({ hasError: false, error: null })
                        }
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SafeArrayDemo;
