import { useOrders } from "../../hooks/useOrders";

export default function Orders() {
    const { data: orders, isLoading } = useOrders();

    console.log(orders);

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-20 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                My Orders
            </h2>

            {orders.orders &&
            (Array.isArray(orders.orders) ? orders.orders.length : 0) > 0 ? (
                <div className="space-y-4">
                    {orders.orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Order #{order._id.slice(-8)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Placed on{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                        ${order.totalPrice}
                                    </p>
                                    <span
                                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                                            order.orderStatus === "Delivered"
                                                ? "bg-green-100 text-green-800"
                                                : order.orderStatus ===
                                                  "Shipped"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.orderItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            ${item.price}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-6">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No orders yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        You haven't placed any orders yet. Start exploring our
                        collection of eyewear and find your perfect pair!
                    </p>
                    <a
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        <span>🛍️</span>
                        Start Shopping
                    </a>
                </div>
            )}
        </div>
    );
}
