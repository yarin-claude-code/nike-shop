import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductVariant } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps): JSX.Element {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.color || ''
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const availableSizes = getAvailableSizes(product.variants, selectedColor);
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.salePrice! / product.price) * 100)
    : 0;
  const isOutOfStock = selectedVariant?.stockQuantity === 0;

  const handleAddToCart = (): void => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: product.salePrice || product.price,
      imageUrl: product.images[0]?.url || '',
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = (): void => {
    if (!selectedVariant) return;
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="space-y-8">
      {/* Brand & Name */}
      <div>
        <p className="text-accent text-sm font-bold uppercase tracking-wider mb-2">
          {product.brand.name}
        </p>
        <h1 className="text-display-sm font-black text-white tracking-tighter">
          {product.name.toUpperCase()}
        </h1>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4">
        {hasDiscount ? (
          <>
            <span className="text-4xl font-black text-accent">
              ${product.salePrice?.toFixed(2)}
            </span>
            <span className="text-xl text-white/40 line-through">
              ${product.price.toFixed(2)}
            </span>
            <span className="badge-sale">
              -{discountPercent}%
            </span>
          </>
        ) : (
          <span className="text-4xl font-black text-white">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Color: <span className="text-white/50 normal-case font-normal">{selectedColor}</span>
        </h3>
        <div className="flex gap-3">
          {getUniqueColors(product.variants).map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color);
                setSelectedSize(null);
              }}
              className={`px-5 py-3 border text-sm font-bold uppercase tracking-wider transition-all ${
                selectedColor === color
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-primary-700 text-white/70 hover:border-white hover:text-white'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Select Size
          </h3>
          <button className="text-sm text-accent hover:text-accent-400 font-medium transition-colors">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {availableSizes.map(({ size, inStock }) => (
            <button
              key={size}
              onClick={() => inStock && setSelectedSize(size)}
              disabled={!inStock}
              className={`py-3 border text-sm font-bold transition-all ${
                selectedSize === size
                  ? 'border-accent bg-accent text-white'
                  : inStock
                  ? 'border-primary-700 text-white hover:border-white'
                  : 'border-primary-800 bg-surface-dark text-white/20 cursor-not-allowed'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Warning */}
      {selectedVariant &&
        selectedVariant.stockQuantity <= 5 &&
        selectedVariant.stockQuantity > 0 && (
          <p className="text-accent text-sm font-bold animate-pulse">
            Only {selectedVariant.stockQuantity} left in stock - order soon!
          </p>
        )}

      {/* Add to Cart */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || isOutOfStock}
          className={`w-full py-4 font-bold text-sm uppercase tracking-wider transition-all ${
            !selectedSize || isOutOfStock
              ? 'bg-primary-800 text-white/30 cursor-not-allowed'
              : addedToCart
              ? 'bg-green-600 text-white'
              : 'btn-primary'
          }`}
        >
          {addedToCart
            ? 'Added to Cart!'
            : isOutOfStock
            ? 'Out of Stock'
            : !selectedSize
            ? 'Select a Size'
            : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!selectedSize || isOutOfStock}
          className={`w-full py-4 font-bold text-sm uppercase tracking-wider transition-all ${
            !selectedSize || isOutOfStock
              ? 'border border-primary-800 text-white/30 cursor-not-allowed'
              : 'btn-accent'
          }`}
        >
          Buy Now
        </button>
      </div>

      {/* Delivery info */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-primary-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Free Shipping</p>
            <p className="text-xs text-white/50">On orders over $100</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-primary-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">30-Day Returns</p>
            <p className="text-xs text-white/50">Easy & free returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getUniqueColors(variants: ProductVariant[]): string[] {
  return [...new Set(variants.map((v) => v.color))];
}

function getAvailableSizes(
  variants: ProductVariant[],
  color: string
): { size: string; inStock: boolean }[] {
  const allSizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

  return allSizes.map((size) => {
    const variant = variants.find((v) => v.size === size && v.color === color);
    return {
      size,
      inStock: variant ? variant.stockQuantity > 0 : false,
    };
  });
}
