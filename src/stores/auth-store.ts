import { create } from 'zustand';
import type { User } from '@/types';
import { api } from '@/lib/api';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/lib/auth-token';
import { useAppStore } from '@/stores/app-store';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: User['role']) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  login: async (email: string) => {
    try {
      const { token, user } = await api.login(email);
      setAuthToken(token);
      set({ user, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },
  logout: () => {
    clearAuthToken();
    useAppStore.getState().reset();
    set({ user: null, isAuthenticated: false });
  },
  switchRole: async (role) => {
    const { user, token } = await api.switchRole(role);
    if (token) {
      setAuthToken(token);
    }
    set({ user, isAuthenticated: true });
  },
  initializeAuth: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ isInitializing: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const { user } = await api.me(token);
      set({ user, isAuthenticated: true, isInitializing: false });
    } catch {
      clearAuthToken();
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },
}));
