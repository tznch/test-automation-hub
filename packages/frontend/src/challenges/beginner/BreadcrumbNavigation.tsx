import { useState } from 'react';

interface Page {
  name: string;
  path: string;
}

const pageHierarchy: Record<string, Page[]> = {
  '/': [],
  '/products': [{ name: 'Home', path: '/' }],
  '/products/electronics': [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ],
  '/products/electronics/laptops': [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Electronics', path: '/products/electronics' },
  ],
  '/account': [{ name: 'Home', path: '/' }],
  '/account/settings': [
    { name: 'Home', path: '/' },
    { name: 'Account', path: '/account' },
  ],
};

const pageNames: Record<string, string> = {
  '/': 'Home',
  '/products': 'Products',
  '/products/electronics': 'Electronics',
  '/products/electronics/laptops': 'Laptops',
  '/account': 'Account',
  '/account/settings': 'Settings',
};

export default function BreadcrumbNavigation() {
  const [currentPath, setCurrentPath] = useState('/');

  const breadcrumbs = pageHierarchy[currentPath] || [];
  const currentPage = pageNames[currentPath] || 'Page';

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Breadcrumb Navigation</h1>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="bg-gray-800 p-4 rounded-lg mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((page) => (
              <li key={page.path} className="flex items-center">
                <button
                  onClick={() => setCurrentPath(page.path)}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  {page.name}
                </button>
                <span className="mx-2 text-gray-500">/</span>
              </li>
            ))}
            <li className="flex items-center">
              <span className="text-gray-300 font-medium" aria-current="page">
                {currentPage}
              </span>
            </li>
          </ol>
        </nav>

        {/* Page Content */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">{currentPage}</h2>
          <p className="text-gray-300 mb-6">
            Current path: <code className="bg-gray-700 px-2 py-1 rounded">{currentPath}</code>
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Navigate to:</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentPath('/')}
                className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-left"
              >
                🏠 Home
              </button>
              <button
                onClick={() => setCurrentPath('/products')}
                className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-left"
              >
                📦 Products
              </button>
              <button
                onClick={() => setCurrentPath('/products/electronics')}
                className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-left"
              >
                💻 Electronics
              </button>
              <button
                onClick={() => setCurrentPath('/products/electronics/laptops')}
                className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-left"
              >
                🖥️ Laptops
              </button>
              <button
                onClick={() => setCurrentPath('/account')}
                className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-left"
              >
                👤 Account
              </button>
              <button
                onClick={() => setCurrentPath('/account/settings')}
                className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-left"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
