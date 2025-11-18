import { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export default function EcommerceCheckout() {
  const [step, setStep] = useState(1);
  const [cart] = useState<CartItem[]>([
    { id: 1, name: 'Wireless Headphones', price: 129.99, quantity: 1, image: '🎧' },
    { id: 2, name: 'Smart Watch', price: 299.99, quantity: 1, image: '⌚' },
  ]);
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US',
  });
  const [payment, setPayment] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping_cost = 15.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping_cost + tax - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(subtotal * 0.2);
    } else {
      alert('Invalid promo code');
    }
  };

  const handleSubmit = async () => {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order Confirmed!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">Thank you for your purchase, {shipping.fullName}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Order total: ${total.toFixed(2)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          A confirmation email has been sent to {shipping.email}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="mb-8 flex justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  data-testid={`step-${s}`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              data-testid="shipping-step"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      data-testid="fullName"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      data-testid="email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                    data-testid="address"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      data-testid="city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      data-testid="zipCode"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                    <select
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      data-testid="country"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md"
                data-testid="continue-to-payment"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              data-testid="payment-step"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                    data-testid="cardNumber"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                    data-testid="cardName"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={payment.expiryDate}
                      onChange={(e) => setPayment({ ...payment, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      data-testid="expiryDate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
                      data-testid="cvv"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-3 rounded-md text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                  data-testid="back-to-shipping"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md"
                  data-testid="continue-to-review"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              data-testid="review-step"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Review Order</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shipping To:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {shipping.fullName}
                    <br />
                    {shipping.address}
                    <br />
                    {shipping.city}, {shipping.zipCode}
                    <br />
                    {shipping.country}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Method:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Card ending in {payment.cardNumber.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-3 rounded-md text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                  data-testid="back-to-payment"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md"
                  data-testid="place-order"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3" data-testid={`cart-item-${item.id}`}>
                  <div className="text-3xl">{item.image}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                  data-testid="promo-code"
                />
                <button
                  onClick={applyPromo}
                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-4 py-2 rounded-md text-sm text-gray-900 dark:text-white"
                  data-testid="apply-promo"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Promo applied: -${discount.toFixed(2)}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">${shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 dark:text-green-400">Discount</span>
                  <span className="text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white" data-testid="order-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
