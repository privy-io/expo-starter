import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
  setUser: (user: User | null) => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        isLoading: false,
        isAuthenticated: false,

        // Actions
        login: async (credentials) => {
          set({ isLoading: true });
          try {
            // TODO: Replace with actual auth service call
            const mockUser: User = {
              id: '1',
              email: credentials.email,
              name: 'John Doe',
            };
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          set({ user: null, isAuthenticated: false });
        },

        updateProfile: (profile) => {
          const { user } = get();
          if (user) {
            set({ user: { ...user, ...profile } });
          }
        },

        setUser: (user) => {
          set({ user, isAuthenticated: !!user });
        },

        hydrate: () => {
          // Called when store is rehydrated from storage
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ user: state.user }), // Only persist user data
      }
    ),
    { name: 'auth-store' }
  )
);