# Blueprint: Product Page

## Goal

Create an immersive product detail page with image gallery, size/color selection, and add-to-cart functionality.

## Inputs Required

- product_slug: string (from URL params)
- product_data: from API `/products/:slug`

## Skills Reference

- `senior-fullstack-skill.md` - React patterns, component architecture
- `postgres-database-skill.md` - Data queries for products

## Page Layout

```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Home > Category > Product      │
├─────────────────────┬───────────────────────┤
│                     │  Brand Name           │
│   Image Gallery     │  Product Name         │
│   (Product Photos)  │  Price / Sale Price   │
│                     │  ───────────────────  │
│   [Color Options]   │  Color: Black         │
│                     │  Size: [7] [8] [9]... │
│                     │  ───────────────────  │
│                     │  [Add to Cart]        │
│                     │  [Buy Now]            │
├─────────────────────┴───────────────────────┤
│  Description / Details Tabs                 │
├─────────────────────────────────────────────┤
│  Related Products                           │
└─────────────────────────────────────────────┘
```

## Steps

### 1. Create Product Page Component

`src/pages/ProductPage.tsx`:
```typescript
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Product } from '../types/product';
import ProductImageViewer from '../components/product/ProductImageViewer';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import RelatedProducts from '../components/product/RelatedProducts';
import Breadcrumb from '../components/ui/Breadcrumb';
import ProductPageSkeleton from '../components/product/ProductPageSkeleton';

export default function ProductPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product> => {
      const res = await api.get(`/products/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-slate-600">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: product.category.name, href: `/category/${product.category.slug}` },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="sticky top-24">
            <ProductImageViewer
              images={product.images}
              fallbackImageUrl="/placeholder-shoe.jpg"
            />
          </div>

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>

        {/* Tabs: Description, Details, Reviews */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <RelatedProducts
          categoryId={product.category.id}
          currentProductId={product.id}
        />
      </div>
    </div>
  );
}

function getUniqueColors(variants: Product['variants']): string[] {
  const colorMap: Record<string, string> = {
    black: '#1a1a1a',
    white: '#ffffff',
    red: '#ef4444',
    blue: '#3b82f6',
    orange: '#f97316',
    green: '#22c55e',
  };

  const uniqueColors = [...new Set(variants.map((v) => v.color.toLowerCase()))];
  return uniqueColors.map((c) => colorMap[c] || '#1a1a1a');
}
```

### 2. Create Product Info Component

`src/components/product/ProductInfo.tsx`:
```typescript
import { useState } from 'react';
import { Product, ProductVariant } from '../../types/product';
import { useCartStore } from '../../stores/cartStore';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps): JSX.Element {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.color || ''
  );
  const addItem = useCartStore((state) => state.addItem);

  const availableSizes = getAvailableSizes(product.variants, selectedColor);
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const hasDiscount = product.salePrice && product.salePrice < product.price;
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
  };

  return (
    <div className="space-y-6">
      {/* Brand & Name */}
      <div>
        <p className="text-sm font-medium text-orange-500 uppercase tracking-wide">
          {product.brand.name}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          {product.name}
        </h1>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        {hasDiscount ? (
          <>
            <span className="text-3xl font-bold text-orange-500">
              ${product.salePrice?.toFixed(2)}
            </span>
            <span className="text-xl text-slate-400 line-through">
              ${product.price.toFixed(2)}
            </span>
            <span className="bg-orange-100 text-orange-600 text-sm font-medium px-2 py-1 rounded">
              {Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)}% OFF
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-medium text-slate-900 mb-3">
          Color: <span className="text-slate-600">{selectedColor}</span>
        </h3>
        <div className="flex gap-2">
          {getUniqueColors(product.variants).map((color) => (
            <button
              key={color}
              onClick={() => {
                setSelectedColor(color);
                setSelectedSize(null); // Reset size when color changes
              }}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                selectedColor === color
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-slate-900">Select Size</h3>
          <button className="text-sm text-orange-500 hover:underline">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {availableSizes.map(({ size, inStock }) => (
            <button
              key={size}
              onClick={() => inStock && setSelectedSize(size)}
              disabled={!inStock}
              className={`py-3 rounded-md border text-sm font-medium transition-colors ${
                selectedSize === size
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : inStock
                  ? 'border-slate-200 hover:border-orange-500'
                  : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || isOutOfStock}
          className={`w-full py-4 rounded-md font-medium text-lg transition-colors ${
            !selectedSize || isOutOfStock
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : !selectedSize ? 'Select a Size' : 'Add to Cart'}
        </button>
        <button
          disabled={!selectedSize || isOutOfStock}
          className={`w-full py-4 rounded-md font-medium text-lg border transition-colors ${
            !selectedSize || isOutOfStock
              ? 'border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-orange-500 text-orange-500 hover:bg-orange-50'
          }`}
        >
          Buy Now
        </button>
      </div>

      {/* Stock Info */}
      {selectedVariant && selectedVariant.stockQuantity <= 5 && selectedVariant.stockQuantity > 0 && (
        <p className="text-sm text-orange-600 font-medium">
          Only {selectedVariant.stockQuantity} left in stock!
        </p>
      )}
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
```

### 3. Create Product Tabs Component

`src/components/product/ProductTabs.tsx`:
```typescript
import { useState } from 'react';
import { Product } from '../../types/product';

interface ProductTabsProps {
  product: Product;
}

type Tab = 'description' | 'details' | 'reviews';

export default function ProductTabs({ product }: ProductTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('description');

  return (
    <div className="mt-16">
      {/* Tab Headers */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          {(['description', 'details', 'reviews'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'description' && (
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Product Details</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-slate-600">Brand</dt>
                  <dd className="font-medium text-slate-900">{product.brand.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Category</dt>
                  <dd className="font-medium text-slate-900">{product.category.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">Available Colors</dt>
                  <dd className="font-medium text-slate-900">
                    {[...new Set(product.variants.map((v) => v.color))].join(', ')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-8">
            <p className="text-slate-600">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Expected Output

- Product image gallery with thumbnails
- Color and size selection
- Add to cart functionality
- Product details tabs
- Related products section

## Edge Cases

- **No images**: Show placeholder shoe silhouette
- **Out of stock size**: Disable selection, show "Notify Me"
- **Invalid slug**: 404 page

## Known Issues

- **Size chart**: Implement modal with size conversion table
- **Reviews**: Requires separate reviews API endpoint
