import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthentication: false,
    accessToken: null,
    isLoading: true,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthentication = true;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthentication = true;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setLogout: (state, action) => {
            state.accessToken = null;
            state.isAuthentication = false;
            state.user = null;
        },

    }
});

export const { setUser, setIsLoading, setAccessToken, setLogout, } = authSlice.actions;


export default authSlice.reducer;