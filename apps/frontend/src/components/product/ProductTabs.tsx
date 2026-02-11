import { useState } from 'react';
import { Product } from '../../types/product';

interface ProductTabsProps {
  product: Product;
}

type Tab = 'description' | 'details' | 'reviews';

export default function ProductTabs({ product }: ProductTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('description');

  return (
    <div className="mt-16 pt-8 border-t border-primary-200">
      {/* Tab Headers */}
      <div className="border-b border-primary-200">
        <div className="flex gap-8">
          {(['description', 'details', 'reviews'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-accent text-accent'
                  : 'border-transparent text-primary-400 hover:text-primary'
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
          <div className="max-w-2xl">
            <p className="text-primary-500 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
            <div>
              <h4 className="font-bold text-primary uppercase tracking-wider text-sm mb-6">
                Product Details
              </h4>
              <dl className="space-y-4">
                {[
                  { label: 'Brand', value: product.brand.name },
                  { label: 'Category', value: product.category.name },
                  {
                    label: 'Available Colors',
                    value: [...new Set(product.variants.map((v) => v.color))].join(', '),
                  },
                  {
                    label: 'Available Sizes',
                    value: [...new Set(product.variants.map((v) => v.size))]
                      .sort((a, b) => parseFloat(a) - parseFloat(b))
                      .join(', '),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 border-b border-primary-200">
                    <dt className="text-primary-400">{label}</dt>
                    <dd className="font-medium text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <p className="text-primary-400 mb-4">No reviews yet. Be the first to review!</p>
            <button className="btn-outline text-sm px-6 py-3">
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
