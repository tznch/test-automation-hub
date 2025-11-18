import type { FastifyRequest, FastifyReply } from 'fastify';

interface LatencyConfig {
  enabled: boolean;
  minDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  excludePaths?: string[];
}

const defaultConfig: LatencyConfig = {
  enabled: false,
  minDelay: 100,
  maxDelay: 2000,
  excludePaths: ['/api/health'],
};

let config = { ...defaultConfig };

export function configureLatencySimulation(newConfig: Partial<LatencyConfig>) {
  config = { ...config, ...newConfig };
}

export function getLatencyConfig() {
  return { ...config };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function latencySimulationMiddleware(request: FastifyRequest, reply: FastifyReply) {
  // Check for forced delay via query param
  const forceDelay = request.query as { _delay?: string };

  if (forceDelay._delay) {
    const delayMs = parseInt(forceDelay._delay, 10);
    if (!isNaN(delayMs) && delayMs > 0 && delayMs <= 10000) {
      request.log.info({ msg: 'Applying forced delay', delayMs });
      await delay(delayMs);
      return;
    }
  }

  // Skip if disabled or path is excluded
  if (!config.enabled) return;

  const path = request.url.split('?')[0];
  if (config.excludePaths?.some((excludePath) => path.startsWith(excludePath))) {
    return;
  }

  // Apply random delay
  const delayMs = getRandomDelay(config.minDelay, config.maxDelay);

  request.log.info({
    msg: 'Simulating latency',
    delayMs,
    path: request.url,
  });

  await delay(delayMs);
}
