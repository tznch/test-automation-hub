import type { FastifyRequest, FastifyReply } from 'fastify';
import type { UserType } from '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      username: string;
      email: string;
      role: string;
    };
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    // User is now properly typed
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing token' });
  }
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const user = request.user;

      if (!user || !roles.includes(user.role)) {
        reply.code(403).send({
          error: 'Forbidden',
          message: `Required role: ${roles.join(' or ')}`,
        });
      }
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing token' });
    }
  };
}
