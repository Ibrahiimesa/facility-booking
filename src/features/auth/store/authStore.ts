import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { loginApi, registerApi } from "../api/authApi";

interface AuthState {
  token: string | null;
  loading: boolean;
  refreshToken: string | null;
  name: string | null;
  email: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loading: true,
      token: null,
      refreshToken: null,
      name: null,
      email: null,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { accessToken, refreshToken, user } = await loginApi(email, password);
          set({
            token: accessToken,
            refreshToken,
            name: user.name,
            email: user.email,
          });
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      register: async (name, email, password) => {
        set({ loading: true });
        try {
          const { accessToken, refreshToken, user }= await registerApi(name, email, password);
          set({
            token: accessToken,
            refreshToken,
            name: user.name,
            email: user.email,
          });
        } catch (error) {
          console.error("Registration failed:", error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      loadToken: async () => {
        set({ loading: true });
        try {
          const storedState = await AsyncStorage.getItem("auth-storage");
          if (storedState) {
            const { state } = JSON.parse(storedState);
            set({
              token: state.token,
              refreshToken: state.refreshToken,
              name: state.name,
              email: state.email,
              loading: false,
            });
          } else {
            set({ loading: false }); 
          }
        } catch (error) {
          console.error("Failed to load token from storage:", error);
          set({ loading: false, token: null, refreshToken: null });
        }
      },

      logout: () => {
         set({
          token: null,
          refreshToken: null,
          name: null,
          email: null
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
