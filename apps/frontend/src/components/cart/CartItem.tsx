import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { CartItem as CartItemType } from '../../types/product';
import QuantitySelector from '../ui/QuantitySelector';

interface CartItemProps {
  item: CartItemType;
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
      <Link
        to={`/product/${item.productId}`}
        className="w-28 h-28 bg-surface overflow-hidden flex-shrink-0 group"
      >
        <img
          src={item.imageUrl || '/placeholder-shoe.jpg'}
          alt={item.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-4">
          <div>
            <Link
              to={`/product/${item.productId}`}
              className="font-bold text-white hover:text-accent transition-colors line-clamp-1"
            >
              {item.productName}
            </Link>
            <p className="text-sm text-white/50 mt-1">
              Size: <span className="text-white/70">{item.size}</span> | Color: <span className="text-white/70">{item.color}</span>
            </p>
          </div>
          <p className="font-black text-lg text-white whitespace-nowrap">
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
            className="text-sm text-white/40 hover:text-accent transition-colors font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
