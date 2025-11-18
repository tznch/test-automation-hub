import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function ApiCrudOperations() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, category: '' });
  const [operation, setOperation] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // CREATE
  const createItem = async () => {
    setOperation('CREATE');
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setStatusCode(response.status);

    if (response.status === 201) {
      const newItem = await response.json();
      setItems([...items, newItem]);
      setMessage(`Created item #${newItem.id}`);
      setFormData({ name: '', price: 0, category: '' });
    }
  };

  // READ
  const readItems = async () => {
    setOperation('READ');
    const response = await fetch('/api/items');
    setStatusCode(response.status);

    if (response.ok) {
      const data = await response.json();
      setItems(data);
      setMessage(`Retrieved ${data.length} items`);
    }
  };

  const readItem = async (id: number) => {
    setOperation('READ');
    const response = await fetch(`/api/items/${id}`);
    setStatusCode(response.status);

    if (response.ok) {
      const item = await response.json();
      setSelectedItem(item);
      setMessage(`Retrieved item #${id}`);
    } else if (response.status === 404) {
      setMessage(`Item #${id} not found (404)`);
    }
  };

  // UPDATE
  const updateItem = async (id: number) => {
    setOperation('UPDATE');
    const response = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setStatusCode(response.status);

    if (response.ok) {
      const updated = await response.json();
      setItems(items.map((item) => (item.id === id ? updated : item)));
      setMessage(`Updated item #${id}`);
      setSelectedItem(null);
      setFormData({ name: '', price: 0, category: '' });
    }
  };

  const patchItem = async (id: number, field: string, value: any) => {
    setOperation('PATCH');
    const response = await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setStatusCode(response.status);

    if (response.ok) {
      const updated = await response.json();
      setItems(items.map((item) => (item.id === id ? updated : item)));
      setMessage(`Patched item #${id} (${field})`);
    }
  };

  // DELETE
  const deleteItem = async (id: number) => {
    setOperation('DELETE');
    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });
    setStatusCode(response.status);

    if (response.status === 204 || response.ok) {
      setItems(items.filter((item) => item.id !== id));
      setMessage(`Deleted item #${id}`);
    }

    // Test 404 after deletion
    setTimeout(async () => {
      const checkResponse = await fetch(`/api/items/${id}`);
      if (checkResponse.status === 404) {
        setMessage((prev) => prev + ' (verified 404)');
      }
    }, 100);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API CRUD Operations</h2>
        <p className="text-gray-400">Test complete Create, Read, Update, Delete API operations</p>
      </div>

      {/* Operation Status */}
      {operation && statusCode !== null && (
        <div
          className={`mb-6 p-4 rounded ${
            statusCode >= 200 && statusCode < 300
              ? 'bg-green-900/30 border border-green-600'
              : 'bg-red-900/30 border border-red-600'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-white">{operation}</span>
            <span
              className={`font-bold ${
                statusCode >= 200 && statusCode < 300 ? 'text-green-400' : 'text-red-400'
              }`}
              data-testid="status-code"
            >
              {statusCode}
            </span>
          </div>
          {message && (
            <div className="text-sm text-gray-300 mt-2" data-testid="message">
              {message}
            </div>
          )}
        </div>
      )}

      {/* CREATE Form */}
      <div className="bg-gray-900 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">➕ CREATE (POST)</h3>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            data-testid="create-name"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            data-testid="create-price"
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            data-testid="create-category"
          />
        </div>

        <button
          onClick={createItem}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          data-testid="create-button"
        >
          Create Item (201)
        </button>
      </div>

      {/* READ Operations */}
      <div className="bg-gray-900 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">📖 READ (GET)</h3>

        <div className="flex gap-2">
          <button
            onClick={readItems}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            data-testid="read-all-button"
          >
            Get All Items (200)
          </button>
          <button
            onClick={() => readItem(999)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            data-testid="read-404-button"
          >
            Test 404
          </button>
        </div>
      </div>

      {/* Items List with UPDATE/DELETE */}
      <div className="bg-gray-900 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">📦 Items ({items.length})</h3>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="p-3 bg-gray-800 rounded" data-testid={`item-${item.id}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-gray-400">
                    ${item.price} • {item.category} • ID: {item.id}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setFormData({ name: item.name, price: item.price, category: item.category });
                    }}
                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded"
                    data-testid={`edit-${item.id}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                    data-testid={`delete-${item.id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {selectedItem?.id === item.id && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      data-testid={`update-name-${item.id}`}
                    />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      data-testid={`update-price-${item.id}`}
                    />
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      data-testid={`update-category-${item.id}`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateItem(item.id)}
                      className="flex-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded"
                      data-testid={`update-${item.id}`}
                    >
                      PUT (Full Update)
                    </button>
                    <button
                      onClick={() => patchItem(item.id, 'price', formData.price)}
                      className="flex-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded"
                      data-testid={`patch-${item.id}`}
                    >
                      PATCH (Price Only)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No items yet. Create one to get started!
            </div>
          )}
        </div>
      </div>

      {/* Testing Hints */}
      <div className="p-4 bg-indigo-900/20 border border-indigo-600 rounded">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>
            • CREATE: <code className="bg-gray-800 px-1 rounded">page.request.post()</code> → 201
          </li>
          <li>
            • READ: <code className="bg-gray-800 px-1 rounded">page.request.get()</code> → 200 or
            404
          </li>
          <li>
            • UPDATE: <code className="bg-gray-800 px-1 rounded">page.request.put()</code> → 200
          </li>
          <li>• PATCH: Partial update vs PUT full update</li>
          <li>
            • DELETE: <code className="bg-gray-800 px-1 rounded">page.request.delete()</code> → 204
          </li>
          <li>• Store created resource ID for subsequent operations</li>
        </ul>
      </div>
    </div>
  );
}
