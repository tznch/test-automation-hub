import { beforeAll, afterAll } from 'vitest';
import { initializeDatabase, db } from '../db/database.js';
import { seedDatabase } from '../db/seed.js';

beforeAll(async () => {
  // Initialize test database
  initializeDatabase();
  // Seed with test data only once
  await seedDatabase();
});

afterAll(() => {
  // Close database connection
  db.close();
});
