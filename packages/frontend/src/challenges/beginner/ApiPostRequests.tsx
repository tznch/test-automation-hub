import { useState } from 'react';

interface NewItem {
  name: string;
  price: number;
  category: string;
}

interface CreatedItem extends NewItem {
  id: number;
  createdAt: string;
}

export default function ApiPostRequests() {
  const [formData, setFormData] = useState<NewItem>({
    name: '',
    price: 0,
    category: 'Electronics',
  });
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [createdItem, setCreatedItem] = useState<CreatedItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreatedItem(null);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setStatusCode(response.status);

      if (response.status === 201) {
        const data = await response.json();
        setCreatedItem(data);
        // Reset form on success
        setFormData({ name: '', price: 0, category: 'Electronics' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create item');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testInvalidData = async () => {
    setLoading(true);
    setError(null);
    setCreatedItem(null);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: '' }), // Invalid: missing required fields
      });

      setStatusCode(response.status);
      const errorData = await response.json();
      setError(errorData.message || 'Validation error');
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API POST Requests</h2>
        <p className="text-gray-400">Test API POST requests for creating resources</p>
      </div>

      {/* Create Item Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">📝 Create New Item</h3>

        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Item Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="e.g., Wireless Headphones"
              required
              data-testid="item-name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Price (USD) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              min="0"
              step="0.01"
              required
              data-testid="item-price"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
              data-testid="item-category"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white rounded transition-colors"
            data-testid="submit-button"
          >
            {loading ? 'Creating...' : 'Create Item'}
          </button>

          <button
            type="button"
            onClick={testInvalidData}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white rounded transition-colors"
            data-testid="test-error-button"
          >
            Test Error
          </button>
        </div>
      </form>

      {/* Response Status */}
      {statusCode !== null && (
        <div
          className={`mb-6 p-4 rounded ${
            statusCode === 201
              ? 'bg-green-900/30 border border-green-600'
              : 'bg-red-900/30 border border-red-600'
          }`}
        >
          <span className="text-sm font-semibold text-gray-300">Status Code: </span>
          <span
            className={`font-bold ${statusCode === 201 ? 'text-green-400' : 'text-red-400'}`}
            data-testid="status-code"
          >
            {statusCode}
          </span>
          <span className="text-sm text-gray-400 ml-2">
            {statusCode === 201 ? '(Created)' : statusCode === 400 ? '(Bad Request)' : ''}
          </span>
        </div>
      )}

      {/* Success Result */}
      {createdItem && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-600 rounded">
          <h3 className="text-sm font-semibold text-green-400 mb-2">
            ✅ Item Created Successfully
          </h3>
          <div
            className="bg-gray-900 p-3 rounded font-mono text-sm text-gray-300"
            data-testid="created-item"
          >
            <div>
              <span className="text-gray-500">ID:</span> {createdItem.id}
            </div>
            <div>
              <span className="text-gray-500">Name:</span> {createdItem.name}
            </div>
            <div>
              <span className="text-gray-500">Price:</span> ${createdItem.price.toFixed(2)}
            </div>
            <div>
              <span className="text-gray-500">Category:</span> {createdItem.category}
            </div>
            <div>
              <span className="text-gray-500">Created:</span>{' '}
              {new Date(createdItem.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Error Result */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded">
          <h3 className="text-sm font-semibold text-red-400 mb-2">❌ Error</h3>
          <div className="text-sm text-gray-300" data-testid="error-message">
            {error}
          </div>
        </div>
      )}

      {/* Testing Hints */}
      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            • Use{' '}
            <code className="bg-gray-800 px-1 rounded">
              page.request.post('/api/items', &#123; data &#125;)
            </code>
          </li>
          <li>
            • Set header:{' '}
            <code className="bg-gray-800 px-1 rounded">Content-Type: application/json</code>
          </li>
          <li>
            • Assert <code className="bg-gray-800 px-1 rounded">response.status() === 201</code>
          </li>
          <li>• Verify created resource in response body</li>
          <li>• Test with missing required fields (should return 400)</li>
        </ul>
      </div>
    </div>
  );
}
