import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Product } from '../types/product';
import ProductImageViewer from '../components/product/ProductImageViewer';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import ProductCard from '../components/product/ProductCard';

export default function ProductPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product> => {
      const res = await api.get(`/products/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 skeleton w-1/3 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square skeleton" />
              <div className="space-y-4">
                <div className="h-4 skeleton w-1/4" />
                <div className="h-10 skeleton w-3/4" />
                <div className="h-8 skeleton w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 opacity-20">👟</div>
          <h1 className="text-display-sm font-black text-white mb-4">
            PRODUCT NOT FOUND
          </h1>
          <p className="text-white/50 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];
  const colorMap: Record<string, string> = {
    black: '#1a1a1a',
    white: '#ffffff',
    red: '#ef4444',
    blue: '#3b82f6',
    orange: '#f97316',
    green: '#22c55e',
  };
  const colors = uniqueColors.map((c) => colorMap[c.toLowerCase()] || '#1a1a1a');

  // Get product images
  const productImages = product.images.map((img) => img.url);

  // Get related products (same category, different product)
  const relatedProducts = allProducts
    .filter((p) => p.category.slug === product.category.slug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-white/50 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <Link to="/products" className="text-white/50 hover:text-white transition-colors">
              Products
            </Link>
            <span className="text-white/30">/</span>
            <Link
              to={`/products?category=${product.category.slug}`}
              className="text-white/50 hover:text-white transition-colors"
            >
              {product.category.name}
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Viewer */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <ProductImageViewer
              images={productImages}
              productName={product.name}
              colors={colors}
              defaultColor={colors[0]}
            />
          </div>

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Tabs: Description, Details, Reviews */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-primary-800">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-accent text-sm font-bold uppercase tracking-wider">
                  You May Also Like
                </span>
                <h2 className="text-display-sm font-black text-white tracking-tighter mt-2">
                  RELATED PRODUCTS
                </h2>
              </div>
              <Link
                to={`/products?category=${product.category.slug}`}
                className="hidden md:flex items-center gap-2 text-white/50 hover:text-white font-bold uppercase tracking-wider text-sm transition-colors"
              >
                View All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
