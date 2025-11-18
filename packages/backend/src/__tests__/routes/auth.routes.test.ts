import { describe, it, expect, beforeAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import authRoutes from '../../routes/auth.routes.js';

describe('Auth Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(fastifyJwt, {
      secret: 'test-secret-key',
    });
    await app.register(authRoutes, { prefix: '/auth' });
    await app.ready();
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'admin@playwright-hub.dev',
          password: 'admin123',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('refreshToken');
      expect(body).toHaveProperty('user');
      expect(body.user).toHaveProperty('email', 'admin@playwright-hub.dev');
    });

    it('should return 401 for invalid password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'admin@playwright-hub.dev',
          password: 'wrongpassword',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 400 for missing fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'admin@playwright-hub.dev',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      // First login to get refresh token
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'admin@playwright-hub.dev',
          password: 'admin123',
        },
      });

      expect(loginResponse.statusCode).toBe(200);
      const loginBody = JSON.parse(loginResponse.body);
      const refreshToken = loginBody.refreshToken;

      const response = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: {
          refreshToken,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('accessToken');
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        payload: {
          refreshToken: 'invalid-token',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      // First login to get refresh token
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'admin@playwright-hub.dev',
          password: 'admin123',
        },
      });

      expect(loginResponse.statusCode).toBe(200);
      const loginBody = JSON.parse(loginResponse.body);
      const refreshToken = loginBody.refreshToken;

      const response = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        payload: {
          refreshToken,
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it('should return 400 for unauthenticated request', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        payload: {},
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user with valid token', async () => {
      // First login
      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'admin@playwright-hub.dev',
          password: 'admin123',
        },
      });

      expect(loginResponse.statusCode).toBe(200);
      const loginBody = JSON.parse(loginResponse.body);
      const accessToken = loginBody.accessToken;

      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('email', 'admin@playwright-hub.dev');
      expect(body).toHaveProperty('username', 'admin');
    });

    it('should return 401 for invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });
});
