import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    role: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.isAuthenticated = true;
            state.user = user;
            state.token = token;
            state.role = user?.role || "admin";
        },
        clearCredentials: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.role = null;
        },
        updateProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { setCredentials, clearCredentials, updateProfile } =
    authSlice.actions;
export default authSlice.reducer;
