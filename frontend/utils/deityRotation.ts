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
  const deityMap: { [key: string]: { name: string; nameHindi: string } } = {
    ganesha: { name: 'Ganesha', nameHindi: 'गणेश' },
    hanuman: { name: 'Hanuman', nameHindi: 'हनुमान' },
    shiva: { name: 'Shiva', nameHindi: 'शिव' },
    durga: { name: 'Durga', nameHindi: 'दुर्गा' },
    krishna: { name: 'Krishna', nameHindi: 'कृष्ण' },
  };
  
  return deityMap[deityId] || deityMap.ganesha;
};
