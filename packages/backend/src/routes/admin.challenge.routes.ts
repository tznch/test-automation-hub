import type { FastifyInstance } from 'fastify';
import { hashPassword } from '../utils/auth.js';

interface ChallengeUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

// In-memory storage for challenge users (resets on server restart)
let challengeUsers: ChallengeUser[] = [];
let nextId = 1;

export default async function adminChallengeRoutes(fastify: FastifyInstance) {
  // Get all challenge users
  fastify.get('/users', {
    handler: async (_request, reply) => {
      const sanitized = challengeUsers.map(({ password: _password, ...user }) => user);
      return reply.send({ users: sanitized });
    },
  });

  // Get challenge user by ID
  fastify.get<{
    Params: { id: number };
  }>('/users/:id', {
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
      const user = challengeUsers.find((u) => u.id === Number(id));

      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const { password: _password, ...sanitized } = user;
      return reply.send(sanitized);
    },
  });

  // Create challenge user
  fastify.post<{
    Body: {
      username: string;
      email: string;
      password: string;
      role?: string;
    };
  }>('/users', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, maxLength: 100 },
          role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
        },
      },
    },
    handler: async (request, reply) => {
      const { username, email, password, role = 'user' } = request.body;

      // Check if email already exists
      if (challengeUsers.some((u) => u.email === email)) {
        return reply.code(409).send({
          error: 'Conflict',
          message: 'Email already registered',
        });
      }

      // Check if username already exists
      if (challengeUsers.some((u) => u.username === username)) {
        return reply.code(409).send({
          error: 'Conflict',
          message: 'Username already taken',
        });
      }

      const hashedPassword = await hashPassword(password);
      const user: ChallengeUser = {
        id: nextId++,
        username,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString(),
      };

      challengeUsers.push(user);

      const { password: _, ...sanitized } = user;
      return reply.code(201).send(sanitized);
    },
  });

  // Update challenge user
  fastify.patch<{
    Params: { id: number };
    Body: {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    };
  }>('/users/:id', {
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
          password: { 
            anyOf: [
              { type: 'string', minLength: 6, maxLength: 100 },
              { type: 'string', maxLength: 0 }
            ]
          },
          role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;

      const userIndex = challengeUsers.findIndex((u) => u.id === Number(id));

      if (userIndex === -1) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const user = challengeUsers[userIndex];

      // Update fields (only update password if provided and not empty)
      if (updates.username) user.username = updates.username;
      if (updates.email) user.email = updates.email;
      if (updates.password && updates.password.length > 0) {
        user.password = await hashPassword(updates.password);
      }
      if (updates.role) user.role = updates.role;

      const { password: _password, ...sanitized } = user;
      return reply.send(sanitized);
    },
  });

  // Delete challenge user
  fastify.delete<{
    Params: { id: number };
  }>('/users/:id', {
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
      const initialLength = challengeUsers.length;
      challengeUsers = challengeUsers.filter((u) => u.id !== Number(id));

      if (challengeUsers.length === initialLength) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      return reply.code(204).send();
    },
  });

  // Reset challenge data (optional utility endpoint)
  fastify.post('/reset', {
    handler: async (_request, reply) => {
      challengeUsers = [];
      nextId = 1;
      return reply.send({ message: 'Challenge data reset' });
    },
  });
}
