'use client';

import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        user_data: [],
        carts: [], // Add a cart field to the initial state
    },
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
            state.user_data = [];
            state.carts = []; // Clear the cart on logout
        },
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user_data = action.payload;
            state.carts = action.payload
        },
        carts: (state, action) => {
            state.carts = action.payload; // Handle cart data update
        },
    },
});

export const { login, logout, cart } = userSlice.actions;

export default userSlice.reducer;
