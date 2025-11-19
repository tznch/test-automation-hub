import type { FastifyInstance } from 'fastify';
import { userModel } from '../models/user.model.js';
import { hashPassword } from '../utils/auth.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function userRoutes(fastify: FastifyInstance) {
  // Get all users (admin only)
  fastify.get('/', {
    preHandler: [authenticate, requireRole('admin', 'moderator')],
    handler: async (request, reply) => {
      const users = userModel.findAll();
      const sanitized = users.map(({ password: _password, ...user }) => user);
      return reply.send(sanitized);
    },
  });

  // Get user by ID (public for testing purposes)
  fastify.get<{
    Params: { id: number };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;

      const user = userModel.findById(id);

      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const { password, ...sanitized } = user;
      return reply.send(sanitized);
    },
  });

  // Create user (public registration)
  fastify.post<{
    Body: {
      username: string;
      email: string;
      password: string;
    };
  }>('/', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, maxLength: 100 },
        },
      },
    },
    handler: async (request, reply) => {
      const { username, email, password } = request.body;

      // Check if email already exists
      if (userModel.findByEmail(email)) {
        return reply.code(409).send({
          error: 'Conflict',
          message: 'Email already registered',
        });
      }

      // Check if username already exists
      if (userModel.findByUsername(username)) {
        return reply.code(409).send({
          error: 'Conflict',
          message: 'Username already taken',
        });
      }

      const hashedPassword = await hashPassword(password);
      const user = userModel.create({
        username,
        email,
        password: hashedPassword,
        role: 'user',
      });

      const { password: _, ...sanitized } = user;
      return reply.code(201).send(sanitized);
    },
  });

  // Update user (public for testing purposes)
  fastify.patch<{
    Params: { id: number };
    Body: {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' },
        },
      },
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, maxLength: 100 },
          role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      // Hash password if provided
      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }

      const updateData: Partial<
        Pick<import('../types/models.js').User, 'username' | 'email' | 'password' | 'role'>
      > = {};
      if (updates.username) updateData.username = updates.username;
      if (updates.email) updateData.email = updates.email;
      if (updates.password) updateData.password = updates.password;
      if (updates.role) updateData.role = updates.role as 'user' | 'admin' | 'moderator';

      const user = userModel.update(id, updateData);

      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const { password, ...sanitized } = user;
      return reply.send(sanitized);
    },
  });

  // Delete user (public for testing purposes)
  fastify.delete<{
    Params: { id: number };
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'integer' },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const deleted = userModel.delete(id);

      if (!deleted) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      return reply.code(204).send();
    },
  });
}
