# Design System

## Philosophy
Warm, clean, luxury-inspired design with cream/beige tones. Light mode first with soft shadows and rounded corners. Minimal and elegant.

## Color Palette

### Primary (Warm Neutrals)
- `primary-50`: #FAF8F5 (Near white)
- `primary-100`: #F5F0EB (Cream)
- `primary-200`: #E8DFD6 (Light beige)
- `primary-300`: #D4C5B2 (Beige)
- `primary-400`: #B8A898 (Warm tan)
- `primary-500`: #9C8B7A (Mid tone)
- `primary-600`: #7A6B5D (Dark tan)
- `primary-700`: #5C4F44 (Dark brown)
- `primary-900`: #2C2520 (Near black)

### Accent Colors
- `accent` (default): #8B7355 (Warm brown - primary CTA)
- `accent-400`: #B8996E (Light gold-brown)

### Surface Colors
- `surface-dark`: #EDE6DD (Dark cream)
- `surface` (default): #F5F0EB (Cream background)
- `surface-light`: #FAF8F5 (Light cream)
- `surface-elevated`: #FFFFFF (White)

## Typography

### Display Sizes (Headlines)
- `text-display-xl`: 8rem, 900 weight, -0.04em tracking
- `text-display-lg`: 6rem, 800 weight, -0.03em tracking
- `text-display-md`: 4rem, 800 weight, -0.02em tracking
- `text-display-sm`: 2.5rem, 700 weight, -0.01em tracking

### Style Guidelines
- Headlines: UPPERCASE, font-black, tight tracking
- Body: Regular weight, primary-400 to primary-500 opacity
- Labels: text-xs, UPPERCASE, wider tracking

## Component Classes

### Buttons
- `.btn-primary`: Dark bg, white text, rounded-full
- `.btn-accent`: Brown bg, white text, warm shadow
- `.btn-outline`: Border only, rounded-full, hover fills
- `.btn-ghost`: Transparent, hover:primary/5

### Cards
- `.card`: White bg, rounded-2xl, soft shadow, light border
- `.card-hover`: Adds shadow-md on hover
- `.card-product`: Product card with overlay on hover

### Badges
- `.badge-sale`: Red bg, white text, rounded-full
- `.badge-new`: Accent bg, white text
- `.badge-hot`: Amber bg, white text

## Animation Classes

### Entrance Animations
- `.animate-fade-in`: Opacity 0→1
- `.animate-fade-in-up`: Slide up + fade
- `.animate-scale-in`: Scale 0.9→1 + fade

### Hover Effects
- `.hover-lift`: -translate-y-2
- `.hover-scale`: scale-105

### Stagger Delays
- `.stagger-1` through `.stagger-8`: 0.1s increments

## Layout Patterns

### Page Structure
```jsx
<div className="min-h-screen bg-surface">
  <section className="bg-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-accent text-sm font-bold uppercase tracking-wider">
            Label
          </span>
          <h2 className="text-display-sm font-black text-primary tracking-tighter mt-2">
            HEADLINE
          </h2>
        </div>
      </div>
      {/* Content */}
    </div>
  </section>
</div>
```

## Homepage Layout Reference

The homepage is a warm, light, single-page landing with these sections:

1. **Header**: Nike swoosh logo, pill-shaped nav container (HOME, ABOUT US, TRENDING, SHOP, SALES), search + heart + cart icons, "Sign In" link
2. **Hero**: Large bold "JUST DO IT." headline, giant "NIKE" watermark in light beige, hero shoe image (floating with warm shadow), lifestyle image cards bottom-right, "EXPLORE MORE" outline CTA with arrow, "COMFORT IN EVERY STEP" badge
3. **Popular Products**: Section title with "Popular" (dark) + "Products" (brown), product cards in row with carousel arrows, each card: white bg, shoe image, heart icon (white circle), star rating, product name, price, "Add to Cart" pill button
4. **Promo + About**: Left "Get up to 30% off" promo card (warm gradient), right "We Provide High Quality Shoes" heading with body text and "Explore More" button (accent outline)
5. **Feature Product**: "Get to Know Our Feature Product" with bullet features and highlighted product card (white bg, rounded)
6. **Testimonials**: "What Our Customer Says" with circular avatars, review text in light cards
7. **Newsletter**: "Sign Up for Updates & Newsletter" heading, email input with accent submit button
8. **Footer**: Light bg, Nike logo, 3 link columns, social icons, copyright

### Key Design Patterns
- **Product cards**: White background, rounded-2xl, soft shadow, shoe image on cream bg, heart icon top-right, star rating + name + price below
- **Typography mixing**: Dark + accent color in same heading (e.g., "Popular **Products**" where Products is brown)
- **Buttons**: "Explore More" is outline pill with arrow, "Add to Cart" is dark pill, "Sign Up" is accent pill
- **Overall feel**: Clean, warm, luxurious, light cream backgrounds

## Mock Data

For development without backend, use mock data from:
- [apps/frontend/src/data/mockData.ts](apps/frontend/src/data/mockData.ts)

## Key Frontend Files

- [apps/frontend/tailwind.config.js](apps/frontend/tailwind.config.js) - Color palette, animations, typography
- [apps/frontend/src/index.css](apps/frontend/src/index.css) - Component classes, utilities
- [apps/frontend/src/components/layout/Header.tsx](apps/frontend/src/components/layout/Header.tsx) - Sticky header with pill nav
- [apps/frontend/src/components/home/HeroSection.tsx](apps/frontend/src/components/home/HeroSection.tsx) - Hero section with JUST DO IT headline
- [apps/frontend/src/pages/ProductsPage.tsx](apps/frontend/src/pages/ProductsPage.tsx) - Filter/sort products page
