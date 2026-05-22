import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { authStorageKeys, useAuthStore } from "@/store/auth";

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080",
  timeout: 15000
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(authStorageKeys.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const isRefreshRoute = originalRequest?.url?.includes("/api/auth/refresh");

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isRefreshRoute) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = await SecureStore.getItemAsync(authStorageKeys.refreshToken);
    if (!refreshToken) {
      await useAuthStore.getState().clearAuth();
      router.replace("/(auth)/launch");
      return Promise.reject(error);
    }

    try {
      const refreshResponse = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: nextRefreshToken, user } = refreshResponse.data;
      await useAuthStore.getState().setAuth(user, accessToken, nextRefreshToken ?? refreshToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      await useAuthStore.getState().clearAuth();
      router.replace("/(auth)/launch");
      return Promise.reject(refreshError);
    }
  }
);
