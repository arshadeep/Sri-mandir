// User types
export interface UserCreate {
  name: string;
  phone_or_email?: string | null;
}

export interface User {
  id: string;
  name: string;
  phone_or_email?: string | null;
  created_at: string;
}

// Preferences types
export interface PreferencesCreate {
  user_id: string;
  primary_deity: string;
  secondary_deities: string[];
  reminder_time: string;
  soundscape_default_on: boolean;
  soundscape_type: string;
  weekday_mapping_enabled: boolean;
}

export interface Preferences extends PreferencesCreate {
  id?: string;
}

// Streak types
export interface StreakInfo {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  grace_used_in_window: boolean;
  window_start_date: string | null;
}

// Ritual History types
export interface RitualHistoryCreate {
  user_id: string;
  date: string;
  completed: boolean;
  steps_completed: number;
  deity_used: string;
  soundscape_on: boolean;
  duration_sec: number;
}

export interface RitualHistory extends RitualHistoryCreate {
  id: string;
}

// Blessing types
export interface Blessing {
  id: string;
  deity: string | null;
  text_en: string;
  tone: string;
  active: boolean;
}

// Weekday to deity mapping
export const WEEKDAY_DEITY_MAP: Record<number, string> = {
  0: 'shiva',      // Monday
  1: 'hanuman',    // Tuesday
  2: 'ganesha',    // Wednesday
  4: 'durga',      // Friday
  6: 'krishna'     // Sunday
};

// Deity types
export type DeityName =
  | 'shiva'
  | 'ganesha'
  | 'krishna'
  | 'rama'
  | 'hanuman'
  | 'durga'
  | 'lakshmi'
  | 'saraswati';

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Client-side only types
export interface OnboardingData {
  name: string;
  phone_or_email?: string;
  primary_deity: string;
  secondary_deities: string[];
  reminder_time: string;
  soundscape_default_on: boolean;
}
