import { useState, useEffect } from 'react';
import Ajv from 'ajv';
// @ts-ignore - Type mismatch between ajv and ajv-formats versions
import addFormats from 'ajv-formats';

// @ts-ignore
const ajv = new Ajv({ allErrors: true });
// @ts-ignore
addFormats(ajv);

interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  description: string;
}

interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
  }>;
}

// JSON Schemas for validation
const schemas = {
  user: {
    type: 'object',
    required: ['id', 'email', 'name'],
    properties: {
      id: { type: 'number' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string', minLength: 1 },
      age: { type: 'number', minimum: 0, maximum: 150 },
      isActive: { type: 'boolean' },
      roles: { type: 'array', items: { type: 'string' } },
      profile: {
        type: 'object',
        properties: {
          bio: { type: 'string' },
          location: { type: 'string' },
          website: { type: 'string', format: 'uri' },
        },
      },
      createdAt: { type: 'string', format: 'date-time' },
    },
    additionalProperties: false,
  },
  product: {
    type: 'object',
    required: ['id', 'name', 'price'],
    properties: {
      id: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      price: { type: 'number', minimum: 0 },
      inStock: { type: 'boolean' },
      categories: { type: 'array', items: { type: 'string' } },
      specifications: {
        type: 'object',
        properties: {
          brand: { type: 'string' },
          model: { type: 'string' },
          warranty: { type: 'number' },
        },
      },
      tags: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
  },
  order: {
    type: 'object',
    required: ['orderId', 'customerId', 'status', 'total', 'items'],
    properties: {
      orderId: { type: 'string', pattern: '^ORD-' },
      customerId: { type: 'number' },
      status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered'] },
      total: { type: 'number', minimum: 0 },
      items: {
        type: 'array',
        minItems: 0,
        items: {
          type: 'object',
          required: ['productId', 'name', 'quantity', 'price'],
          properties: {
            productId: { type: 'number' },
            name: { type: 'string' },
            quantity: { type: 'number', minimum: 1 },
            price: { type: 'number', minimum: 0 },
          },
        },
      },
      shipping: {
        type: 'object',
        required: ['address', 'city', 'zipCode'],
        properties: {
          address: { type: 'string' },
          city: { type: 'string' },
          zipCode: { type: 'string' },
          country: { type: 'string' },
        },
      },
      createdAt: { type: 'string', format: 'date-time' },
    },
    additionalProperties: false,
  },
  settings: {
    type: 'object',
    required: ['userId', 'theme', 'language'],
    properties: {
      userId: { type: 'number' },
      theme: { type: 'string', enum: ['light', 'dark'] },
      language: { type: 'string', pattern: '^[a-z]{2}-[A-Z]{2}$' },
      notifications: {
        type: 'object',
        properties: {
          email: { type: 'boolean' },
          push: { type: 'boolean' },
          sms: { type: 'boolean' },
        },
      },
      privacy: {
        type: 'object',
        properties: {
          profileVisible: { type: 'boolean' },
          showEmail: { type: 'boolean' },
        },
      },
      phoneNumber: { type: 'string', pattern: '^\\+?[0-9-]+$' },
      timezone: { type: 'string' },
    },
    additionalProperties: false,
  },
};

const variants = [
  { value: 'valid', label: 'Valid Response' },
  { value: 'missing-required', label: 'Missing Required Fields' },
  { value: 'wrong-type', label: 'Wrong Data Types' },
  { value: 'invalid-format', label: 'Invalid Format' },
  { value: 'extra-fields', label: 'Extra Fields' },
  { value: 'null-values', label: 'Null Values' },
  { value: 'nested-missing', label: 'Nested Missing Fields' },
  { value: 'nested-wrong-type', label: 'Nested Wrong Types' },
  { value: 'empty-items', label: 'Empty Arrays' },
  { value: 'empty-array', label: 'Empty Array Edge Case' },
  { value: 'invalid-pattern', label: 'Invalid Pattern' },
  { value: 'invalid-enum', label: 'Invalid Enum Value' },
];

export default function ApiSchemaValidation() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('user');
  const [selectedVariant, setSelectedVariant] = useState<string>('valid');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    fetch('/api/schema-test/endpoints')
      .then((res) => res.json())
      .then((data) => setEndpoints(data.endpoints))
      .catch((err) => console.error('Failed to fetch endpoints:', err));
  }, []);

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    setValidationResult(null);

    try {
      const endpoint = endpoints.find((e) => e.id === selectedEndpoint);
      if (!endpoint) return;

      const url = `/api${endpoint.path}?variant=${selectedVariant}`;
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);

      // Validate against schema
      const schema = schemas[selectedEndpoint as keyof typeof schemas];
      const validate = ajv.compile(schema);
      const valid = validate(data);

      if (!valid && validate.errors) {
        setValidationResult({
          valid: false,
          errors: validate.errors.map((err) => ({
            path: (err as any).instancePath || '/',
            message: err.message || 'Validation error',
          })),
        });
      } else {
        setValidationResult({ valid: true, errors: [] });
      }
    } catch (error) {
      console.error('Test failed:', error);
      setValidationResult({
        valid: false,
        errors: [{ path: '/', message: 'Failed to fetch or parse response' }],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API Schema Validation</h2>
        <p className="text-gray-400">Test API response schema validation with JSON Schema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Endpoint Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="endpoint-select">
            Select Endpoint
          </label>
          <select
            id="endpoint-select"
            data-testid="endpoint-select"
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {endpoints.map((endpoint) => (
              <option key={endpoint.id} value={endpoint.id}>
                {endpoint.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {endpoints.find((e) => e.id === selectedEndpoint)?.description}
          </p>
        </div>

        {/* Variant Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="variant-select">
            Select Test Variant
          </label>
          <select
            id="variant-select"
            data-testid="variant-select"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {variants.map((variant) => (
              <option key={variant.value} value={variant.value}>
                {variant.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Choose different test scenarios</p>
        </div>
      </div>

      {/* Test Button */}
      <button
        data-testid="test-button"
        onClick={handleTest}
        disabled={loading}
        className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white rounded font-medium transition"
      >
        {loading ? 'Testing...' : 'Run Validation Test'}
      </button>

      {/* Results */}
      {response && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Response Data */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">API Response</h3>
            <div
              className="bg-gray-900 rounded p-4 overflow-auto max-h-96"
              data-testid="response-data"
            >
              <pre className="text-sm text-gray-300">{JSON.stringify(response, null, 2)}</pre>
            </div>
          </div>

          {/* Validation Results */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Validation Result</h3>
            <div className="bg-gray-900 rounded p-4" data-testid="validation-result">
              {validationResult?.valid ? (
                <div className="flex items-center text-green-400">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold" data-testid="validation-status-valid">
                    ✓ Schema Validation Passed
                  </span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center text-red-400 mb-3">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold" data-testid="validation-status-failed">
                      ✗ Schema Validation Failed
                    </span>
                  </div>
                  <div className="space-y-2" data-testid="validation-errors">
                    {validationResult?.errors.map((error, idx) => (
                      <div key={idx} className="bg-red-900/20 border border-red-600 rounded p-2">
                        <p className="text-sm text-red-300">
                          <span className="font-semibold">Path:</span>{' '}
                          {error.path || '(root)'}
                        </p>
                        <p className="text-sm text-red-300">
                          <span className="font-semibold">Error:</span> {error.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Testing Hints */}
      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Select different endpoints to test various schema structures</li>
          <li>• Use test variants to verify schema validation catches errors</li>
          <li>• Verify required fields, data types, and format validations</li>
          <li>• Test nested objects and arrays validation</li>
          <li>• Check edge cases: null values, empty arrays, extra fields</li>
          <li>• Use data-testid attributes: endpoint-select, variant-select, test-button</li>
        </ul>
      </div>
    </div>
  );
}

