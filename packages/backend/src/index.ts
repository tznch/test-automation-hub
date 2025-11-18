import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import _fastifyStatic from '@fastify/static';
import fastifyWebsocket from '@fastify/websocket';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initializeDatabase } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import type { FastifyRequest, FastifyReply } from 'fastify';

// Conditionally import middleware based on environment
let requestLoggerMiddleware: ((request: FastifyRequest, reply: FastifyReply) => Promise<void>) | null = null;
let latencySimulationMiddleware: ((request: FastifyRequest, reply: FastifyReply) => Promise<void>) | null = null;
let errorInjectionMiddleware: ((request: FastifyRequest, reply: FastifyReply) => Promise<void>) | null = null;
let rateLimitMiddleware: ((request: FastifyRequest, reply: FastifyReply) => Promise<void>) | null = null;

// Always import rate limiting (can be disabled via config)
import { rateLimitMiddleware as rateLimit } from './middleware/rateLimit.js';
rateLimitMiddleware = rateLimit;

// Only import request logger in non-test environments
if (process.env.NODE_ENV !== 'test') {
  const { requestLoggerMiddleware: logger } = await import('./middleware/requestLogger.js');
  requestLoggerMiddleware = logger;
}

// Only import latency simulation in development with explicit enable
if (process.env.NODE_ENV === 'development' && process.env.LATENCY_SIMULATION_ENABLED === 'true') {
  const { latencySimulationMiddleware: latency } = await import(
    './middleware/latencySimulation.js'
  );
  latencySimulationMiddleware = latency;
}

// Only import error injection in development/testing with explicit enable
if (
  (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') &&
  process.env.ERROR_INJECTION_ENABLED === 'true'
) {
  const { errorInjectionMiddleware: error } = await import('./middleware/errorInjection.js');
  errorInjectionMiddleware = error;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
initializeDatabase();
await seedDatabase();

// Conditionally initialize request logger
if (process.env.NODE_ENV !== 'test') {
  const { initializeRequestLogger } = await import('./middleware/requestLogger.js');
  initializeRequestLogger();
}

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
await fastify.register(cors, {
  origin: true,
  credentials: true,
});

await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'playwright-hub-super-secret-key-change-in-production',
});

await fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

await fastify.register(fastifyWebsocket);

// Register global middleware (order matters!)
// Only register request logger in non-test environments
if (requestLoggerMiddleware) {
  fastify.addHook('onRequest', requestLoggerMiddleware);
}

// Only register latency simulation in development with explicit enable
if (latencySimulationMiddleware) {
  fastify.addHook('onRequest', latencySimulationMiddleware);
}

// Only register error injection in development/testing with explicit enable
if (errorInjectionMiddleware) {
  fastify.addHook('onRequest', errorInjectionMiddleware);
}

// Register rate limiting (can be disabled via config)
fastify.addHook('onRequest', rateLimitMiddleware);

// Register routes
await fastify.register(
  async (instance) => {
    // Health check
    instance.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // Auth routes
    const authRoutes = await import('./routes/auth.routes.js');
    instance.register(authRoutes.default, { prefix: '/auth' });

    // Items routes
    const itemRoutes = await import('./routes/items.routes.js');
    instance.register(itemRoutes.default, { prefix: '/items' });

    // Users routes
    const userRoutes = await import('./routes/users.routes.js');
    instance.register(userRoutes.default, { prefix: '/users' });

    // Orders routes
    const orderRoutes = await import('./routes/orders.routes.js');
    instance.register(orderRoutes.default, { prefix: '/orders' });

    // Chat routes (WebSocket)
    const chatRoutes = await import('./routes/chat.routes.js');
    instance.register(chatRoutes.default, { prefix: '/ws' });

    // Tasks routes (SSE)
    const taskRoutes = await import('./routes/tasks.routes.js');
    instance.register(taskRoutes.default, { prefix: '/tasks' });

    // File upload/download routes
    const fileRoutes = await import('./routes/files.routes.js');
    instance.register(fileRoutes.default, { prefix: '/files' });

    // Feature flags routes
    const flagRoutes = await import('./routes/flags.routes.js');
    instance.register(flagRoutes.default);

    // Admin routes (middleware configuration and logging)
    const adminRoutes = await import('./routes/admin.routes.js');
    instance.register(adminRoutes.default);

    // Test database endpoints (temporary - kept for backward compatibility)
    instance.get('/users-list', async () => {
      const { userModel } = await import('./models/user.model.js');
      const users = userModel.findAll();
      return users.map(({ password: _password, ...user }) => user);
    });

    instance.get('/items-list', async (request) => {
      const { itemModel } = await import('./models/item.model.js');
      const query = request.query as Record<string, string | undefined>;
      return itemModel.findAll({ 
        page: query.page ? Number(query.page) : undefined,
        limit: query.limit ? Number(query.limit) : undefined,
        category: query.category,
        sort: query.sort,
        order: query.order as 'asc' | 'desc' | undefined,
      });
    });
  },
  { prefix: '/api' }
);

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.info(`Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
