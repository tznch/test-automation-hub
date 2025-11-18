export default function ApiRateLimiting() {
  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API Rate Limiting</h2>
        <p className="text-gray-400">Test API rate limiting and throttling behavior</p>
      </div>

      <div className="p-8 bg-gray-900 rounded text-center text-gray-400">
        <p>Component implementation coming soon...</p>
        <p className="mt-4 text-sm">
          This challenge will test 429 status codes, rate limit headers, and retry logic.
        </p>
      </div>

      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            • Use <code className="bg-gray-800 px-1 rounded">Promise.all()</code> for concurrent
            requests
          </li>
          <li>• Assert response headers: X-RateLimit-Limit, X-RateLimit-Remaining</li>
          <li>• Verify 429 Too Many Requests status</li>
          <li>• Test Retry-After header and exponential backoff</li>
        </ul>
      </div>
    </div>
  );
}
