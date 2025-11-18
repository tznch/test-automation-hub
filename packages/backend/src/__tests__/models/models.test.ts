import { describe, it, expect, beforeAll } from 'vitest';
import { userModel } from '../../models/user.model.js';
import { itemModel } from '../../models/item.model.js';
import { orderModel } from '../../models/order.model.js';

describe('Database Models', () => {
  beforeAll(async () => {
    // Models are initialized when the database is initialized
  });

  describe('User Model', () => {
    it('should find user by email', () => {
      const user = userModel.findByEmail('admin@playwright-hub.dev');
      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@playwright-hub.dev');
    });

    it('should return all users', () => {
      const users = userModel.findAll();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should find user by id', () => {
      const adminUser = userModel.findByEmail('admin@playwright-hub.dev');
      expect(adminUser).toBeDefined();
      const user = userModel.findById(adminUser!.id);
      expect(user).toBeDefined();
      expect(user?.id).toBe(adminUser!.id);
    });

    it('should create a new user', () => {
      const timestamp = Date.now();
      const newUser = userModel.create({
        username: `testuser_model_${timestamp}`,
        email: `testuser_model_${timestamp}@example.com`,
        password: 'hashedpassword',
        role: 'user',
      });
      expect(newUser).toBeDefined();
      expect(newUser.id).toBeDefined();
      expect(newUser.username).toBe(`testuser_model_${timestamp}`);
    });
  });

  describe('Item Model', () => {
    it('should return all items', () => {
      const result = itemModel.findAll();
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('should return all items with pagination', () => {
      const result = itemModel.findAll({ page: 1, limit: 10 });
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(Array.isArray(result.items)).toBe(true);
      expect(typeof result.total).toBe('number');
    });

    it('should find item by id', () => {
      const item = itemModel.findById(1);
      expect(item).toBeDefined();
      expect(item?.id).toBe(1);
    });

    it('should create a new item', () => {
      const newItem = itemModel.create({
        name: 'Test Item',
        description: 'Test Description',
        price: 10.99,
        category: 'test',
      });
      expect(newItem).toBeDefined();
      expect(newItem.id).toBeDefined();
      expect(newItem.name).toBe('Test Item');
    });
  });

  describe('Order Model', () => {
    it('should return all orders', () => {
      const orders = orderModel.findAll();
      expect(Array.isArray(orders)).toBe(true);
    });

    it('should find order by id', () => {
      // Create an order first
      const adminUser = userModel.findByEmail('admin@playwright-hub.dev');
      expect(adminUser).toBeDefined();
      const newOrder = orderModel.create({
        userId: adminUser!.id,
        items: [{ itemId: 1, quantity: 1, price: 29.99 }],
      });
      expect(newOrder).toBeDefined();

      const order = orderModel.findById(newOrder.id);
      expect(order).toBeDefined();
      expect(order?.id).toBe(newOrder.id);
    });

    it('should create a new order', () => {
      const adminUser = userModel.findByEmail('admin@playwright-hub.dev');
      expect(adminUser).toBeDefined();
      const newOrder = orderModel.create({
        userId: adminUser!.id,
        items: [{ itemId: 1, quantity: 2, price: 10.99 }],
      });
      expect(newOrder).toBeDefined();
      expect(newOrder.id).toBeDefined();
      expect(newOrder.userId).toBe(adminUser!.id);
    });
  });
});
