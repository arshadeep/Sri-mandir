export const DEITIES = [
  { id: 'ganesha', name: 'Ganesha', nameHindi: 'गणेश', color: '#FF6B35' },
  { id: 'hanuman', name: 'Hanuman', nameHindi: 'हनुमान', color: '#FF4500' },
  { id: 'shiva', name: 'Shiva', nameHindi: 'शिव', color: '#4169E1' },
  { id: 'durga', name: 'Durga', nameHindi: 'दुर्गा', color: '#DC143C' },
  { id: 'krishna', name: 'Krishna', nameHindi: 'कृष्ण', color: '#1E90FF' },
  { id: 'rama', name: 'Rama', nameHindi: 'राम', color: '#228B22' },
  { id: 'lakshmi', name: 'Lakshmi', nameHindi: 'लक्ष्मी', color: '#FFD700' },
  { id: 'saraswati', name: 'Saraswati', nameHindi: 'सरस्वती', color: '#FFFFFF' },
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
    'https://images.unsplash.com/photo-1655106883522-9296e0c1f4ec',
    'https://images.unsplash.com/photo-1708884534732-d4a75fb84d7e',
    'https://images.unsplash.com/photo-1696236884442-ff2cae874732',
  ],
  durga: [
    'https://images.unsplash.com/photo-1728974617202-6af1be44672b',
    'https://images.unsplash.com/photo-1728974617227-f9a2e0daec70',
    'https://images.unsplash.com/photo-1728974617256-e3cb80d8742d',
    'https://images.pexels.com/photos/34588458/pexels-photo-34588458.jpeg',
  ],
  krishna: [
    'https://images.unsplash.com/photo-1629639083646-9120347a4ff8',
    'https://images.unsplash.com/photo-1758300552382-271516e8569e',
    'https://images.pexels.com/photos/23953117/pexels-photo-23953117.jpeg',
  ],
  rama: [
    'https://images.unsplash.com/photo-1582550945154-66ea8fff25e1',
  ],
  lakshmi: [
    'https://images.unsplash.com/photo-1609619385002-f40bccc9d0d2',
  ],
  saraswati: [
    'https://images.unsplash.com/photo-1604608672516-f1b3a4e41de4',
  ],
};

export const TEMPLE_IMAGE =
  'https://customer-assets.emergentagent.com/job_srimandir/artifacts/6ayp8end_WhatsApp%20Image%202025-11-07%20at%2022.17.05_ccc76176.jpg';

export const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const MILESTONES = [3, 7, 21, 40];

// Ritual steps
export const RITUAL_STEPS = [
  { id: 'prepare', name: 'Prepare', duration: 30 },
  { id: 'breathing', name: 'Breathing', duration: 30 },
  { id: 'puja', name: 'Puja', duration: 60 },
  { id: 'darshan', name: 'Darshan', duration: 60 },
  { id: 'wisdom', name: 'Wisdom', duration: 30 },
  { id: 'blessing', name: 'Blessing', duration: 30 },
  { id: 'seva', name: 'Seva', duration: 30 },
  { id: 'closure', name: 'Closure', duration: 30 },
];

// Time range for reminders (5 AM to 9 AM)
export const REMINDER_TIME_RANGE = {
  min: '05:00',
  max: '09:00',
  default: '06:30',
};
