# Blueprint: Shopping Cart

## Goal

Create a full shopping cart experience with item management, quantity updates, and checkout flow.

## Inputs Required

- cart_store: Zustand store from `04-react-frontend-setup.md`
- user_auth: optional authenticated user

## Skills Reference

- `senior-fullstack-skill.md` - React patterns, state management
- `postgres-database-skill.md` - Cart data persistence

## Cart Features

1. View cart items
2. Update quantities
3. Remove items
4. Calculate totals (subtotal, tax, shipping)
5. Persist cart (localStorage)
6. Sync with backend (authenticated users)

## Steps

### 1. Create Cart Page

`src/pages/CartPage.tsx`:
```typescript
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
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.variantId} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. Create Cart Item Component

`src/components/cart/CartItem.tsx`:
```typescript
import { useCartStore } from '../../stores/cartStore';
import QuantitySelector from '../ui/QuantitySelector';

interface CartItemProps {
  item: {
    variantId: number;
    productId: number;
    productName: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    imageUrl: string;
  };
}

export default function CartItem({ item }: CartItemProps): JSX.Element {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity < 1) {
      removeItem(item.variantId);
    } else {
      updateQuantity(item.variantId, newQuantity);
    }
  };

  return (
    <div className="card p-6 flex gap-6">
      {/* Product Image */}
      <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.imageUrl || '/placeholder-shoe.jpg'}
          alt={item.productName}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-slate-900 truncate">
              {item.productName}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Size: {item.size} | Color: {item.color}
            </p>
          </div>
          <p className="font-bold text-slate-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector
            quantity={item.quantity}
            onChange={handleQuantityChange}
            max={10}
          />
          <button
            onClick={() => removeItem(item.variantId)}
            className="text-sm text-slate-500 hover:text-red-500 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3. Create Quantity Selector

`src/components/ui/QuantitySelector.tsx`:
```typescript
interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps): JSX.Element {
  return (
    <div className="flex items-center border border-slate-200 rounded-md">
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= min}
        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-12 text-center font-medium text-slate-900">
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
```

### 4. Create Cart Summary

`src/components/cart/CartSummary.tsx`:
```typescript
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08; // 8% tax

export default function CartSummary(): JSX.Element {
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const freeShippingRemaining = SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="card p-6 sticky top-24">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

      {/* Free Shipping Progress */}
      {freeShippingRemaining > 0 && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-700">
            Add <span className="font-bold">${freeShippingRemaining.toFixed(2)}</span> more
            for FREE shipping!
          </p>
          <div className="mt-2 h-2 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${(subtotal / SHIPPING_THRESHOLD) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Shipping</span>
          <span className="font-medium text-slate-900">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Estimated Tax</span>
          <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-base font-bold text-slate-900">Total</span>
            <span className="text-base font-bold text-slate-900">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="mt-6 block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-4 rounded-md text-center transition-colors"
      >
        Proceed to Checkout
      </Link>

      {/* Continue Shopping */}
      <Link
        to="/"
        className="mt-3 block w-full text-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        Continue Shopping
      </Link>

      {/* Payment Icons */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center mb-3">Secure Payment</p>
        <div className="flex justify-center gap-2">
          <div className="w-10 h-6 bg-slate-200 rounded" title="Visa" />
          <div className="w-10 h-6 bg-slate-200 rounded" title="Mastercard" />
          <div className="w-10 h-6 bg-slate-200 rounded" title="PayPal" />
          <div className="w-10 h-6 bg-slate-200 rounded" title="Apple Pay" />
        </div>
      </div>
    </div>
  );
}
```

### 5. Create Empty Cart Component

`src/components/cart/EmptyCart.tsx`:
```typescript
import { Link } from 'react-router-dom';

export default function EmptyCart(): JSX.Element {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👟</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-slate-600 mb-8">
          Looks like you haven't added any kicks yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
```

### 6. Backend Cart Sync (Authenticated Users)

`src/hooks/useCartSync.ts`:
```typescript
import { useEffect } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';

export function useCartSync(): void {
  const { items, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  // Sync cart to backend when user logs in
  useEffect(() => {
    if (isAuthenticated && items.length > 0) {
      syncCartToBackend(items);
    }
  }, [isAuthenticated]);

  // Load cart from backend on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromBackend();
    }
  }, [isAuthenticated]);
}

async function syncCartToBackend(items: unknown[]): Promise<void> {
  try {
    await api.post('/cart/sync', { items });
  } catch (error) {
    console.error('Failed to sync cart:', error);
  }
}

async function loadCartFromBackend(): Promise<void> {
  try {
    const response = await api.get('/cart');
    // Merge with local cart or replace
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
}
```

## Expected Output

- Cart page with item list
- Quantity adjustment controls
- Order summary with totals
- Free shipping progress bar
- Empty cart state
- Persistent cart (localStorage)

## Edge Cases

- **Item out of stock after adding**: Show warning, allow removal
- **Price changed**: Show price update notification
- **Quantity exceeds stock**: Cap at max available

## Known Issues

- **Cart sync conflicts**: Backend cart vs local cart merge strategy
- **Currency formatting**: Use Intl.NumberFormat for proper locale
