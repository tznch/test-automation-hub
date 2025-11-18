import { describe, it, expect, beforeAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import itemRoutes from '../../routes/items.routes.js';

describe('Items Routes', () => {
  let app: FastifyInstance;
  let adminToken: string;

  beforeAll(async () => {
    app = Fastify();
    await app.register(fastifyJwt, {
      secret: 'test-secret-key',
    });
    await app.register(itemRoutes, { prefix: '/items' });
    await app.ready();

    // Generate admin token for testing
    adminToken = app.jwt.sign({
      id: 1,
      username: 'admin',
      email: 'admin@playwright-hub.dev',
      role: 'admin',
    });
  });

  describe('GET /items', () => {
    it('should return list of items', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('items');
      expect(Array.isArray(body.items)).toBe(true);
      expect(body).toHaveProperty('total');
    });

    it('should support pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items?page=1&limit=5',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.items.length).toBeLessThanOrEqual(5);
    });

    it('should support category filtering', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items?category=electronics',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.items)).toBe(true);
    });
  });

  describe('GET /items/:id', () => {
    it('should return item by id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items/1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id', 1);
      expect(body).toHaveProperty('name');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/items/99999',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/items',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          name: 'Test Item',
          description: 'A test item',
          price: 29.99,
          category: 'Electronics',
          stock: 10,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.name).toBe('Test Item');
    });

    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/items',
        payload: {
          name: 'Test Item',
          price: 29.99,
          category: 'Electronics',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 400 for invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/items',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          name: '',
          price: -10,
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /items/:id', () => {
    it('should update an item', async () => {
      // First create an item
      const createResponse = await app.inject({
        method: 'POST',
        url: '/items',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          name: 'Item to Update',
          price: 19.99,
          category: 'Books',
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const createdItem = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: 'PATCH',
        url: `/items/${createdItem.id}`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          name: 'Updated Item',
          price: 24.99,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.name).toBe('Updated Item');
      expect(body.price).toBe(24.99);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/items/99999',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          name: 'Test',
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /items/:id', () => {
    it('should delete an item', async () => {
      // First create an item
      const createResponse = await app.inject({
        method: 'POST',
        url: '/items',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          name: 'Item to Delete',
          price: 9.99,
          category: 'Test',
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const createdItem = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: 'DELETE',
        url: `/items/${createdItem.id}`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(204);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/items/99999',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
