import { create } from 'zustand';
import { User } from '@/types';
import { mockCurrentUser } from '@/data/users';

interface UserState {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  favorites: string[];
  toggleFavorite: (userId: string) => void;
  isFavorite: (userId: string) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: mockCurrentUser,
  setCurrentUser: (user) => set({ currentUser: user }),
  updateUser: (updates) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...updates }
    })),
  favorites: ['1', '3', '6'],
  toggleFavorite: (userId) =>
    set((state) => ({
      favorites: state.favorites.includes(userId)
        ? state.favorites.filter((id) => id !== userId)
        : [...state.favorites, userId]
    })),
  isFavorite: (userId) => get().favorites.includes(userId)
}));
