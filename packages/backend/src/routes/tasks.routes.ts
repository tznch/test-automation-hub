import type { FastifyInstance, FastifyReply } from 'fastify';
import { taskQueue } from '../services/task.service.js';
import { authenticate } from '../middleware/auth.js';

export default async function taskRoutes(fastify: FastifyInstance) {
  // Create a new task
  fastify.post<{
    Body: {
      name: string;
      duration?: number;
    };
  }>('/tasks', {
    preHandler: authenticate,
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          duration: { type: 'integer', minimum: 1000, maximum: 30000 },
        },
      },
    },
    handler: async (request, reply) => {
      const { name, duration = 5000 } = request.body;
      const task = taskQueue.createTask(name, duration);
      return reply.code(201).send(task);
    },
  });

  // Get all tasks
  fastify.get('/tasks', {
    preHandler: authenticate,
    handler: async (request, reply) => {
      const tasks = taskQueue.getAllTasks();
      return reply.send(tasks);
    },
  });

  // Get task by ID
  fastify.get<{
    Params: { id: string };
  }>('/tasks/:id', {
    preHandler: authenticate,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const task = taskQueue.getTask(id);

      if (!task) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Task not found',
        });
      }

      return reply.send(task);
    },
  });

  // Poll task status (SSE)
  fastify.get<{
    Params: { id: string };
  }>('/tasks/:id/stream', {
    preHandler: authenticate,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const task = taskQueue.getTask(id);

      if (!task) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Task not found',
        });
      }

      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      const sendUpdate = () => {
        const currentTask = taskQueue.getTask(id);
        if (currentTask) {
          reply.raw.write(`data: ${JSON.stringify(currentTask)}\n\n`);

          if (currentTask.status === 'completed' || currentTask.status === 'failed') {
            reply.raw.end();
          }
        } else {
          reply.raw.end();
        }
      };

      // Send initial status
      sendUpdate();

      // Send updates every 500ms
      const interval = setInterval(sendUpdate, 500);

      request.raw.on('close', () => {
        clearInterval(interval);
      });
    },
  });

  // Delete task
  fastify.delete<{
    Params: { id: string };
  }>('/tasks/:id', {
    preHandler: authenticate,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const deleted = taskQueue.deleteTask(id);

      if (!deleted) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Task not found',
        });
      }

      return reply.code(204).send();
    },
  });

  // SSE endpoint for server events
  fastify.get('/events', {
    handler: async (request, reply) => {
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      let counter = 0;

      const sendEvent = () => {
        counter++;
        const event = {
          id: counter,
          timestamp: new Date().toISOString(),
          type: 'ping',
          message: `Event ${counter}`,
        };
        reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
      };

      // Send event every 2 seconds
      const interval = setInterval(sendEvent, 2000);

      // Send initial event
      sendEvent();

      request.raw.on('close', () => {
        clearInterval(interval);
      });
    },
  });
}
