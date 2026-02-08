# Design System

## Philosophy
Nike/Adidas-inspired bold, high-contrast design with minimal colors and maximum impact. Dark mode first with electric accent colors.

## Color Palette

### Primary (Neutrals)
- `primary-950`: #0a0a0a (Pure black)
- `primary-900`: #171717 (Near black)
- `primary-800`: #262626 (Elevated surfaces)
- `primary-700`: #404040 (Borders)
- `primary-50`: #fafafa (White)

### Accent Colors
- `accent` (default): #FF3B30 (Electric red - primary CTA)
- `accent-neon`: #FF0040 (Neon pink-red - highlights)
- `accent-cyan`: #00D4FF (Electric cyan - variety)
- `accent-lime`: #CCFF00 (Neon lime - special badges)

### Surface Colors
- `surface-dark`: #0A0A0A
- `surface` (default): #111111
- `surface-light`: #1A1A1A
- `surface-elevated`: #222222

## Typography

### Display Sizes (Headlines)
- `text-display-xl`: 8rem, 900 weight, -0.04em tracking
- `text-display-lg`: 6rem, 800 weight, -0.03em tracking
- `text-display-md`: 4rem, 800 weight, -0.02em tracking
- `text-display-sm`: 2.5rem, 700 weight, -0.01em tracking

### Style Guidelines
- Headlines: UPPERCASE, font-black, tight tracking
- Body: Regular weight, white/50 to white/70 opacity
- Labels: text-xs, UPPERCASE, wider tracking

## Component Classes

### Buttons
- `.btn-primary`: White bg, black text, hover:gray
- `.btn-accent`: Red bg, white text, glow shadow
- `.btn-outline`: Border only, hover fills
- `.btn-ghost`: Transparent, hover:white/10

### Cards
- `.card`: Dark surface, border, no rounded corners
- `.card-hover`: Adds border glow on hover
- `.card-product`: Product card with overlay on hover

### Badges
- `.badge-sale`: Red bg, "SALE" or percentage
- `.badge-new`: Cyan bg, black text
- `.badge-hot`: Lime bg, black text

## Animation Classes

### Entrance Animations
- `.animate-fade-in`: Opacity 0→1
- `.animate-fade-in-up`: Slide up + fade
- `.animate-scale-in`: Scale 0.9→1 + fade
- `.animate-bounce-in`: Bouncy entrance

### Hover Effects
- `.hover-lift`: -translate-y-2
- `.hover-scale`: scale-105
- `.hover-glow`: White shadow
- `.hover-glow-red`: Red shadow

### Stagger Delays
- `.stagger-1` through `.stagger-8`: 0.1s increments

## Layout Patterns

### Page Structure
```jsx
<div className="min-h-screen bg-black">
  <section className="bg-surface py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-accent text-sm font-bold uppercase tracking-wider">
            Label
          </span>
          <h2 className="text-display-sm font-black text-white tracking-tighter mt-2">
            HEADLINE
          </h2>
        </div>
      </div>
      {/* Content */}
    </div>
  </section>
</div>
```

### Product Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {products.map((product, index) => (
    <ProductCard key={product.id} product={product} index={index} />
  ))}
</div>
```

## Homepage Layout Reference

The homepage is a dark, single-page landing with these sections:

1. **Header**: Nike swoosh logo, horizontal nav (Home, About, Product, Testimonial, Shop), search + cart icons, red "Contact Us" button
2. **Hero**: Large bold "Summer Collections 2022" headline (white + red year), hero shoe image (large, orange, floating with shadow), "Shop Now" pill button (red), star rating badge (4.9, 120k reviews), "Get up to 30% off" promo tooltip card
3. **Popular Products**: Section title with "Popular" (white) + "Products" (red), 4 product cards in row with carousel arrows, each card has: dark bg, shoe image, heart/wishlist icon (red circle), star rating, product name, price, "Add to Cart" pill button
4. **Promo + About**: Left side "Get up to 30% off" promo card, right side "We Provide High Quality Shoes" heading with body text and "Explore More" button (red outline)
5. **Feature Product**: "Get to Know Our Feature Product" with bullet features (Best Quality Shoes, Best Giving Pricing) and a highlighted product card
6. **Testimonials**: "What Our Customer Says" with circular avatar photos, review paragraphs, reviewer names
7. **Newsletter**: "Sign Up for Updates & Newsletter" heading, email input with red submit button
8. **Footer**: Nike logo, 3 link columns (Find Product, Get Help, About Us), social icons, copyright

### Key Design Patterns from Mockups
- **Product cards**: Dark background (#1A1A1A-ish), shoe image on gradient bg, red heart icon top-right, star rating + name + price below, small "Add to Cart" button
- **Typography mixing**: White + red/accent color in same heading (e.g., "Popular **Products**" where Products is red)
- **Buttons**: "Shop Now" is a red pill with play icon, "Contact Us" is red outline pill, "Add to Cart" is small red pill
- **Promo cards**: Glassmorphism/gradient cards with "Get up to 30% off" text
- **No 3D**: All shoe visuals are standard product photography, no Three.js/WebGL

## Mock Data

For development without backend, use mock data from:
- [apps/frontend/src/data/mockData.ts](apps/frontend/src/data/mockData.ts)

Provides:
- `mockProducts`: 8 products with images, variants, pricing
- `mockBrands`: Nike, Adidas, Jordan, etc.
- `mockCategories`: Running, Basketball, Lifestyle, etc.
- Helper functions: `getFeaturedProducts()`, `getProductBySlug()`, etc.

## Key Frontend Files

- [apps/frontend/tailwind.config.js](apps/frontend/tailwind.config.js) - Color palette, animations, typography
- [apps/frontend/src/index.css](apps/frontend/src/index.css) - Component classes, utilities
- [apps/frontend/src/components/layout/Header.tsx](apps/frontend/src/components/layout/Header.tsx) - Sticky header, nav
- [apps/frontend/src/components/home/HeroSection.tsx](apps/frontend/src/components/home/HeroSection.tsx) - Hero section with animations
- [apps/frontend/src/pages/ProductsPage.tsx](apps/frontend/src/pages/ProductsPage.tsx) - Filter/sort products page
