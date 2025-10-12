import api from "../lib/api";

// Wishlist API endpoints
export const wishlistApi = {
    // Get user's wishlist
    getWishlist: async () => {
        const { data } = await api.get("/additional/wishlist");
        return data;
    },

    // Add product to wishlist
    addToWishlist: async (productId) => {
        const { data } = await api.post("/additional/wishlist", {
            productId,
        });
        return data;
    },

    // Remove product from wishlist
    removeFromWishlist: async (productId) => {
        const { data } = await api.delete(`/additional/wishlist/${productId}`);
        return data;
    },
};
