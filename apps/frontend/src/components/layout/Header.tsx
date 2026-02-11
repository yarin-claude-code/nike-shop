import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

export default function Header(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isHomePage = location.pathname === '/';

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string): void => {
    if (isHomePage) {
      e.preventDefault();
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { href: '/#home', label: 'HOME', hash: '#home' },
    { href: '/#about', label: 'ABOUT US', hash: '#about' },
    { href: '/#product', label: 'TRENDING', hash: '#product' },
    { href: '/#testimonial', label: 'SALES', hash: '#testimonial' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/95 backdrop-blur-lg border-b border-primary-200/50 shadow-soft'
          : 'bg-surface'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 8.719l-7.09 7.09c-.73.73-1.97.73-2.71 0L2 6.529l1.41-1.41 8.09 8.09 6.09-6.09L21 8.719z" />
            </svg>
            <span className="text-xl font-black tracking-tighter text-primary">
              TONY'S
            </span>
          </Link>

          {/* Desktop Navigation - Pill shaped container */}
          <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-2 py-1 shadow-soft">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.hash)}
                className="text-xs font-medium text-primary-600 hover:text-primary hover:bg-primary-100 px-4 py-2 rounded-full transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/products"
              className="text-xs font-medium text-primary-600 hover:text-primary hover:bg-primary-100 px-4 py-2 rounded-full transition-colors"
            >
              SHOP
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="p-2 text-primary-500 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Heart/Wishlist */}
            <button className="p-2 text-primary-500 hover:text-primary transition-colors hidden sm:block">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-primary-500 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-primary-500">{user?.firstName}</span>
                <button onClick={logout} className="text-sm text-primary-400 hover:text-primary transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-5 py-2 text-primary text-sm font-medium transition-colors hover:text-accent"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-primary-500 hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-surface border-b border-primary-200 shadow-soft-md transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col p-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.hash)}
              className="py-3 text-lg font-medium text-primary"
            >
              {link.label}
            </a>
          ))}
          <Link to="/products" className="py-3 text-lg font-medium text-primary">
            SHOP
          </Link>
          {!isAuthenticated && (
            <Link to="/login" className="py-3 text-lg font-medium text-primary-400">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
