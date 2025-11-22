import { useState, useEffect } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function ApiGetRequests() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items?limit=${limit}&offset=${offset}`);
      setStatusCode(response.status);

      if (response.ok) {
        const data = await response.json();
        setItems(data.items || data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [limit, offset]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API GET Requests</h2>
        <p className="text-gray-400">Test basic API GET requests and response validation</p>
      </div>

      {/* API Controls */}
      <div className="bg-gray-900 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">🔧 Request Parameters</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Limit (items per page)</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              min="1"
              max="50"
              data-testid="limit-input"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Offset (pagination)</label>
            <input
              type="number"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              min="0"
              data-testid="offset-input"
            />
          </div>
        </div>

        <button
          onClick={fetchItems}
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded transition-colors"
          data-testid="fetch-button"
        >
          {loading ? 'Loading...' : 'Fetch Items'}
        </button>
      </div>

      {/* Response Status */}
      {statusCode !== null && (
        <div
          className={`mb-6 p-4 rounded ${statusCode === 200 ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'}`}
        >
          <span className="text-sm font-semibold text-gray-300">Status Code: </span>
          <span
            className={`font-bold ${statusCode === 200 ? 'text-green-400' : 'text-red-400'}`}
            data-testid="status-code"
          >
            {statusCode}
          </span>
        </div>
      )}

      {/* Items List */}
      <div className="bg-gray-900 p-4 rounded">
        <h3 className="text-lg font-semibold text-white mb-4">📦 Items ({items.length})</h3>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No items found</div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-800 rounded flex justify-between items-center"
                data-testid={`item-${item.id}`}
              >
                <div>
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-gray-400">{item.category}</div>
                </div>
                <div className="text-indigo-400 font-bold">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testing Hints */}
      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            • Use <code className="bg-gray-800 px-1 rounded">page.request.get('/api/items')</code>{' '}
            for API calls
          </li>
          <li>
            • Assert <code className="bg-gray-800 px-1 rounded">response.status() === 200</code>
          </li>
          <li>
            • Parse JSON with <code className="bg-gray-800 px-1 rounded">response.json()</code>
          </li>
          <li>
            • Test query parameters:{' '}
            <code className="bg-gray-800 px-1 rounded">?limit=5&offset=10</code>
          </li>
          <li>• Compare API data with UI elements</li>
        </ul>
      </div>
    </div>
  );
}
