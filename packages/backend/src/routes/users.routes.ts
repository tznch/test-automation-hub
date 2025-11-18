import type { FastifyInstance } from 'fastify';
import { userModel } from '../models/user.model.js';
import { hashPassword } from '../utils/auth.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function userRoutes(fastify: FastifyInstance) {
  // Get all users (admin only)
  fastify.get('/', {
    preHandler: requireRole('admin'),
    handler: async (request, reply) => {
      const users = userModel.findAll();
      const sanitized = users.map(({ password, ...user }) => user);
      return reply.send(sanitized);
    },
  });

  // Get user by ID (admin or self)
  fastify.get<{
    Params: { id: number };
  }>('/:id', {
    preHandler: authenticate,
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
      const currentUser = request.user as any;

      // Users can only view their own profile unless admin
      if (currentUser.role !== 'admin' && currentUser.id !== id) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You can only view your own profile',
        });
      }

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

  // Update user (admin or self)
  fastify.patch<{
    Params: { id: number };
    Body: {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    };
  }>('/:id', {
    preHandler: authenticate,
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
      const currentUser = request.user as any;
      const updates = request.body;

      // Users can only update their own profile unless admin
      if (currentUser.role !== 'admin' && currentUser.id !== id) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You can only update your own profile',
        });
      }

      // Only admins can change roles
      if (updates.role && currentUser.role !== 'admin') {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'Only admins can change user roles',
        });
      }

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

  // Delete user (admin only)
  fastify.delete<{
    Params: { id: number };
  }>('/:id', {
    preHandler: requireRole('admin'),
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
