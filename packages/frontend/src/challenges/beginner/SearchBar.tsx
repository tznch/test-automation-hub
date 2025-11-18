import { useState, useEffect } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const allItems = [
    'Apple iPhone 15',
    'Samsung Galaxy S24',
    'MacBook Pro',
    'iPad Air',
    'AirPods Pro',
    'Apple Watch',
    'Dell XPS 15',
    'Sony Headphones',
    'Kindle Paperwhite',
    'Nintendo Switch',
  ];

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Debounce search
    const timer = setTimeout(() => {
      const filtered = allItems.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Search</h2>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-3 pr-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="search-input"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              data-testid="clear-button"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {query && (
          <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div data-testid="search-results">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    data-testid={`result-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-gray-900 dark:text-white">{result}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400" data-testid="no-results">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Search Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Search is case-insensitive</li>
          <li>• Results update automatically as you type</li>
          <li>• Try searching for: "iPhone", "MacBook", "Headphones"</li>
        </ul>
      </div>
    </div>
  );
}
