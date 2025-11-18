import type { FastifyInstance } from 'fastify';
import { featureFlagModel } from '../models/featureFlag.model.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export default async function featureFlagsRoutes(fastify: FastifyInstance) {
  // Get all feature flags
  fastify.get('/flags', { preHandler: authenticate }, async (request, reply) => {
    const flags = featureFlagModel.findAll();
    return reply.send({ flags });
  });

  // Get feature flag by key
  fastify.get<{
    Params: { key: string };
  }>('/flags/:key', { preHandler: authenticate }, async (request, reply) => {
    const flag = featureFlagModel.findByKey(request.params.key);

    if (!flag) {
      return reply.code(404).send({ error: 'Feature flag not found' });
    }

    return reply.send(flag);
  });

  // Check if feature is enabled for current user
  fastify.get<{
    Params: { key: string };
  }>('/flags/:key/enabled', { preHandler: authenticate }, async (request, reply) => {
    const user = request.user as any;
    const enabled = featureFlagModel.isEnabled(request.params.key, user?.id);

    return reply.send({
      key: request.params.key,
      enabled,
      userId: user?.id,
    });
  });

  // Update feature flag (admin only)
  fastify.patch<{
    Params: { key: string };
    Body: {
      enabled?: boolean;
      rolloutPercentage?: number;
    };
  }>(
    '/flags/:key',
    {
      preHandler: [authenticate, requireRole('admin')],
      schema: {
        body: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            rolloutPercentage: { type: 'integer', minimum: 0, maximum: 100 },
          },
        },
      },
    },
    async (request, reply) => {
      const { key } = request.params;
      const updates = request.body;

      const existingFlag = featureFlagModel.findByKey(key);
      if (!existingFlag) {
        return reply.code(404).send({ error: 'Feature flag not found' });
      }

      const updated = featureFlagModel.update(key, updates);

      return reply.send({
        flag: updated,
        message: 'Feature flag updated successfully',
      });
    }
  );
}
