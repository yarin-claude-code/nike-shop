import { Link } from 'react-router-dom';

const HERO_SHOE_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80';

export default function HeroSection(): JSX.Element {
  return (
    <section id="home" className="relative min-h-[90vh] bg-black overflow-hidden flex items-center">
      {/* Background gradient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Faded "NIKE" watermark behind shoe */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none">
        <span className="text-[20rem] font-black text-white/[0.03] leading-none tracking-tighter">
          NIKE
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Nike swoosh small */}
            <svg className="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 8.719l-7.09 7.09c-.73.73-1.97.73-2.71 0L2 6.529l1.41-1.41 8.09 8.09 6.09-6.09L21 8.719z" />
            </svg>

            {/* Headline */}
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                Summer
                <br />
                Collections
              </h1>
              <p className="text-6xl md:text-8xl lg:text-9xl font-black text-accent leading-[0.9] tracking-tighter mt-2">
                2022
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-white/60 text-lg max-w-md leading-relaxed">
              Discover the latest collection of premium footwear. Engineered for performance, designed for style.
            </p>

            {/* Shop Now CTA */}
            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-accent hover:bg-accent-600 text-white font-medium px-8 py-4 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Shop Now
              </Link>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-bold text-sm">4.9</span>
              </div>
              <span className="text-white/40 text-sm">120k Total Review</span>
            </div>
          </div>

          {/* Right - Hero Shoe Image */}
          <div className="relative flex items-center justify-center">
            {/* Promo tooltip card (glassmorphism) */}
            <div className="absolute top-8 right-0 z-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-3 shadow-lg">
              <p className="text-white font-bold text-sm">Get up to</p>
              <p className="text-accent font-black text-2xl">30% off</p>
            </div>

            {/* Shoe Image */}
            <div className="relative">
              <img
                src={HERO_SHOE_IMAGE}
                alt="Featured shoe - Summer Collection"
                className="w-full max-w-lg object-contain drop-shadow-2xl animate-float"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(255, 59, 48, 0.2))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
