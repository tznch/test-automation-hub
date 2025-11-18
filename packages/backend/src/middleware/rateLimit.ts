import type { FastifyRequest, FastifyReply } from 'fastify';

interface RateLimitConfig {
  enabled: boolean;
  maxRequests: number; // requests per window
  windowMs: number; // time window in milliseconds
  excludePaths?: string[];
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const defaultConfig: RateLimitConfig = {
  enabled: false,
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  excludePaths: ['/api/health'],
};

let config = { ...defaultConfig };

// In-memory store: Map<userId|ip, RateLimitEntry>
const rateLimitStore = new Map<string, RateLimitEntry>();

export function configureRateLimit(newConfig: Partial<RateLimitConfig>) {
  config = { ...config, ...newConfig };
}

export function getRateLimitConfig() {
  return { ...config };
}

export function clearRateLimitStore() {
  rateLimitStore.clear();
}

function getClientKey(request: FastifyRequest): string {
  // Use user ID if authenticated, otherwise use IP address
  const userId = (request.user as { id?: number })?.id;
  if (userId) {
    return `user:${userId}`;
  }
  return `ip:${request.ip}`;
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export async function rateLimitMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Skip if disabled or path is excluded
  if (!config.enabled) return;

  const path = request.url.split('?')[0];
  if (config.excludePaths?.some((excludePath) => path.startsWith(excludePath))) {
    return;
  }

  // Clean up expired entries periodically
  if (Math.random() < 0.1) {
    cleanupExpiredEntries();
  }

  const clientKey = getClientKey(request);
  const now = Date.now();

  let entry = rateLimitStore.get(clientKey);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(clientKey, entry);
  } else {
    // Increment count
    entry.count++;

    if (entry.count > config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      request.log.warn({
        msg: 'Rate limit exceeded',
        clientKey,
        count: entry.count,
        maxRequests: config.maxRequests,
      });

      return reply
        .code(429)
        .header('Retry-After', retryAfter.toString())
        .header('X-RateLimit-Limit', config.maxRequests.toString())
        .header('X-RateLimit-Remaining', '0')
        .header('X-RateLimit-Reset', entry.resetTime.toString())
        .send({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
          limit: config.maxRequests,
          windowMs: config.windowMs,
        });
    }
  }

  // Add rate limit headers to response
  const remaining = Math.max(0, config.maxRequests - entry.count);
  reply
    .header('X-RateLimit-Limit', config.maxRequests.toString())
    .header('X-RateLimit-Remaining', remaining.toString())
    .header('X-RateLimit-Reset', entry.resetTime.toString());
}
