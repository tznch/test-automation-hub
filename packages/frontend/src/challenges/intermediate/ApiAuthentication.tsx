export default function ApiAuthentication() {
  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API Authentication</h2>
        <p className="text-gray-400">Test API authentication with tokens and protected endpoints</p>
      </div>

      <div className="p-8 bg-gray-900 rounded text-center text-gray-400">
        <p>Component implementation coming soon...</p>
        <p className="mt-4 text-sm">
          This challenge will test JWT authentication, Bearer tokens, 401/403 responses, and token
          refresh.
        </p>
      </div>

      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
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
