import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API, { setAuthToken } from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadToken();
    }, []);

    const loadToken = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (token) {
                setUserToken(token);
                setAuthToken(token);
            }
        } catch (error) {
            console.error("Failed to load token:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await API.post("/auth/login", { email, password });
            const { token } = response.data;
            await AsyncStorage.setItem("userToken", token);
            setUserToken(token);
            setAuthToken(token);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await API.post("/auth/register", userData);
            const { token } = response.data;
            await AsyncStorage.setItem("userToken", token);
            setUserToken(token);
            setAuthToken(token);
            return { success: true };
        } catch (error) {
            console.error("Register error:", error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed"
            };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userToken");
            setUserToken(null);
            setAuthToken(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
