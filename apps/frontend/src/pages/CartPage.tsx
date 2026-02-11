import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';

export default function CartPage(): JSX.Element {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-accent text-sm font-bold uppercase tracking-wider">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
            <h1 className="text-display-sm font-black text-primary tracking-tighter mt-2">
              YOUR CART
            </h1>
          </div>
          <Link
            to="/products"
            className="text-primary-400 hover:text-primary text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.variantId}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
