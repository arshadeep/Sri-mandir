import { DEITIES } from './constants';

/**
 * Get today's deity from the selected deities list using daily rotation
 * Uses day of year to ensure consistent daily rotation
 */
export const getTodaysDeity = (selectedDeities: string[]): string => {
  if (!selectedDeities || selectedDeities.length === 0) {
    return 'ganesha'; // Default fallback
  }

  if (selectedDeities.length === 1) {
    return selectedDeities[0];
  }

  // Get day of year (1-365)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Rotate through deities based on day of year
  const index = dayOfYear % selectedDeities.length;
  return selectedDeities[index];
};

/**
 * Get the deity name with Hindi translation
 */
export const getDeityDisplay = (deityId: string) => {
  const deity = DEITIES.find((d) => d.id === deityId);
  return (
    deity || {
      id: 'ganesha',
      name: 'Ganesha',
      nameHindi: 'गणेश',
      color: '#FF6B35',
    }
  );
};

/**
 * Get deity by ID
 */
export const getDeityById = (deityId: string) => {
  return DEITIES.find((d) => d.id === deityId) || DEITIES[0];
};

/**
 * Get all deities
 */
export const getAllDeities = () => DEITIES;
