import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Preferences, StreakInfo } from '@/lib/types';

interface UserState {
  // State
  user: User | null;
  preferences: Preferences | null;
  streak: StreakInfo | null;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setPreferences: (preferences: Preferences | null) => void;
  setStreak: (streak: StreakInfo | null) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  clearUser: () => void;

  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      preferences: null,
      streak: null,
      hasCompletedOnboarding: false,
      isLoading: false,
      _hasHydrated: false,

      // Actions
      setUser: (user) => set({ user }),
      setPreferences: (preferences) => set({ preferences }),
      setStreak: (streak) => set({ streak }),
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setIsLoading: (value) => set({ isLoading: value }),
      clearUser: () =>
        set({
          user: null,
          preferences: null,
          streak: null,
          hasCompletedOnboarding: false,
        }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'sri-mandir-storage', // localStorage key
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }),
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        streak: state.streak,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Hook to check if store has been hydrated from localStorage
export const useHasHydrated = () => {
  return useUserStore((state) => state._hasHydrated);
};
