export const DEITIES = [
  { id: 'ganesha', name: 'Ganesha', nameHindi: 'गणेश', color: '#FF6B35' },
  { id: 'hanuman', name: 'Hanuman', nameHindi: 'हनुमान', color: '#FF4500' },
  { id: 'shiva', name: 'Shiva', nameHindi: 'शिव', color: '#4169E1' },
  { id: 'durga', name: 'Durga', nameHindi: 'दुर्गा', color: '#DC143C' },
  { id: 'krishna', name: 'Krishna', nameHindi: 'कृष्ण', color: '#1E90FF' },
];

// Multiple images per deity for carousel
export const DEITY_IMAGES: { [key: string]: string[] } = {
  ganesha: [
    'https://images.unsplash.com/photo-1617693612355-1d93aeaf0e26',
    'https://images.unsplash.com/photo-1617694276915-762d9749e6f7',
    'https://images.unsplash.com/photo-1599833476317-1ef3e7b4d7a9',
    'https://images.unsplash.com/photo-1617693612293-23d2a4387cc8',
  ],
  hanuman: [
    'https://images.unsplash.com/photo-1646680563452-5032e4d6587f',
    'https://images.unsplash.com/photo-1689079565334-0aee5b0160c3',
    'https://images.pexels.com/photos/16397388/pexels-photo-16397388.jpeg',
    'https://images.pexels.com/photos/13716105/pexels-photo-13716105.jpeg',
  ],
  shiva: [
    'https://images.unsplash.com/photo-1637630414497-a306a1adcac5',
    'https://images.pexels.com/photos/30373285/pexels-photo-30373285.jpeg',
    'https://images.pexels.com/photos/31581083/pexels-photo-31581083.jpeg',
  ],
  durga: [
    'https://images.unsplash.com/photo-1728974617202-6af1be44672b',
    'https://images.unsplash.com/photo-1728974617227-f9a2e0daec70',
    'https://images.unsplash.com/photo-1728974617256-e3cb80d8742d',
    'https://images.pexels.com/photos/34588458/pexels-photo-34588458.jpeg',
  ],
  krishna: [
    'https://images.unsplash.com/photo-1715769244609-4569f087111f',
    'https://images.unsplash.com/photo-1641730259879-ad98e7db7bcb',
    'https://images.pexels.com/photos/2462023/pexels-photo-2462023.jpeg',
  ],
};

export const TEMPLE_IMAGE = 'https://images.unsplash.com/photo-1572536600351-60dceb3dc083';

export const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const MILESTONES = [3, 7, 21, 40];
