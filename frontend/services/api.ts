import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
});

export const createUser = async (name: string, phone_or_email?: string) => {
  const response = await api.post('/users', { name, phone_or_email });
  return response.data;
};

export const getUser = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const createPreferences = async (prefs: any) => {
  const response = await api.post('/preferences', prefs);
  return response.data;
};

export const getPreferences = async (userId: string) => {
  const response = await api.get(`/preferences/${userId}`);
  return response.data;
};

export const updatePreferences = async (userId: string, prefs: any) => {
  const response = await api.put(`/preferences/${userId}`, prefs);
  return response.data;
};

export const initStreak = async (userId: string) => {
  const response = await api.post(`/streaks/init?user_id=${userId}`);
  return response.data;
};

export const getStreak = async (userId: string) => {
  const response = await api.get(`/streaks/${userId}`);
  return response.data;
};

export const completeRitual = async (ritualData: any) => {
  const response = await api.post('/rituals/complete', ritualData);
  return response.data;
};

export const getRitualHistory = async (userId: string, limit = 100) => {
  const response = await api.get(`/rituals/history/${userId}`, { params: { limit } });
  return response.data;
};

export const getRandomBlessing = async (deity?: string) => {
  const params = deity ? { deity } : {};
  const response = await api.get('/blessings/random', { params });
  return response.data;
};

export const getWeekdayDeity = async () => {
  const response = await api.get('/weekday-deity');
  return response.data;
};

export default api;
