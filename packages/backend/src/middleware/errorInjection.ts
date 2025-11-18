import type { FastifyRequest, FastifyReply } from 'fastify';

interface ErrorInjectionConfig {
  enabled: boolean;
  errorRate: number; // 0-100 percentage
  allowedErrors: number[];
  excludePaths?: string[];
}

const defaultConfig: ErrorInjectionConfig = {
  enabled: false,
  errorRate: 5,
  allowedErrors: [400, 401, 403, 404, 500, 503],
  excludePaths: ['/api/auth/login', '/api/auth/refresh'],
};

let config = { ...defaultConfig };

const errorMessages: Record<number, string> = {
  400: 'Bad Request - Simulated error for testing',
  401: 'Unauthorized - Simulated authentication error',
  403: 'Forbidden - Simulated permission error',
  404: 'Not Found - Simulated resource not found',
  500: 'Internal Server Error - Simulated server error',
  503: 'Service Unavailable - Simulated service outage',
};

export function configureErrorInjection(newConfig: Partial<ErrorInjectionConfig>) {
  config = { ...config, ...newConfig };
}

export function getErrorInjectionConfig() {
  return { ...config };
}

export async function errorInjectionMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Check if error injection is enabled via query param or config
  const forceError = request.query as { _injectError?: string; _errorCode?: string };

  if (forceError._injectError === 'true' && forceError._errorCode) {
    const errorCode = parseInt(forceError._errorCode, 10);
    if (config.allowedErrors.includes(errorCode)) {
      return reply.code(errorCode).send({
        error: errorMessages[errorCode] || 'Simulated error',
        injected: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Skip if disabled or path is excluded
  if (!config.enabled) return;

  const path = request.url.split('?')[0];
  if (config.excludePaths?.some((excludePath) => path.startsWith(excludePath))) {
    return;
  }

  // Random error injection based on error rate
  const shouldInjectError = Math.random() * 100 < config.errorRate;

  if (shouldInjectError) {
    const randomErrorCode =
      config.allowedErrors[Math.floor(Math.random() * config.allowedErrors.length)];

    request.log.warn({
      msg: 'Injecting random error',
      errorCode: randomErrorCode,
      path: request.url,
    });

    return reply.code(randomErrorCode).send({
      error: errorMessages[randomErrorCode] || 'Simulated error',
      injected: true,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
