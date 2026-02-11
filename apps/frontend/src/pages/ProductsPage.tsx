import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Product, Brand, Category } from '../types/product';
import ProductCard from '../components/product/ProductCard';

export default function ProductsPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');

  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');
  const saleFilter = searchParams.get('sale') === 'true';
  const newFilter = searchParams.get('new') === 'true';

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });

  const { data: brands = [], isLoading: brandsLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await api.get('/brands');
      return res.data;
    },
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const filteredProducts = useMemo(() => {
    let filteredList = [...products];

    if (categoryFilter) {
      filteredList = filteredList.filter((p) => p.category.slug === categoryFilter);
    }

    if (brandFilter) {
      filteredList = filteredList.filter((p) => p.brand.slug === brandFilter);
    }

    if (saleFilter) {
      filteredList = filteredList.filter((p) => p.salePrice !== null);
    }

    if (newFilter) {
      filteredList = filteredList.filter((p) => p.isFeatured);
    }

    switch (sortBy) {
      case 'price-low':
        filteredList.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        filteredList.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name':
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filteredList.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filteredList;
  }, [categoryFilter, brandFilter, saleFilter, newFilter, sortBy, products]);

  const clearFilters = (): void => {
    setSearchParams({});
  };

  const activeFilterCount = [categoryFilter, brandFilter, saleFilter, newFilter].filter(Boolean).length;

  const pageTitle = saleFilter
    ? 'SALE'
    : newFilter
    ? 'NEW ARRIVALS'
    : categoryFilter
    ? categories.find((c) => c.slug === categoryFilter)?.name?.toUpperCase() || 'SHOP'
    : brandFilter
    ? brands.find((b) => b.slug === brandFilter)?.name?.toUpperCase() || 'SHOP'
    : 'ALL PRODUCTS';

  const isLoading = productsLoading || brandsLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Banner */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-accent text-sm font-bold uppercase tracking-wider">
            {filteredProducts.length} Products
          </span>
          <h1 className="text-display-md md:text-display-lg font-black text-primary tracking-tighter mt-2">
            {pageTitle}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-primary-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-primary-400 text-sm font-medium mr-2">Filter:</span>

            <select
              value={categoryFilter || ''}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('category', e.target.value);
                } else {
                  params.delete('category');
                }
                setSearchParams(params);
              }}
              className="bg-white border border-primary-200 text-primary text-sm px-4 py-2 rounded-lg focus:outline-none focus:border-accent"
              disabled={categoriesLoading}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={brandFilter || ''}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('brand', e.target.value);
                } else {
                  params.delete('brand');
                }
                setSearchParams(params);
              }}
              className="bg-white border border-primary-200 text-primary text-sm px-4 py-2 rounded-lg focus:outline-none focus:border-accent"
              disabled={brandsLoading}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                if (saleFilter) {
                  params.delete('sale');
                } else {
                  params.set('sale', 'true');
                }
                setSearchParams(params);
              }}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border rounded-full transition-colors ${
                saleFilter
                  ? 'bg-accent border-accent text-white'
                  : 'border-primary-300 text-primary-500 hover:border-primary hover:text-primary'
              }`}
            >
              On Sale
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-primary-400 hover:text-primary transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-primary-400 text-sm font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-primary-200 text-primary text-sm px-4 py-2 rounded-lg focus:outline-none focus:border-accent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square skeleton bg-primary-100 mb-4 rounded-2xl" />
                <div className="h-4 skeleton bg-primary-100 mb-2 w-3/4" />
                <div className="h-4 skeleton bg-primary-100 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-primary-400 text-lg mb-4">No products found</p>
            <button onClick={clearFilters} className="btn-outline">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
