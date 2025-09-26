const Notification = require("../models/notification");

// Create a new notification
const createNotification = async (userId, data) => {
    try {
        const notification = await Notification.create({
            user: userId,
            title: data.title,
            message: data.message,
            type: data.type,
            relatedId: data.relatedId,
            onModel: data.onModel,
        });
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

// Create order notifications
const createOrderNotification = async (userId, order) => {
    await createNotification(userId, {
        title: "Order Placed",
        message: `Your order #${order._id} has been placed successfully`,
        type: "order",
        relatedId: order._id,
        onModel: "Order",
    });
};

// Create product notifications (e.g., back in stock)
const createProductNotification = async (userId, product) => {
    await createNotification(userId, {
        title: "Product Available",
        message: `${product.name} is now back in stock!`,
        type: "product",
        relatedId: product._id,
        onModel: "Product",
    });
};

// Create promotion notifications
const createPromotionNotification = async (userId, coupon) => {
    await createNotification(userId, {
        title: "New Coupon Available",
        message: `Use code ${coupon.code} to get ${
            coupon.discountType === "percentage"
                ? `${coupon.discountAmount}% off`
                : `$${coupon.discountAmount} off`
        }`,
        type: "promotion",
        relatedId: coupon._id,
        onModel: "Coupon",
    });
};

module.exports = {
    createNotification,
    createOrderNotification,
    createProductNotification,
    createPromotionNotification,
};
