import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlist: (state, action) => {
            const found = state.find((p) => p.id === action.payload.id);
            if (found) {
                return state.filter((p) => p.id !== action.payload.id);
            } else {
                return [...state, action.payload];
            }
        },
    },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
