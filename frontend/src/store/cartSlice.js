import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const found = state.find((p) => p._id === action.payload._id);
            if (found) {
                found.qty += action.payload.qty || 1;
            } else {
                state.push({ ...action.payload, qty: action.payload.qty || 1 });
            }
        },
        updateQty: (state, action) => {
            const { _id, qty } = action.payload;
            const found = state.find((p) => p._id === _id);
            if (found) found.qty = qty;
        },
        removeFromCart: (state, action) => {
            return state.filter((p) => p._id !== action.payload);
        },
        clearCart: () => initialState,
    },
});

export const { addToCart, updateQty, removeFromCart, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
