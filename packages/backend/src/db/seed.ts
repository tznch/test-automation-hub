import { db } from './database.js';
import { hashPassword } from '../utils/auth.js';

export async function seedDatabase() {
  // Check if already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    console.info('Database already seeded, skipping...');
    return;
  }

  // Seed users
  const users = [
    {
      username: 'admin',
      email: 'admin@playwright-hub.dev',
      password: await hashPassword('admin123'),
      role: 'admin',
    },
    {
      username: 'john_doe',
      email: 'john@example.com',
      password: await hashPassword('password123'),
      role: 'user',
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      password: await hashPassword('password123'),
      role: 'moderator',
    },
  ];

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (username, email, password, role)
    VALUES (@username, @email, @password, @role)
  `);

  users.forEach((user) => insertUser.run(user));
  console.info('✓ Seeded users');

  // Seed items
  const items = [
    {
      name: 'Laptop Pro 15',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      category: 'Electronics',
      stock: 25,
      image_url: '/images/laptop.jpg',
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 29.99,
      category: 'Electronics',
      stock: 100,
      image_url: '/images/mouse.jpg',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with Cherry MX switches',
      price: 149.99,
      category: 'Electronics',
      stock: 50,
      image_url: '/images/keyboard.jpg',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI and card reader',
      price: 49.99,
      category: 'Accessories',
      stock: 75,
      image_url: '/images/usb-hub.jpg',
    },
    {
      name: 'Webcam HD',
      description: '1080p webcam with auto-focus',
      price: 79.99,
      category: 'Electronics',
      stock: 40,
      image_url: '/images/webcam.jpg',
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      price: 39.99,
      category: 'Office',
      stock: 60,
      image_url: '/images/lamp.jpg',
    },
    {
      name: 'Monitor 27"',
      description: '4K IPS monitor with HDR support',
      price: 449.99,
      category: 'Electronics',
      stock: 20,
      image_url: '/images/monitor.jpg',
    },
    {
      name: 'Headphones',
      description: 'Noise-cancelling wireless headphones',
      price: 199.99,
      category: 'Audio',
      stock: 35,
      image_url: '/images/headphones.jpg',
    },
    {
      name: 'Phone Stand',
      description: 'Adjustable phone stand for desk',
      price: 19.99,
      category: 'Accessories',
      stock: 120,
      image_url: '/images/phone-stand.jpg',
    },
    {
      name: 'Cable Organizer',
      description: 'Cable management clips set of 10',
      price: 12.99,
      category: 'Accessories',
      stock: 200,
      image_url: '/images/cable-organizer.jpg',
    },
  ];

  const insertItem = db.prepare(`
    INSERT OR REPLACE INTO items (name, description, price, category, stock, image_url)
    VALUES (@name, @description, @price, @category, @stock, @image_url)
  `);

  items.forEach((item) => insertItem.run(item));
  console.info('✓ Seeded items');

  // Seed feature flags
  const flags = [
    {
      name: 'Dark Mode',
      key: 'dark_mode',
      enabled: 1,
      description: 'Enable dark mode UI',
      rollout_percentage: 100,
    },
    {
      name: 'New Checkout Flow',
      key: 'new_checkout',
      enabled: 0,
      description: 'A/B test for new checkout experience',
      rollout_percentage: 50,
    },
    {
      name: 'Advanced Search',
      key: 'advanced_search',
      enabled: 1,
      description: 'Enable advanced search filters',
      rollout_percentage: 100,
    },
    {
      name: 'Recommendations',
      key: 'recommendations',
      enabled: 0,
      description: 'Product recommendation engine',
      rollout_percentage: 25,
    },
  ];

  const insertFlag = db.prepare(`
    INSERT OR REPLACE INTO feature_flags (name, key, enabled, description, rollout_percentage)
    VALUES (@name, @key, @enabled, @description, @rollout_percentage)
  `);

  flags.forEach((flag) => insertFlag.run(flag));
  console.info('✓ Seeded feature flags');

  console.info('✓ Database seeding complete');
}
