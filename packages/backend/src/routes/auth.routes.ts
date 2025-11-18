import type { FastifyInstance } from 'fastify';
import { userModel } from '../models/user.model.js';
import { refreshTokenModel } from '../models/refreshToken.model.js';
import { verifyPassword, generateToken } from '../utils/auth.js';
import { authenticate } from '../middleware/auth.js';

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

function parseExpiration(exp: string): number {
  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match) return 15 * 60 * 1000; // default 15 minutes

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}

export default async function authRoutes(fastify: FastifyInstance) {
  // Login
  fastify.post<{
    Body: { email: string; password: string };
  }>('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;

      const user = userModel.findByEmail(email);
      if (!user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      // Generate tokens
      const accessToken = fastify.jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      const refreshToken = generateToken(64);
      const refreshExpiresAt = new Date(Date.now() + parseExpiration(REFRESH_TOKEN_EXPIRES_IN));

      refreshTokenModel.create(user.id, refreshToken, refreshExpiresAt);

      return reply.send({
        accessToken,
        refreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    },
  });

  // Refresh token
  fastify.post<{
    Body: { refreshToken: string };
  }>('/refresh', {
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { refreshToken } = request.body;

      if (!refreshTokenModel.isValid(refreshToken)) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid or expired refresh token',
        });
      }

      const tokenRecord = refreshTokenModel.findByToken(refreshToken);
      if (!tokenRecord) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Refresh token not found',
        });
      }

      const user = userModel.findById(tokenRecord.userId);
      if (!user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'User not found',
        });
      }

      // Delete old refresh token
      refreshTokenModel.deleteByToken(refreshToken);

      // Generate new tokens
      const newAccessToken = fastify.jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      const newRefreshToken = generateToken(64);
      const refreshExpiresAt = new Date(Date.now() + parseExpiration(REFRESH_TOKEN_EXPIRES_IN));

      refreshTokenModel.create(user.id, newRefreshToken, refreshExpiresAt);

      return reply.send({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    },
  });

  // Logout
  fastify.post<{
    Body: { refreshToken: string };
  }>('/logout', {
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { refreshToken } = request.body;

      refreshTokenModel.deleteByToken(refreshToken);

      return reply.send({ message: 'Logged out successfully' });
    },
  });

  // Get current user
  fastify.get('/me', {
    preHandler: authenticate,
    handler: async (request, reply) => {
      const userData = request.user as any;
      const user = userModel.findById(userData.id);

      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const { password, ...userWithoutPassword } = user;
      return reply.send(userWithoutPassword);
    },
  });

  // Cleanup expired tokens (internal endpoint)
  fastify.post('/cleanup', async (request, reply) => {
    refreshTokenModel.deleteExpired();
    return reply.send({ message: 'Expired tokens cleaned up' });
  });
}
