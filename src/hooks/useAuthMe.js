
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    setAccessToken,
    setIsLoading,
    setLogout,
    setUser,
} from "../store/features/auth/authSlice.js";

import axiosInstance from "../api/axiosInstance.js";

const useAuthMe = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            dispatch(setIsLoading(true));

            try {
                const refreshResponse = await axiosInstance.post(
                    "/auth/refresh"
                );

                const accessToken = refreshResponse.data.accessToken;

                dispatch(setAccessToken(accessToken));

                const profileResponse = await axiosInstance.get("/auth/me");

                dispatch(setUser(profileResponse.data.user));
            } catch {
                dispatch(setLogout());
            } finally {
                dispatch(setIsLoading(false));
            }
        };

        initializeAuth();
    }, [dispatch]);
};

export default useAuthMe;