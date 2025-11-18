import type { FastifyInstance } from 'fastify';
import { orderModel } from '../models/order.model.js';
import { itemModel } from '../models/item.model.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function orderRoutes(fastify: FastifyInstance) {
  // Get all orders (admin only)
  fastify.get('/', {
    preHandler: requireRole('admin'),
    handler: async (request, reply) => {
      const orders = orderModel.findAll();
      return reply.send(orders);
    },
  });

  // Get user's orders
  fastify.get('/my-orders', {
    preHandler: authenticate,
    handler: async (request, reply) => {
      const user = request.user as any;
      const orders = orderModel.findByUserId(user.id);
      return reply.send(orders);
    },
  });

  // Get order by ID
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
      const order = orderModel.findById(id);

      if (!order) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      // Users can only view their own orders unless admin
      if (currentUser.role !== 'admin' && order.userId !== currentUser.id) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You can only view your own orders',
        });
      }

      return reply.send(order);
    },
  });

  // Create order
  fastify.post<{
    Body: {
      items: { itemId: number; quantity: number }[];
    };
  }>('/', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['itemId', 'quantity'],
              properties: {
                itemId: { type: 'integer', minimum: 1 },
                quantity: { type: 'integer', minimum: 1 },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const user = request.user as any;
      const { items: orderItems } = request.body;

      // Validate items and get prices
      const itemsWithPrices = [];
      for (const orderItem of orderItems) {
        const item = itemModel.findById(orderItem.itemId);

        if (!item) {
          return reply.code(404).send({
            error: 'Not Found',
            message: `Item with ID ${orderItem.itemId} not found`,
          });
        }

        if (item.stock < orderItem.quantity) {
          return reply.code(422).send({
            error: 'Unprocessable Entity',
            message: `Insufficient stock for item: ${item.name}`,
          });
        }

        itemsWithPrices.push({
          itemId: orderItem.itemId,
          quantity: orderItem.quantity,
          price: item.price,
        });

        // Update stock
        itemModel.update(item.id, { stock: item.stock - orderItem.quantity });
      }

      const order = orderModel.create({
        userId: user.id,
        items: itemsWithPrices,
      });

      return reply.code(201).send(order);
    },
  });

  // Update order status
  fastify.patch<{
    Params: { id: number };
    Body: {
      status: 'pending' | 'processing' | 'completed' | 'cancelled';
    };
  }>('/:id/status', {
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
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'completed', 'cancelled'],
          },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body;

      const order = orderModel.updateStatus(id, status);

      if (!order) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      return reply.send(order);
    },
  });

  // Cancel order (user can cancel their own pending orders)
  fastify.post<{
    Params: { id: number };
  }>('/:id/cancel', {
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
      const order = orderModel.findById(id);

      if (!order) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      // Users can only cancel their own orders
      if (currentUser.role !== 'admin' && order.userId !== currentUser.id) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You can only cancel your own orders',
        });
      }

      // Can only cancel pending orders
      if (order.status !== 'pending') {
        return reply.code(422).send({
          error: 'Unprocessable Entity',
          message: 'Only pending orders can be cancelled',
        });
      }

      const updated = orderModel.updateStatus(id, 'cancelled');
      return reply.send(updated);
    },
  });

  // Delete order (admin only)
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
      const deleted = orderModel.delete(id);

      if (!deleted) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Order not found',
        });
      }

      return reply.code(204).send();
    },
  });
}
