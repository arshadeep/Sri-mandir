import { z } from 'zod';

// User schemas
export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phone_or_email: z.string().optional().nullable(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone_or_email: z.string().optional().nullable(),
  created_at: z.string(),
});

// Preferences schemas
export const preferencesCreateSchema = z.object({
  user_id: z.string(),
  primary_deity: z.string().min(1, 'Primary deity is required'),
  secondary_deities: z.array(z.string()).default([]),
  reminder_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').default('06:30'),
  soundscape_default_on: z.boolean().default(true),
  soundscape_type: z.string().default('temple_bells'),
  weekday_mapping_enabled: z.boolean().default(true),
});

export const preferencesSchema = preferencesCreateSchema.extend({
  id: z.string().optional(),
});

// Streak schemas
export const streakInfoSchema = z.object({
  user_id: z.string(),
  current_streak: z.number().int().min(0).default(0),
  longest_streak: z.number().int().min(0).default(0),
  last_completed_date: z.string().nullable().optional(),
  grace_used_in_window: z.boolean().default(false),
  window_start_date: z.string().nullable().optional(),
});

// Ritual History schemas
export const ritualHistoryCreateSchema = z.object({
  user_id: z.string(),
  date: z.string(),
  completed: z.boolean().default(true),
  steps_completed: z.number().int().min(0).max(8).default(5),
  deity_used: z.string(),
  soundscape_on: z.boolean(),
  duration_sec: z.number().int().min(0),
});

export const ritualHistorySchema = ritualHistoryCreateSchema.extend({
  id: z.string(),
});

// Blessing schema
export const blessingSchema = z.object({
  id: z.string(),
  deity: z.string().nullable().optional(),
  text_en: z.string(),
  tone: z.string(),
  active: z.boolean().default(true),
});

// Onboarding schema
export const onboardingDataSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phone_or_email: z.string().optional(),
  primary_deity: z.string().min(1, 'Primary deity is required'),
  secondary_deities: z.array(z.string()).max(3, 'Maximum 3 secondary deities allowed').default([]),
  reminder_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  soundscape_default_on: z.boolean().default(true),
});

// API Request/Response schemas
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});

export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
  });

// Type exports from schemas
export type UserCreate = z.infer<typeof userCreateSchema>;
export type User = z.infer<typeof userSchema>;
export type PreferencesCreate = z.infer<typeof preferencesCreateSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type StreakInfo = z.infer<typeof streakInfoSchema>;
export type RitualHistoryCreate = z.infer<typeof ritualHistoryCreateSchema>;
export type RitualHistory = z.infer<typeof ritualHistorySchema>;
export type Blessing = z.infer<typeof blessingSchema>;
export type OnboardingData = z.infer<typeof onboardingDataSchema>;
