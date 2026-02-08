import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Product } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';

function ProductCardSkeleton(): JSX.Element {
  return (
    <div className="bg-white rounded-2xl overflow-hidden flex-shrink-0 w-[280px] animate-pulse shadow-soft">
      <div className="aspect-square bg-primary-100" />
      <div className="p-4 space-y-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-primary-200 rounded" />
          ))}
        </div>
        <div className="h-4 bg-primary-200 rounded w-3/4" />
        <div className="h-5 bg-primary-200 rounded w-1/3" />
        <div className="h-9 bg-primary-200 rounded-full w-full" />
      </div>
    </div>
  );
}

interface PopularProductCardProps {
  product: Product;
}

function PopularProductCard({ product }: PopularProductCardProps): JSX.Element {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleAddToCart = (): void => {
    const variant = product.variants[0];
    if (!variant) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      size: variant.size,
      color: variant.color,
      price: product.salePrice ?? product.price,
      imageUrl: primaryImage?.url || '',
    });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex-shrink-0 w-[280px] group shadow-soft border border-primary-100">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={primaryImage?.url || '/placeholder-shoe.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Wishlist heart */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-soft"
        >
          <svg
            className={`w-4 h-4 ${isWishlisted ? 'text-red-500' : 'text-primary-400'}`}
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Sale badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        {/* Star rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < 4 ? 'text-amber-400' : 'text-primary-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-primary-400 text-xs ml-1">4.5</span>
        </div>

        <h3 className="text-primary font-medium text-sm truncate">{product.name}</h3>

        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-accent font-bold">${product.salePrice?.toFixed(2)}</span>
              <span className="text-primary-400 text-sm line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-2 bg-primary hover:bg-primary-800 text-white text-sm font-medium py-2.5 rounded-full transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function PopularProducts(): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async (): Promise<Product[]> => {
      const res = await api.get('/products/featured');
      return res.data;
    },
  });

  const scroll = (direction: 'left' | 'right'): void => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="product" className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-display-sm font-black tracking-tighter">
            <span className="text-primary">Popular </span>
            <span className="text-accent">Products</span>
          </h2>

          {/* Carousel arrows */}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="carousel-btn">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => scroll('right')} className="carousel-btn">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        >
          {isLoading
            ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            : (products ?? []).map((product) => (
                <PopularProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
