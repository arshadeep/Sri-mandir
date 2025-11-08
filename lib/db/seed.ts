import { getCollection, Collections } from './mongodb';

const blessingsData = [
  {
    deity: 'ganesha',
    text_en: 'May clarity and new beginnings guide your path today.',
    tone: 'calm',
    active: true,
  },
  {
    deity: 'ganesha',
    text_en: 'May obstacles dissolve and wisdom illuminate your journey.',
    tone: 'clarity',
    active: true,
  },
  {
    deity: 'hanuman',
    text_en: 'May courage and strength protect you through every challenge.',
    tone: 'strength',
    active: true,
  },
  {
    deity: 'hanuman',
    text_en: 'May devotion and fearlessness empower your actions today.',
    tone: 'strength',
    active: true,
  },
  {
    deity: 'shiva',
    text_en: 'May peace and inner strength bring you tranquility today.',
    tone: 'calm',
    active: true,
  },
  {
    deity: 'shiva',
    text_en: 'May detachment and wisdom guide your choices today.',
    tone: 'calm',
    active: true,
  },
  {
    deity: 'durga',
    text_en: 'May resilience and confidence empower you in all you do.',
    tone: 'strength',
    active: true,
  },
  {
    deity: 'durga',
    text_en: 'May divine protection surround you with grace and strength.',
    tone: 'strength',
    active: true,
  },
  {
    deity: 'krishna',
    text_en: 'May joy and compassion fill your heart today.',
    tone: 'joy',
    active: true,
  },
  {
    deity: 'krishna',
    text_en: 'May love and wisdom guide your every action today.',
    tone: 'joy',
    active: true,
  },
  {
    deity: null,
    text_en: 'May divine grace guide and protect you throughout your day.',
    tone: 'calm',
    active: true,
  },
  {
    deity: null,
    text_en: 'May your actions today bring harmony and positive outcomes.',
    tone: 'calm',
    active: true,
  },
  {
    deity: null,
    text_en: 'May peace and clarity be with you in every moment.',
    tone: 'calm',
    active: true,
  },
];

/**
 * Seed the blessings collection with initial data
 */
export async function seedBlessings() {
  try {
    const blessingsCollection = await getCollection(Collections.BLESSINGS);

    // Check if blessings already exist
    const count = await blessingsCollection.countDocuments();

    if (count === 0) {
      await blessingsCollection.insertMany(blessingsData);
      console.log('✅ Seeded blessings data successfully');
      return { success: true, count: blessingsData.length };
    } else {
      console.log('ℹ️ Blessings already exist, skipping seed');
      return { success: true, count: 0, message: 'Already seeded' };
    }
  } catch (error) {
    console.error('❌ Error seeding blessings:', error);
    throw error;
  }
}

/**
 * Initialize all database seeds
 */
export async function initializeDatabase() {
  console.log('Initializing database...');

  try {
    await seedBlessings();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
