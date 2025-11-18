export default function ApiSchemaValidation() {
  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">API Schema Validation</h2>
        <p className="text-gray-400">Test API response schema validation with JSON Schema</p>
      </div>

      <div className="p-8 bg-gray-900 rounded text-center text-gray-400">
        <p>Component implementation coming soon...</p>
        <p className="mt-4 text-sm">
          This challenge will test JSON Schema validation, required/optional fields, and type
          checking.
        </p>
      </div>

      <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
        <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Use JSON Schema validator library (Ajv)</li>
          <li>• Define schema with required/optional fields</li>
          <li>• Test field types, formats, and patterns</li>
          <li>• Validate arrays and nested objects</li>
          <li>• Test edge cases: null, empty arrays, extra fields</li>
        </ul>
      </div>
    </div>
  );
}
