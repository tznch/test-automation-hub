import { describe, it, expect, beforeAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import userRoutes from '../../routes/users.routes.js';
import { userModel } from '../../models/user.model.js';

describe('Users Routes', () => {
  let app: FastifyInstance;
  let adminToken: string;

  beforeAll(async () => {
    app = Fastify();
    await app.register(fastifyJwt, {
      secret: 'test-secret-key',
    });
    await app.register(userRoutes, { prefix: '/users' });
    await app.ready();

    // Generate admin token for testing
    adminToken = app.jwt.sign({
      id: 1,
      username: 'admin',
      email: 'admin@playwright-hub.dev',
      role: 'admin',
    });
  });

  describe('GET /users', () => {
    it('should return list of users with admin token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 403 for non-admin user', async () => {
      const userToken = app.jwt.sign({
        id: 2,
        username: 'user',
        email: 'user@example.com',
        role: 'user',
      });

      const response = await app.inject({
        method: 'GET',
        url: '/users',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      // Get the admin user ID dynamically
      const adminUser = userModel.findByEmail('admin@playwright-hub.dev');
      expect(adminUser).toBeDefined();

      const response = await app.inject({
        method: 'GET',
        url: `/users/${adminUser!.id}`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id', adminUser!.id);
      expect(body).toHaveProperty('username');
      expect(body).toHaveProperty('email');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/99999',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'newuser_routes',
          email: 'newuser_routes@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.username).toBe('newuser_routes');
      expect(body.email).toBe('newuser_routes@example.com');
    });

    it('should return 409 for duplicate email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'anotheruser',
          email: 'admin@playwright-hub.dev', // This email already exists
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(409);
    });

    it('should return 400 for invalid data', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: '',
          email: 'invalid-email',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      // First create a user
      const createResponse = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'usertoupdate_routes',
          email: 'usertoupdate_routes@example.com',
          password: 'password123',
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const createdUser = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: 'PATCH',
        url: `/users/${createdUser.id}`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          username: 'updateduser_routes',
          email: 'updateduser_routes@example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.username).toBe('updateduser_routes');
      expect(body.email).toBe('updateduser_routes@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/users/99999',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
        payload: {
          username: 'test',
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      // First create a user
      const createResponse = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'usertodelete',
          email: 'delete@example.com',
          password: 'password123',
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const createdUser = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: 'DELETE',
        url: `/users/${createdUser.id}`,
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(204);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/users/99999',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
