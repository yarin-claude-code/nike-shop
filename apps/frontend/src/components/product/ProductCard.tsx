import { Link } from 'react-router-dom';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps): JSX.Element {
  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.salePrice! / product.price) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card-product group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        <img
          src={primaryImage?.url || '/placeholder-shoe.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="badge-sale">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="badge-hot">Hot</span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="product-card-overlay">
          <div className="flex flex-col items-center gap-3">
            <span className="btn-primary text-xs px-6 py-3">
              Quick View
            </span>
            <span className="text-white/70 text-xs uppercase tracking-wider">
              Click to explore
            </span>
          </div>
        </div>

        {/* Color dots indicator */}
        {product.variants.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {[...new Set(product.variants.map(v => v.color))].slice(0, 4).map((color, i) => {
              const colorMap: Record<string, string> = {
                black: '#1a1a1a',
                white: '#ffffff',
                red: '#ef4444',
                blue: '#3b82f6',
                orange: '#f97316',
                green: '#22c55e',
              };
              return (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{ backgroundColor: colorMap[color.toLowerCase()] || '#888' }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
          {product.brand.name}
        </p>
        <h3 className="font-bold text-white mb-2 group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          {hasDiscount ? (
            <>
              <span className="font-black text-lg text-accent">
                ${product.salePrice?.toFixed(2)}
              </span>
              <span className="text-sm text-white/40 line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-black text-lg text-white">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
