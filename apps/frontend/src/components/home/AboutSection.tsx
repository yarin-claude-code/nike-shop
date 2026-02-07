const PROMO_SHOE_IMAGE = 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80';

export default function AboutSection(): JSX.Element {
  return (
    <section id="about" className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Promo Card */}
          <div className="relative bg-gradient-to-br from-accent/20 via-surface-light to-surface-elevated rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            <div className="relative z-10">
              <p className="text-white/70 text-sm font-medium mb-2">Get up to</p>
              <p className="text-5xl md:text-6xl font-black text-accent mb-4">30% off</p>
              <p className="text-white/50 text-sm">On selected premium footwear this season</p>
            </div>
            <img
              src={PROMO_SHOE_IMAGE}
              alt="Promo shoe"
              className="absolute bottom-0 right-0 w-48 h-48 object-contain opacity-60 translate-x-4 translate-y-4"
            />
          </div>

          {/* Right - About Us */}
          <div className="space-y-6">
            <span className="text-accent text-sm font-bold uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              We Provide{' '}
              <span className="font-light text-white/80">High Quality</span>{' '}
              Shoes.
            </h2>
            <p className="text-white/50 leading-relaxed max-w-lg">
              We are committed to providing the best quality footwear to our customers.
              Our shoes are designed with the latest technology and crafted with premium
              materials to ensure comfort, durability, and style for every occasion.
            </p>
            <button className="inline-flex items-center gap-2 border-2 border-accent text-accent font-medium px-8 py-3 rounded-full hover:bg-accent hover:text-white transition-colors">
              Explore More
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
