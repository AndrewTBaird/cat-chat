import { db } from './index.js';
import { channels } from './schema.js';

async function seed() {
  console.log('Seeding database...');

  // Insert the 3 default channels
  const channelData = [
    { name: 'General Meowing' },
    { name: 'Kibble Reviews' },
    { name: 'Catnip Classifieds' },
  ];

  try {
    // Check if channels already exist
    const existingChannels = await db.select().from(channels);

    if (existingChannels.length > 0) {
      console.log('Channels already exist, skipping seed.');
      return;
    }

    // Insert channels
    await db.insert(channels).values(channelData);
    console.log('✓ Seeded 3 channels successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('Seed completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
