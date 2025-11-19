import { useState } from 'react';

interface User {
  id: number;
  username: string;
  role: string;
}

// interface AuthResponse {
//   token: string;
//   user: {
//     id: number;
//     username: string;
//     email: string;
//   };
// }

export default function ApiAuthentication() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API login
    setTimeout(() => {
      if (username && password) {
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: username, role: 'admin', exp: Date.now() + 3600000 }))}.signature`;
        const mockUser = { id: 1, username, role: 'admin' };
        
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('auth_token', mockToken);
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setApiResponse(null);
    localStorage.removeItem('auth_token');
  };

  const fetchProtectedData = async () => {
    setLoading(true);
    setApiResponse(null);
    setError(null);

    // Simulate protected API call
    setTimeout(() => {
      if (token) {
        setApiResponse(JSON.stringify({
          status: 'success',
          data: {
            secret: 'This is protected data only visible with a valid token',
            timestamp: new Date().toISOString(),
            user: user?.username
          }
        }, null, 2));
      } else {
        setError('401 Unauthorized: No token provided');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">API Authentication</h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          ℹ️ This challenge simulates JWT authentication. Login to get a token, then use it to access protected data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Login Panel */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {token ? 'Authenticated Session' : 'Login'}
          </h3>

          {!token ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  data-testid="username-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  data-testid="password-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors disabled:opacity-50"
                data-testid="login-button"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-300 font-medium">Logged in as {user?.username}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Role: {user?.role}</p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current Token</label>
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs font-mono break-all text-gray-600 dark:text-gray-300" data-testid="token-display">
                  {token}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
                data-testid="logout-button"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* API Request Panel */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Protected Endpoint</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 font-mono text-sm">
              <span className="text-purple-600 dark:text-purple-400">GET</span> /api/protected/data
            </div>

            <button
              onClick={fetchProtectedData}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50"
              data-testid="make-request-button"
            >
              {loading ? 'Fetching...' : 'Fetch Protected Data'}
            </button>

            {apiResponse && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Response (200 OK)</label>
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto" data-testid="response-display">
                  {apiResponse}
                </pre>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200 dark:border-red-800" data-testid="error-message">
                <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testing Hints */}
      <div className="mt-6 bg-indigo-900/20 border border-indigo-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Login and store JWT token from response</li>
          <li>
            • Add Authorization header:{' '}
            <code className="bg-gray-800 px-1 rounded">Bearer &lt;token&gt;</code>
          </li>
          <li>• Test 401 without token, 403 with invalid token</li>
          <li>
            • Use <code className="bg-gray-800 px-1 rounded">page.request.storageState()</code> to
            persist auth
          </li>
        </ul>
      </div>
    </div>
  );
}
