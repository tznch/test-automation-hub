import type { FastifyInstance } from 'fastify';
import crypto from 'crypto';

// Mock OAuth providers and their configurations
const providers = {
  github: {
    id: 'github',
    name: 'GitHub',
    authUrl: '/api/oauth/github/authorize',
    tokenUrl: '/api/oauth/github/token',
  },
  google: {
    id: 'google',
    name: 'Google',
    authUrl: '/api/oauth/google/authorize',
    tokenUrl: '/api/oauth/google/token',
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    authUrl: '/api/oauth/microsoft/authorize',
    tokenUrl: '/api/oauth/microsoft/token',
  },
  mock: {
    id: 'mock',
    name: 'Mock OAuth',
    authUrl: '/api/oauth/mock/authorize',
    tokenUrl: '/api/oauth/mock/token',
  },
};

// Temporary storage for auth codes and tokens (in-memory)
const authCodes = new Map<string, { code: string; providerId: string; expiresAt: number }>();
const accessTokens = new Map<string, { token: string; providerId: string; userId: string; expiresAt: number }>();

function generateCode() {
  return crypto.randomBytes(32).toString('hex');
}

function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

// Mock user profiles
const mockUsers = {
  github: {
    id: 'gh_12345',
    name: 'John Developer',
    email: 'john@github.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=github',
    provider: 'github',
  },
  google: {
    id: 'goog_67890',
    name: 'Jane Smith',
    email: 'jane@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
    provider: 'google',
  },
  microsoft: {
    id: 'ms_24680',
    name: 'Bob Johnson',
    email: 'bob@outlook.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft',
    provider: 'microsoft',
  },
  mock: {
    id: 'mock_13579',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mock',
    provider: 'mock',
  },
};

export default async function oauthRoutes(fastify: FastifyInstance) {
  // Get available OAuth providers
  fastify.get('/providers', async (request, reply) => {
    return reply.send({
      providers: Object.values(providers),
    });
  });

  // Authorization endpoint (redirect flow)
  fastify.get<{
    Params: { provider: string };
    Querystring: { redirect_uri?: string; state?: string; response_type?: string };
  }>('/:provider/authorize', async (request, reply) => {
    const { provider } = request.params;
    const { redirect_uri, state, response_type } = request.query;

    if (!providers[provider as keyof typeof providers]) {
      return reply.code(404).send({ error: 'Provider not found' });
    }

    // Generate authorization code
    const code = generateCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    authCodes.set(code, { code, providerId: provider, expiresAt });

    // In a real OAuth flow, this would redirect to the provider's login page
    // For testing, we'll return a consent page URL that includes the code
    const callbackUrl = redirect_uri || 'http://localhost:5173/challenge/senior-16-oauth-flows';
    const params = new URLSearchParams({
      code,
      ...(state && { state }),
    });

    // Return HTML consent page for testing
    return reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OAuth Consent</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: #1a1a1a;
            color: white;
          }
          .consent-box {
            background: #2a2a2a;
            padding: 2rem;
            border-radius: 8px;
            max-width: 400px;
            text-align: center;
          }
          .provider-logo {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          button {
            margin: 0.5rem;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
          }
          .allow {
            background: #4CAF50;
            color: white;
          }
          .deny {
            background: #f44336;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="consent-box">
          <div class="provider-logo">🔐</div>
          <h2>OAuth Authorization</h2>
          <p>Mock ${provider.toUpperCase()} OAuth Provider</p>
          <p>Playwright Hub would like to:</p>
          <ul style="text-align: left; margin: 1rem 0;">
            <li>Access your profile information</li>
            <li>Read your email address</li>
          </ul>
          <button class="allow" onclick="allow()">Allow</button>
          <button class="deny" onclick="deny()">Deny</button>
        </div>
        <script>
          function allow() {
            window.location.href = '${callbackUrl}?${params.toString()}';
          }
          function deny() {
            window.location.href = '${callbackUrl}?error=access_denied';
          }
        </script>
      </body>
      </html>
    `);
  });

  // Token exchange endpoint
  fastify.post<{
    Params: { provider: string };
    Body: {
      code: string;
      grant_type: string;
      redirect_uri?: string;
    };
  }>('/:provider/token', async (request, reply) => {
    const { provider } = request.params;
    const { code, grant_type } = request.body;

    if (!providers[provider as keyof typeof providers]) {
      return reply.code(404).send({ error: 'Provider not found' });
    }

    if (grant_type !== 'authorization_code') {
      return reply.code(400).send({ error: 'Invalid grant_type' });
    }

    // Validate authorization code
    const authCode = authCodes.get(code);
    if (!authCode || authCode.providerId !== provider) {
      return reply.code(400).send({ error: 'Invalid authorization code' });
    }

    if (authCode.expiresAt < Date.now()) {
      authCodes.delete(code);
      return reply.code(400).send({ error: 'Authorization code expired' });
    }

    // Generate access token
    const accessToken = generateToken();
    const refreshToken = generateToken();
    const expiresIn = 3600; // 1 hour
    const expiresAt = Date.now() + expiresIn * 1000;

    const userId = mockUsers[provider as keyof typeof mockUsers].id;

    accessTokens.set(accessToken, {
      token: accessToken,
      providerId: provider,
      userId,
      expiresAt,
    });

    // Remove used auth code
    authCodes.delete(code);

    return reply.send({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken,
      scope: 'profile email',
    });
  });

  // Get user profile with access token
  fastify.get<{
    Params: { provider: string };
  }>('/:provider/profile', async (request, reply) => {
    const { provider } = request.params;
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const tokenData = accessTokens.get(token);

    if (!tokenData || tokenData.providerId !== provider) {
      return reply.code(401).send({ error: 'Invalid access token' });
    }

    if (tokenData.expiresAt < Date.now()) {
      accessTokens.delete(token);
      return reply.code(401).send({ error: 'Access token expired' });
    }

    const user = mockUsers[provider as keyof typeof mockUsers];
    return reply.send(user);
  });

  // Revoke token (logout)
  fastify.post<{
    Body: { token: string };
  }>('/revoke', async (request, reply) => {
    const { token } = request.body;

    if (accessTokens.has(token)) {
      accessTokens.delete(token);
      return reply.send({ success: true, message: 'Token revoked' });
    }

    return reply.code(400).send({ error: 'Invalid token' });
  });

  // OAuth callback handler (for redirect flow testing)
  fastify.get('/callback', async (request, reply) => {
    const { code, state, error } = request.query as Record<string, string>;

    if (error) {
      return reply.type('text/html').send(`
        <html>
          <body>
            <h1>OAuth Error</h1>
            <p>Error: ${error}</p>
            <a href="/challenge/senior-16-oauth-flows">Return to OAuth Challenge</a>
          </body>
        </html>
      `);
    }

    return reply.type('text/html').send(`
      <html>
        <head>
          <script>
            // Pass code to opener window and close popup
            if (window.opener) {
              window.opener.postMessage({ code: '${code}', state: '${state || ''}' }, '*');
              window.close();
            } else {
              // Redirect flow
              window.location.href = '/challenge/senior-16-oauth-flows?code=${code}${state ? '&state=' + state : ''}';
            }
          </script>
        </head>
        <body>
          <p>Redirecting...</p>
        </body>
      </html>
    `);
  });
}
