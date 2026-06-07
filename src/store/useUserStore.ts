import { create } from 'zustand';
import { User } from '@/types';
import { mockCurrentUser, mockParticipants } from '@/data/users';

type FollowUpStatus = 'pending' | 'contacted' | 'none';

interface FavoriteRecord {
  userId: string;
  activityId: string;
  addedAt: string;
  followUpStatus: FollowUpStatus;
}

interface UserState {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  favorites: string[];
  favoriteRecords: FavoriteRecord[];
  toggleFavorite: (userId: string, activityId?: string) => void;
  isFavorite: (userId: string) => boolean;
  getFavoriteByActivity: (activityId: string) => User[];
  setFollowUpStatus: (userId: string, status: FollowUpStatus) => void;
  getFollowUpStatus: (userId: string) => FollowUpStatus;
}

const initFavorites = ['1', '3', '6'];
const initFavoriteRecords: FavoriteRecord[] = [
  { userId: '1', activityId: '1', addedAt: '2天前', followUpStatus: 'pending' },
  { userId: '3', activityId: '1', addedAt: '1天前', followUpStatus: 'contacted' },
  { userId: '6', activityId: '1', addedAt: '3天前', followUpStatus: 'pending' }
];

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: mockCurrentUser,
  setCurrentUser: (user) => set({ currentUser: user }),
  updateUser: (updates) =>
    set((state) => ({
      currentUser: { ...state.currentUser, ...updates }
    })),

  favorites: initFavorites,
  favoriteRecords: initFavoriteRecords,

  toggleFavorite: (userId, activityId = '1') => {
    const state = get();
    const isFav = state.favorites.includes(userId);

    if (isFav) {
      set({
        favorites: state.favorites.filter((id) => id !== userId),
        favoriteRecords: state.favoriteRecords.filter((r) => r.userId !== userId)
      });
    } else {
      set({
        favorites: [...state.favorites, userId],
        favoriteRecords: [
          ...state.favoriteRecords,
          { userId, activityId, addedAt: '刚刚', followUpStatus: 'pending' }
        ]
      });
    }
  },

  isFavorite: (userId) => get().favorites.includes(userId),

  getFavoriteByActivity: (activityId) => {
    const records = get().favoriteRecords.filter((r) => r.activityId === activityId);
    return records
      .map((r) => mockParticipants.find((p) => p.id === r.userId))
      .filter(Boolean) as User[];
  },

  setFollowUpStatus: (userId, status) =>
    set((state) => ({
      favoriteRecords: state.favoriteRecords.map((r) =>
        r.userId === userId ? { ...r, followUpStatus: status } : r
      )
    })),

  getFollowUpStatus: (userId) => {
    const record = get().favoriteRecords.find((r) => r.userId === userId);
    return record?.followUpStatus || 'none';
  }
}));
