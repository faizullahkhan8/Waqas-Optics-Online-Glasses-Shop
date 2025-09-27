import api from "../lib/api";

// Cart API endpoints
export const cartApi = {
    // Get user's cart
    getCart: async () => {
        const { data } = await api.get("/cart");
        return data;
    },

    // Add item to cart
    addToCart: async (itemData) => {
        const { data } = await api.post("/cart", itemData);
        return data;
    },

    // Update cart item quantity
    updateCartItem: async (itemId, quantity) => {
        const { data } = await api.put(`/cart/${itemId}`, { quantity });
        return data;
    },

    // Remove item from cart
    removeFromCart: async (itemId) => {
        const { data } = await api.delete(`/cart/${itemId}`);
        return data;
    },

    // Clear entire cart
    clearCart: async () => {
        const { data } = await api.delete("/cart");
        return data;
    },
};
