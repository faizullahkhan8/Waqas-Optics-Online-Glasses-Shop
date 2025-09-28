import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => action.payload,
        updateUser: (state, action) => {
            if (state) {
                return { ...state, ...action.payload };
            }
            return state;
        },
        updateUserProfile: (state, action) => {
            if (state) {
                return {
                    ...state,
                    name: action.payload.name || state.name,
                    email: action.payload.email || state.email,
                };
            }
            return state;
        },
        updateUserAddresses: (state, action) => {
            if (state) {
                return {
                    ...state,
                    addresses: action.payload,
                };
            }
            return state;
        },
        addUserAddress: (state, action) => {
            if (state) {
                return {
                    ...state,
                    addresses: [...(state.addresses || []), action.payload],
                };
            }
            return state;
        },
        updateUserAddress: (state, action) => {
            if (state) {
                return {
                    ...state,
                    addresses:
                        state.addresses?.map((addr) =>
                            addr.id === action.payload.id
                                ? action.payload
                                : addr
                        ) || [],
                };
            }
            return state;
        },
        removeUserAddress: (state, action) => {
            if (state) {
                return {
                    ...state,
                    addresses:
                        state.addresses?.filter(
                            (addr) => addr.id !== action.payload
                        ) || [],
                };
            }
            return state;
        },
        clearUser: () => null,
    },
});

export const {
    setUser,
    updateUser,
    updateUserProfile,
    updateUserAddresses,
    addUserAddress,
    updateUserAddress,
    removeUserAddress,
    clearUser,
} = userSlice.actions;
export default userSlice.reducer;
