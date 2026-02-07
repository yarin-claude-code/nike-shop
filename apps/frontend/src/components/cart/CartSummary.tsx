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
      <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
        Order Summary
      </h2>

      {/* Free Shipping Progress */}
      {freeShippingRemaining > 0 && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/20">
          <p className="text-sm text-white">
            Add{' '}
            <span className="font-bold text-accent">${freeShippingRemaining.toFixed(2)}</span>{' '}
            more for FREE shipping!
          </p>
          <div className="mt-3 h-1 bg-primary-800 overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {freeShippingRemaining <= 0 && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 font-medium flex items-center gap-2">
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
          <span className="text-white/50">Subtotal</span>
          <span className="font-medium text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Shipping</span>
          <span className="font-medium text-white">
            {shipping === 0 ? (
              <span className="text-green-400">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Estimated Tax</span>
          <span className="font-medium text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-primary-700 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-white">Total</span>
            <span className="text-lg font-black text-white">
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
      <div className="mt-6 pt-6 border-t border-primary-800">
        <p className="text-xs text-white/30 text-center mb-3 uppercase tracking-wider">Secure Payment</p>
        <div className="flex justify-center gap-4">
          <span className="text-white/30 text-sm font-bold">VISA</span>
          <span className="text-white/30 text-sm font-bold">MC</span>
          <span className="text-white/30 text-sm font-bold">PAYPAL</span>
          <span className="text-white/30 text-sm font-bold">APPLEPAY</span>
        </div>
      </div>
    </div>
  );
}
