import type { FastifyInstance } from 'fastify';
import { itemModel } from '../models/item.model.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function itemRoutes(fastify: FastifyInstance) {
  // Get all items (with pagination, filtering, sorting)
  fastify.get<{
    Querystring: {
      page?: number;
      limit?: number;
      category?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    };
  }>('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
          category: { type: 'string' },
          sort: { type: 'string', enum: ['id', 'name', 'price', 'category', 'stock'] },
          order: { type: 'string', enum: ['asc', 'desc'] },
        },
      },
    },
    handler: async (request, reply) => {
      const { page, limit, category, sort, order } = request.query;
      const result = itemModel.findAll({ page, limit, category, sort, order });
      return reply.send(result);
    },
  });

  // Get item by ID
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
      const item = itemModel.findById(id);

      if (!item) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Item not found',
        });
      }

      return reply.send(item);
    },
  });

  // Get categories
  fastify.get('/categories/list', async (request, reply) => {
    const categories = itemModel.getCategories();
    return reply.send({ categories });
  });

  // Create item (admin only)
  fastify.post<{
    Body: {
      name: string;
      description?: string;
      price: number;
      category: string;
      stock?: number;
      imageUrl?: string;
    };
  }>('/', {
    preHandler: requireRole('admin', 'moderator'),
    schema: {
      body: {
        type: 'object',
        required: ['name', 'price', 'category'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 255 },
          description: { type: 'string', maxLength: 1000 },
          price: { type: 'number', minimum: 0 },
          category: { type: 'string', minLength: 1, maxLength: 100 },
          stock: { type: 'integer', minimum: 0 },
          imageUrl: { type: 'string', maxLength: 500 },
        },
      },
    },
    handler: async (request, reply) => {
      const item = itemModel.create(request.body);
      return reply.code(201).send(item);
    },
  });

  // Update item (admin/moderator only)
  fastify.patch<{
    Params: { id: number };
    Body: {
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      stock?: number;
      imageUrl?: string;
    };
  }>('/:id', {
    preHandler: requireRole('admin', 'moderator'),
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
          name: { type: 'string', minLength: 1, maxLength: 255 },
          description: { type: 'string', maxLength: 1000 },
          price: { type: 'number', minimum: 0 },
          category: { type: 'string', minLength: 1, maxLength: 100 },
          stock: { type: 'integer', minimum: 0 },
          imageUrl: { type: 'string', maxLength: 500 },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const item = itemModel.update(id, request.body);

      if (!item) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Item not found',
        });
      }

      return reply.send(item);
    },
  });

  // Delete item (admin only)
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
      const deleted = itemModel.delete(id);

      if (!deleted) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Item not found',
        });
      }

      return reply.code(204).send();
    },
  });
}
