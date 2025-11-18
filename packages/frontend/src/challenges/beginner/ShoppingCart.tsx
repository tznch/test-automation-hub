import { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function ShoppingCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Keyboard', price: 79 },
    { id: 4, name: 'Monitor', price: 299 },
  ];

  const addToCart = (product: { id: number; name: string; price: number }) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Products</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-indigo-600">${product.price}</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                  data-testid={`add-to-cart-${product.id}`}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
              {itemCount > 0 && (
                <span
                  className="ml-2 bg-indigo-600 text-white text-sm px-2 py-1 rounded-full"
                  data-testid="cart-badge"
                >
                  {itemCount}
                </span>
              )}
            </h2>
          </div>

          {cart.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  data-testid={`cart-item-${item.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                      data-testid={`remove-${item.id}`}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                        data-testid={`decrease-${item.id}`}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white"
                        data-testid={`quantity-${item.id}`}
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                        data-testid={`increase-${item.id}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-indigo-600" data-testid="cart-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
