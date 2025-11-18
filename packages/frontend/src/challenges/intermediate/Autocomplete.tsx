import { useState, useEffect, useRef } from 'react';

interface Country {
  code: string;
  name: string;
  capital: string;
}

const countries: Country[] = [
  { code: 'US', name: 'United States', capital: 'Washington, D.C.' },
  { code: 'GB', name: 'United Kingdom', capital: 'London' },
  { code: 'CA', name: 'Canada', capital: 'Ottawa' },
  { code: 'AU', name: 'Australia', capital: 'Canberra' },
  { code: 'DE', name: 'Germany', capital: 'Berlin' },
  { code: 'FR', name: 'France', capital: 'Paris' },
  { code: 'IT', name: 'Italy', capital: 'Rome' },
  { code: 'ES', name: 'Spain', capital: 'Madrid' },
  { code: 'JP', name: 'Japan', capital: 'Tokyo' },
  { code: 'CN', name: 'China', capital: 'Beijing' },
  { code: 'IN', name: 'India', capital: 'New Delhi' },
  { code: 'BR', name: 'Brazil', capital: 'Brasília' },
  { code: 'MX', name: 'Mexico', capital: 'Mexico City' },
  { code: 'RU', name: 'Russia', capital: 'Moscow' },
  { code: 'ZA', name: 'South Africa', capital: 'Pretoria' },
];

export default function Autocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectCountry(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country);
    setQuery(country.name);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedCountry(null);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Country Selector</h2>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search for a country</label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search..."
            className="w-full px-4 py-3 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="autocomplete-input"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              data-testid="clear-button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto z-10"
            data-testid="suggestions-dropdown"
          >
            {suggestions.map((country, index) => (
              <div
                key={country.code}
                onClick={() => selectCountry(country)}
                className={`px-4 py-3 cursor-pointer ${
                  index === selectedIndex
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                data-testid={`suggestion-${country.code}`}
              >
                <div className="font-medium text-gray-900 dark:text-white">{country.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Capital: {country.capital}</div>
              </div>
            ))}
          </div>
        )}

        {isOpen && suggestions.length === 0 && query && (
          <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 text-center text-gray-500 dark:text-gray-400">
            No countries found
          </div>
        )}
      </div>

      {/* Selected Country */}
      {selectedCountry && (
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">Selected Country</h3>
          <div className="space-y-1">
            <p className="text-green-800 dark:text-green-400">
              <strong>Name:</strong> {selectedCountry.name}
            </p>
            <p className="text-green-800 dark:text-green-400">
              <strong>Code:</strong> {selectedCountry.code}
            </p>
            <p className="text-green-800 dark:text-green-400">
              <strong>Capital:</strong> {selectedCountry.capital}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Keyboard Navigation</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>
            • <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded text-xs">↑</kbd> /{' '}
            <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded text-xs">↓</kbd> -
            Navigate suggestions
          </li>
          <li>
            • <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded text-xs">Enter</kbd>{' '}
            - Select highlighted suggestion
          </li>
          <li>
            • <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded text-xs">Esc</kbd> -
            Close dropdown
          </li>
        </ul>
      </div>
    </div>
  );
}
