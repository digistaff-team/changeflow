import { create } from 'zustand';
import type { User } from '@/types';
import { mockUsers } from '@/data/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: User['role']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) {
      set({ user: found, isAuthenticated: true });
      return true;
    }
    // Default login: pick first user matching or admin
    const defaultUser = mockUsers[0];
    set({ user: defaultUser, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  switchRole: (role) => {
    const roleUser = mockUsers.find(u => u.role === role);
    if (roleUser) set({ user: roleUser, isAuthenticated: true });
  },
}));
