import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  requestBody?: any;
  responses: {
    [code: string]: {
      description: string;
      schema?: any;
    };
  };
  parameters?: Array<{
    name: string;
    in: string;
    required: boolean;
    type: string;
    description: string;
  }>;
}

const apiEndpoints: Record<string, Endpoint[]> = {
  Authentication: [
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate user and receive JWT token',
      requestBody: {
        email: 'string (required)',
        password: 'string (required)',
      },
      responses: {
        '200': {
          description: 'Success',
          schema: {
            token: 'string',
            user: { id: 'number', email: 'string', name: 'string' },
          },
        },
        '401': { description: 'Invalid credentials' },
      },
    },
    {
      method: 'POST',
      path: '/api/auth/register',
      description: 'Register new user account',
      requestBody: {
        email: 'string (required)',
        password: 'string (required)',
        name: 'string (required)',
      },
      responses: {
        '201': {
          description: 'User created',
          schema: { id: 'number', email: 'string', name: 'string' },
        },
        '400': { description: 'Validation error' },
      },
    },
    {
      method: 'GET',
      path: '/api/auth/me',
      description: 'Get current authenticated user',
      responses: {
        '200': {
          description: 'Success',
          schema: { id: 'number', email: 'string', name: 'string', role: 'string' },
        },
        '401': { description: 'Not authenticated' },
      },
    },
  ],
  Items: [
    {
      method: 'GET',
      path: '/api/items',
      description: 'Get list of items with pagination',
      parameters: [
        {
          name: 'limit',
          in: 'query',
          required: false,
          type: 'number',
          description: 'Items per page (default: 10)',
        },
        {
          name: 'offset',
          in: 'query',
          required: false,
          type: 'number',
          description: 'Pagination offset (default: 0)',
        },
        {
          name: 'category',
          in: 'query',
          required: false,
          type: 'string',
          description: 'Filter by category',
        },
      ],
      responses: {
        '200': {
          description: 'Success',
          schema: [
            {
              id: 'number',
              name: 'string',
              price: 'number',
              category: 'string',
              inStock: 'boolean',
            },
          ],
        },
      },
    },
    {
      method: 'POST',
      path: '/api/items',
      description: 'Create new item',
      requestBody: {
        name: 'string (required)',
        price: 'number (required)',
        category: 'string (required)',
        description: 'string (optional)',
      },
      responses: {
        '201': {
          description: 'Item created',
          schema: {
            id: 'number',
            name: 'string',
            price: 'number',
            category: 'string',
            createdAt: 'string',
          },
        },
        '400': { description: 'Validation error' },
      },
    },
    {
      method: 'GET',
      path: '/api/items/:id',
      description: 'Get single item by ID',
      parameters: [
        { name: 'id', in: 'path', required: true, type: 'number', description: 'Item ID' },
      ],
      responses: {
        '200': {
          description: 'Success',
          schema: {
            id: 'number',
            name: 'string',
            price: 'number',
            category: 'string',
            inStock: 'boolean',
          },
        },
        '404': { description: 'Item not found' },
      },
    },
    {
      method: 'PUT',
      path: '/api/items/:id',
      description: 'Update item (full update)',
      requestBody: {
        name: 'string (required)',
        price: 'number (required)',
        category: 'string (required)',
      },
      responses: {
        '200': {
          description: 'Item updated',
          schema: {
            id: 'number',
            name: 'string',
            price: 'number',
            category: 'string',
            updatedAt: 'string',
          },
        },
        '404': { description: 'Item not found' },
      },
    },
    {
      method: 'PATCH',
      path: '/api/items/:id',
      description: 'Update item (partial update)',
      requestBody: {
        name: 'string (optional)',
        price: 'number (optional)',
        category: 'string (optional)',
      },
      responses: {
        '200': { description: 'Item updated' },
        '404': { description: 'Item not found' },
      },
    },
    {
      method: 'DELETE',
      path: '/api/items/:id',
      description: 'Delete item',
      responses: {
        '204': { description: 'Item deleted' },
        '404': { description: 'Item not found' },
      },
    },
  ],
  Users: [
    {
      method: 'GET',
      path: '/api/users',
      description: 'Get list of users (admin only)',
      responses: {
        '200': {
          description: 'Success',
          schema: [{ id: 'number', email: 'string', name: 'string', role: 'string' }],
        },
        '403': { description: 'Forbidden - Admin only' },
      },
    },
    {
      method: 'GET',
      path: '/api/users/:id',
      description: 'Get user by ID',
      responses: {
        '200': {
          description: 'Success',
          schema: {
            id: 'number',
            email: 'string',
            name: 'string',
            role: 'string',
            createdAt: 'string',
          },
        },
        '404': { description: 'User not found' },
      },
    },
  ],
  Orders: [
    {
      method: 'GET',
      path: '/api/orders',
      description: 'Get user orders',
      responses: {
        '200': {
          description: 'Success',
          schema: [
            {
              id: 'number',
              items: 'array',
              total: 'number',
              status: 'string',
              createdAt: 'string',
            },
          ],
        },
      },
    },
    {
      method: 'POST',
      path: '/api/orders',
      description: 'Create new order',
      requestBody: {
        items: 'array (required)',
        shippingAddress: 'object (required)',
      },
      responses: {
        '201': { description: 'Order created' },
        '400': { description: 'Validation error' },
      },
    },
  ],
  Files: [
    {
      method: 'POST',
      path: '/api/files/upload',
      description: 'Upload file',
      requestBody: {
        file: 'multipart/form-data (required)',
      },
      responses: {
        '200': {
          description: 'File uploaded',
          schema: { filename: 'string', size: 'number', url: 'string' },
        },
        '400': { description: 'Invalid file' },
      },
    },
  ],
  'Feature Flags': [
    {
      method: 'GET',
      path: '/api/flags',
      description: 'Get feature flags',
      responses: {
        '200': {
          description: 'Success',
          schema: { flagName: 'boolean' },
        },
      },
    },
  ],
};

export default function ApiDocsPage() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-500 text-white',
    POST: 'bg-green-500 text-white',
    PUT: 'bg-orange-500 text-white',
    PATCH: 'bg-teal-500 text-white',
    DELETE: 'bg-red-500 text-white',
  };

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoint(expandedEndpoint === key ? null : key);
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">API Documentation</h1>
        <p className="text-gray-700 dark:text-gray-400 text-lg">
          Complete API reference for Test Automation Hub backend endpoints
        </p>
      </div>

      {/* Base URL */}
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Base URL</h2>
        <code className="text-indigo-600 dark:text-indigo-400 text-lg">http://localhost:3000</code>
      </div>

      {/* Endpoints by Category */}
      <div className="space-y-8">
        {Object.entries(apiEndpoints).map(([category, endpoints]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{category}</h2>
            <div className="space-y-2">
              {endpoints.map((endpoint, index) => {
                const endpointKey = `${category}-${index}`;
                const isExpanded = expandedEndpoint === endpointKey;

                return (
                  <div
                    key={endpointKey}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    {/* Collapsible Header */}
                    <button
                      onClick={() => toggleEndpoint(endpointKey)}
                      className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                    >
                      <span
                        className={`${methodColors[endpoint.method]} px-3 py-1 rounded font-semibold text-xs min-w-[70px] text-center`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="flex-1 text-gray-900 dark:text-gray-200 font-mono text-sm">
                        {endpoint.path}
                      </code>
                      <svg
                        className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-6">
                        {/* Description */}
                        <div>
                          <p className="text-gray-700 dark:text-gray-300">{endpoint.description}</p>
                        </div>

                        {/* Parameters */}
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-3">
                              Parameters
                            </h4>
                            <div className="space-y-2">
                              {endpoint.parameters.map((param, i) => (
                                <div
                                  key={i}
                                  className="bg-gray-50 dark:bg-gray-900 rounded p-3 border border-gray-200 dark:border-gray-700"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <code className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                      {param.name}
                                    </code>
                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                                      {param.in}
                                    </span>
                                    {param.required && (
                                      <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                                        required
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {param.type}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {param.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {endpoint.requestBody && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-3">
                              Request Body
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 border border-gray-200 dark:border-gray-700">
                              <pre className="text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
                                {JSON.stringify(endpoint.requestBody, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Responses */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-3">
                            Responses
                          </h4>
                          <div className="space-y-3">
                            {Object.entries(endpoint.responses).map(([code, response]) => (
                              <div
                                key={code}
                                className="bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
                              >
                                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                  <span
                                    className={`font-semibold ${
                                      code.startsWith('2')
                                        ? 'text-green-600 dark:text-green-400'
                                        : code.startsWith('4')
                                          ? 'text-yellow-600 dark:text-yellow-400'
                                          : 'text-red-600 dark:text-red-400'
                                    }`}
                                  >
                                    {code}
                                  </span>
                                  <span className="text-gray-700 dark:text-gray-400 text-sm">
                                    {response.description}
                                  </span>
                                </div>
                                {response.schema && (
                                  <div className="p-4">
                                    <pre className="text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
                                      {JSON.stringify(response.schema, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
