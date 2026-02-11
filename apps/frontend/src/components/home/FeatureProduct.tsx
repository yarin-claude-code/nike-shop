const FEATURE_IMAGE = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80';

const features = [
  {
    title: 'Best Quality Shoes',
    description: 'Crafted with premium materials and cutting-edge technology for maximum comfort and durability.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Best Giving Pricing',
    description: 'Premium footwear at competitive prices. Get the best value for your investment.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function FeatureProduct(): JSX.Element {
  return (
    <section className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-primary-400 text-sm uppercase tracking-wider">Product Details</span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2">
            <span className="text-primary">Get to Know Our </span>
            <span className="text-accent">Feature Product</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Features List */}
          <div className="space-y-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-primary font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-primary-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Featured Product Card */}
          <div className="bg-white rounded-3xl p-6 max-w-sm mx-auto lg:ml-auto shadow-soft-md border border-primary-100">
            <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl overflow-hidden mb-4">
              <img
                src={FEATURE_IMAGE}
                alt="Featured product"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-primary font-bold text-lg">Nike Air Max Pro</h3>
            <p className="text-accent font-black text-xl mt-1">$150.20</p>
          </div>
        </div>
      </div>
    </section>
  );
}
