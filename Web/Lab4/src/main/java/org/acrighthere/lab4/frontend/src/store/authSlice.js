import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    rateLimitUntil: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout(state) {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.rateLimitUntil = null;
        },
        setRateLimit(state, action) {
            state.rateLimitUntil = action.payload;
        },
        clearRateLimit(state) {
            state.rateLimitUntil = null;
        }
    }
});

export const { setCredentials, logout, setRateLimit, clearRateLimit } = authSlice.actions;

export default authSlice.reducer;
