import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type CreatorAuthUser = {
  id: string;
  userType: "CREATOR" | "BRAND" | "ADMIN";
  kycStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  displayName?: string | null;
};

type AuthState = {
  user: CreatorAuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setAuth: (user: CreatorAuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  hydrate: () => Promise<{ accessToken: string | null; refreshToken: string | null; user: CreatorAuthUser | null }>;
  updateKycStatus: (status: CreatorAuthUser["kycStatus"]) => Promise<void>;
  clearAuth: () => Promise<void>;
};

const ACCESS_TOKEN_KEY = "creatorx.accessToken";
const REFRESH_TOKEN_KEY = "creatorx.refreshToken";
const USER_KEY = "creatorx.user";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,

  async setAuth(user, accessToken, refreshToken) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
    ]);
    set({ user, accessToken, refreshToken, isLoading: false });
  },

  async hydrate() {
    const [accessToken, refreshToken, rawUser] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      AsyncStorage.getItem(USER_KEY)
    ]);
    const user = rawUser ? (JSON.parse(rawUser) as CreatorAuthUser) : null;
    set({ accessToken, refreshToken, user, isLoading: false });
    return { accessToken, refreshToken, user };
  },

  async updateKycStatus(status) {
    const user = get().user;
    if (!user) {
      return;
    }
    const nextUser = { ...user, kycStatus: status };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    set({ user: nextUser });
  },

  async clearAuth() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY)
    ]);
    set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
  }
}));

export const authStorageKeys = {
  accessToken: ACCESS_TOKEN_KEY,
  refreshToken: REFRESH_TOKEN_KEY,
  user: USER_KEY
};
