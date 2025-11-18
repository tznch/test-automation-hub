import { useState, useEffect } from 'react';
import api from '../../utils/api';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page, category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6',
        ...(category !== 'all' && { category }),
      });

      const response = await api.get<{
        items: Product[];
        total: number;
        page: number;
        totalPages: number;
      }>(`/items?${params}`);

      setProducts(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['all', 'electronics', 'clothing', 'food', 'books'];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Catalog</h2>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="category-filter"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="product-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition"
                data-testid={`product-${product.id}`}
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No products found</p>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              data-testid="prev-page"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-gray-700 dark:text-gray-300" data-testid="page-info">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
              data-testid="next-page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
