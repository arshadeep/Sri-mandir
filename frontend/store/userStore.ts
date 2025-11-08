import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  phone_or_email?: string;
}

interface Preferences {
  user_id: string;
  primary_deity: string;
  secondary_deities: string[];
  reminder_time: string;
  soundscape_default_on: boolean;
  soundscape_type: string;
  weekday_mapping_enabled: boolean;
}

interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

interface UserState {
  user: User | null;
  preferences: Preferences | null;
  streak: StreakInfo | null;
  hasCompletedOnboarding: boolean;
  setUser: (user: User) => void;
  setPreferences: (preferences: Preferences) => void;
  setStreak: (streak: StreakInfo) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  preferences: null,
  streak: null,
  hasCompletedOnboarding: false,
  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  setStreak: (streak) => set({ streak }),
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  clearUser: () => set({ user: null, preferences: null, streak: null, hasCompletedOnboarding: false }),
}));
