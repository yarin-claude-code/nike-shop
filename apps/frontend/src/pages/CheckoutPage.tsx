import { useState } from 'react';
import { useCartStore } from '../stores/cartStore';

export default function CheckoutPage(): JSX.Element {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Checkout functionality coming soon!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-primary mb-4">
                Shipping Address
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-600 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-600 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-600 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-600 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-600 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-accent hover:bg-accent-600 disabled:bg-accent-200 text-white font-medium py-4 px-4 rounded-lg transition-colors mt-6"
                >
                  {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-bold text-primary mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || '/placeholder-shoe.jpg'}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-primary truncate">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-primary-400">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-primary-200 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-400">Subtotal</span>
                  <span className="font-medium text-primary">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400">Shipping</span>
                  <span className="font-medium text-primary">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400">Tax</span>
                  <span className="font-medium text-primary">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-primary-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-bold text-primary">
                      Total
                    </span>
                    <span className="text-base font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
