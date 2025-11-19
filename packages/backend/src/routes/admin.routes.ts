import type { FastifyInstance } from 'fastify';
import { configureErrorInjection, getErrorInjectionConfig } from '../middleware/errorInjection.js';
import { configureLatencySimulation, getLatencyConfig } from '../middleware/latencySimulation.js';
import {
  configureRateLimit,
  getRateLimitConfig,
  clearRateLimitStore,
} from '../middleware/rateLimit.js';
import {
  getRequestLogs,
  clearRequestLogs,
  enableRequestLogging,
} from '../middleware/requestLogger.js';

export default async function adminRoutes(fastify: FastifyInstance) {
  // Get all middleware configurations
  fastify.get('/admin/config', async (_request, _reply) => {
    return {
      errorInjection: getErrorInjectionConfig(),
      latencySimulation: getLatencyConfig(),
      rateLimit: getRateLimitConfig(),
    };
  });

  // Configure error injection
  fastify.post('/admin/config/error-injection', async (request, _reply) => {
    const config = request.body as Record<string, unknown>;
    configureErrorInjection(config);
    return { success: true, config: getErrorInjectionConfig() };
  });

  // Configure latency simulation
  fastify.post('/admin/config/latency', async (request, _reply) => {
    const config = request.body as Record<string, unknown>;
    configureLatencySimulation(config);
    return { success: true, config: getLatencyConfig() };
  });

  // Configure rate limiting
  fastify.post('/admin/config/rate-limit', async (request, _reply) => {
    const config = request.body as Record<string, unknown>;
    configureRateLimit(config);
    return { success: true, config: getRateLimitConfig() };
  });

  // Clear rate limit store
  fastify.post('/admin/rate-limit/clear', async (_request, _reply) => {
    clearRateLimitStore();
    return { success: true, message: 'Rate limit store cleared' };
  });

  // Enable/disable request logging
  fastify.post('/admin/logging/toggle', async (request, _reply) => {
    const { enabled } = request.body as { enabled: boolean };
    enableRequestLogging(enabled);
    return { success: true, enabled };
  });

  // Get request logs with filters
  fastify.get('/admin/logs', async (request, _reply) => {
    const query = request.query as {
      limit?: string;
      offset?: string;
      userId?: string;
      method?: string;
      path?: string;
      minDuration?: string;
    };

    const logs = getRequestLogs({
      limit: query.limit ? parseInt(query.limit) : 100,
      offset: query.offset ? parseInt(query.offset) : 0,
      userId: query.userId ? parseInt(query.userId) : undefined,
      method: query.method,
      path: query.path,
      minDuration: query.minDuration ? parseInt(query.minDuration) : undefined,
    });

    return { logs, count: logs.length };
  });

  // Clear all request logs
  fastify.delete('/admin/logs', async (_request, _reply) => {
    clearRequestLogs();
    return { success: true, message: 'Request logs cleared' };
  });

  // Health check endpoint
  fastify.get('/admin/health', async (_request, _reply) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  });
}
