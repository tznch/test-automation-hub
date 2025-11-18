import { useState, useEffect } from 'react';

interface OAuthProvider {
  id: string;
  name: string;
  authUrl: string;
  tokenUrl: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: string;
}

export default function OAuthFlows() {
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [flowType, setFlowType] = useState<'redirect' | 'popup'>('redirect');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available OAuth providers
    fetch('http://localhost:3000/api/oauth/providers')
      .then((res) => res.json())
      .then((data) => setProviders(data.providers))
      .catch((err) => console.error('Failed to fetch providers:', err));

    // Check for OAuth callback (redirect flow)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      setError(`OAuth error: ${errorParam}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (code) {
      // Exchange code for token
      handleCodeExchange(code, 'mock'); // Default to mock provider
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Listen for popup messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data.code) {
        handleCodeExchange(event.data.code, 'mock');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogin = async (providerId: string) => {
    setLoading(true);
    setError(null);

    const redirectUri = window.location.origin + window.location.pathname;
    const state = Math.random().toString(36).substring(7);
    const authUrl = `http://localhost:3000/api/oauth/${providerId}/authorize?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&response_type=code`;

    if (flowType === 'popup') {
      // Popup flow
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl,
        'oauth_popup',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        setError('Popup blocked. Please allow popups for this site.');
        setLoading(false);
        return;
      }

      // Store provider ID for later use
      sessionStorage.setItem('oauthProvider', providerId);
    } else {
      // Redirect flow
      sessionStorage.setItem('oauthProvider', providerId);
      window.location.href = authUrl;
    }
  };

  const handleCodeExchange = async (code: string, providerId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch(
        `http://localhost:3000/api/oauth/${providerId}/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            grant_type: 'authorization_code',
            redirect_uri: window.location.origin + window.location.pathname,
          }),
        }
      );

      if (!tokenResponse.ok) {
        throw new Error('Token exchange failed');
      }

      const tokenData = await tokenResponse.json();
      setAccessToken(tokenData.access_token);

      // Store token
      sessionStorage.setItem('accessToken', tokenData.access_token);
      sessionStorage.setItem('tokenProvider', providerId);

      // Fetch user profile
      await fetchUserProfile(tokenData.access_token, providerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string, providerId: string) => {
    try {
      const profileResponse = await fetch(
        `http://localhost:3000/api/oauth/${providerId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await profileResponse.json();
      setUser(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    }
  };

  const handleLogout = async () => {
    if (accessToken) {
      try {
        await fetch('http://localhost:3000/api/oauth/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: accessToken }),
        });
      } catch (err) {
        console.error('Failed to revoke token:', err);
      }
    }

    setUser(null);
    setAccessToken(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('tokenProvider');
    sessionStorage.removeItem('oauthProvider');
  };

  const getProviderIcon = (providerId: string) => {
    const icons: Record<string, string> = {
      github: '🐙',
      google: '🔍',
      microsoft: '🪟',
      mock: '🔐',
    };
    return icons[providerId] || '🔑';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">OAuth / SSO Authentication</h1>
          <p className="text-gray-400">Test OAuth 2.0 authorization flows</p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 bg-red-900/20 border border-red-600 rounded-lg p-4"
            data-testid="error-message"
          >
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}

        {/* User Profile (if logged in) */}
        {user ? (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Logged In</h2>
              <button
                data-testid="logout-button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
              >
                Logout
              </button>
            </div>

            <div className="flex items-center gap-4" data-testid="user-profile">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full"
                data-testid="user-avatar"
              />
              <div>
                <p className="text-lg font-semibold text-white" data-testid="user-name">
                  {user.name}
                </p>
                <p className="text-gray-400" data-testid="user-email">
                  {user.email}
                </p>
                <p className="text-sm text-gray-500" data-testid="user-provider">
                  Provider: {user.provider}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-900 rounded">
              <p className="text-xs text-gray-400 mb-1">Access Token:</p>
              <p className="text-xs text-gray-300 font-mono truncate" data-testid="access-token">
                {accessToken}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Flow Type Selection */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Select OAuth Flow</h2>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="flowType"
                    value="redirect"
                    checked={flowType === 'redirect'}
                    onChange={(e) => setFlowType(e.target.value as 'redirect')}
                    data-testid="flow-redirect"
                    className="w-4 h-4"
                  />
                  <span className="text-white">Redirect Flow</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="flowType"
                    value="popup"
                    checked={flowType === 'popup'}
                    onChange={(e) => setFlowType(e.target.value as 'popup')}
                    data-testid="flow-popup"
                    className="w-4 h-4"
                  />
                  <span className="text-white">Popup Flow</span>
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {flowType === 'redirect'
                  ? 'Page will redirect to OAuth provider and back'
                  : 'OAuth provider will open in a popup window'}
              </p>
            </div>

            {/* Provider Buttons */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Sign In With</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    data-testid={`oauth-${provider.id}`}
                    onClick={() => handleLogin(provider.id)}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition"
                  >
                    <span className="text-2xl">{getProviderIcon(provider.id)}</span>
                    <span>{provider.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* OAuth Flow Explanation */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">OAuth 2.0 Flow</h2>
          <ol className="space-y-2 text-gray-300">
            <li className="flex gap-2">
              <span className="font-semibold text-indigo-400">1.</span>
              <span>User clicks sign-in button for a provider</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-indigo-400">2.</span>
              <span>App redirects to OAuth provider's authorization page</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-indigo-400">3.</span>
              <span>User grants permissions on consent screen</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-indigo-400">4.</span>
              <span>Provider redirects back with authorization code</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-indigo-400">5.</span>
              <span>App exchanges code for access token</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-indigo-400">6.</span>
              <span>App uses token to fetch user profile</span>
            </li>
          </ol>
        </div>

        {/* Testing Hints */}
        <div className="p-4 bg-indigo-900/20 border border-indigo-600 rounded">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Select flow type: redirect (full page) or popup (new window)</li>
            <li>• Click oauth-[provider] buttons to initiate authentication</li>
            <li>• Test both "Allow" and "Deny" on consent screen</li>
            <li>• Verify user profile displays after successful auth</li>
            <li>• Check access token is stored and displayed</li>
            <li>• Test logout clears session and token</li>
            <li>• For popup flow, ensure popups are not blocked</li>
            <li>• Use Playwright context.waitForEvent('page') for popup testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

