import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export default function CartSummary(): JSX.Element {
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const freeShippingRemaining = SHIPPING_THRESHOLD - subtotal;
  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-primary uppercase tracking-wider mb-6">
        Order Summary
      </h2>

      {/* Free Shipping Progress */}
      {freeShippingRemaining > 0 && (
        <div className="mb-6 p-4 bg-accent/5 border border-accent/10 rounded-xl">
          <p className="text-sm text-primary">
            Add{' '}
            <span className="font-bold text-accent">${freeShippingRemaining.toFixed(2)}</span>{' '}
            more for FREE shipping!
          </p>
          <div className="mt-3 h-1 bg-primary-200 overflow-hidden rounded-full">
            <div
              className="h-full bg-accent transition-all duration-500 rounded-full"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {freeShippingRemaining <= 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-700 font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            You've unlocked FREE shipping!
          </p>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-4 text-sm">
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
          <span className="text-primary-400">Estimated Tax</span>
          <span className="font-medium text-primary">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-primary-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-primary">Total</span>
            <span className="text-lg font-black text-primary">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="mt-6 block w-full btn-accent text-center"
      >
        Proceed to Checkout
      </Link>

      {/* Payment Icons */}
      <div className="mt-6 pt-6 border-t border-primary-200">
        <p className="text-xs text-primary-300 text-center mb-3 uppercase tracking-wider">Secure Payment</p>
        <div className="flex justify-center gap-4">
          <span className="text-primary-300 text-sm font-bold">VISA</span>
          <span className="text-primary-300 text-sm font-bold">MC</span>
          <span className="text-primary-300 text-sm font-bold">PAYPAL</span>
          <span className="text-primary-300 text-sm font-bold">APPLEPAY</span>
        </div>
      </div>
    </div>
  );
}
