# Blueprint: Homepage Design

## Goal

Create a Nike-inspired dark landing page with hero section, popular products carousel, about section, feature product, testimonials, newsletter, and footer. Single-page layout with anchor navigation.

## Inputs Required

- featured_products: array from API
- brands: array from API
- testimonials: static data or API

## Skills Reference

- `senior-fullstack-skill.md` - React patterns, component architecture
- `postgres-database-skill.md` - Data queries for products

## Page Sections (Scroll Order)

1. **Header** (sticky)
2. **Hero Section** (#home)
3. **Popular Products** (#product)
4. **Promo + About Us** (#about)
5. **Feature Product**
6. **Customer Testimonials** (#testimonial)
7. **Newsletter Signup**
8. **Footer**

## Navigation

All nav items are anchor links to homepage sections:
- Home → #home (hero)
- About → #about (about section)
- Product → #product (popular products)
- Testimonial → #testimonial (testimonials)
- Shop → /products (separate page)

## Steps

### 1. Create Header Component

`src/components/layout/Header.tsx`:
- Nike swoosh logo (left)
- Horizontal nav: Home, About, Product, Testimonial, Shop
- Right side: search icon, cart icon with badge, "Contact Us" red pill button
- Sticky, dark background (bg-black or bg-surface-dark)
- Smooth scroll on anchor click

### 2. Create Hero Section

`src/components/home/HeroSection.tsx`:
- Left side content:
  - Nike swoosh small logo
  - "Summer Collections" in white, bold display font
  - "2022" in accent red, large display
  - Subtitle text
  - "Shop Now" red pill button with play/arrow icon
  - Rating badge: 4.9 stars, "120k Total Review"
- Right side:
  - Large hero shoe image (orange shoe, floating style)
  - Faded "NIKE" text watermark behind shoe
  - "Get up to 30% off" promo tooltip card (glassmorphism)
- Background: dark gradient with subtle glow effects

### 3. Create Popular Products Section

`src/components/home/PopularProducts.tsx`:
- Section heading: "Popular" (white) + "Products" (red accent)
- Carousel of 4 visible product cards with left/right arrow navigation
- **Product Card** component:
  - Dark card background
  - Shoe image on gradient background
  - Red heart/wishlist icon (top-right circle)
  - Star rating (e.g., 4.5)
  - Product name (e.g., "Nike Air Jordan-100")
  - Price (e.g., "$20.20")
  - "Add to Cart" small red pill button

### 4. Create Promo + About Section

`src/components/home/AboutSection.tsx`:
- Split layout (2 columns on desktop):
  - Left: "Get up to 30% off" promo card with gradient/glassmorphism, small shoe image
  - Right: "About Us" label (red), "We Provide High Quality Shoes." heading (white, bold with mixed weight), body paragraph text, "Explore More" red outline button

### 5. Create Feature Product Section

`src/components/home/FeatureProduct.tsx`:
- "Product Details" label
- "Get to Know Our Feature Product" heading (white + red mixed)
- Left: feature list with icons
  - "Best Quality Shoes" with description
  - "Best Giving Pricing" with description
- Right: Featured product card with image, name, and price (e.g., "Nike Watch Series 7i", $150.20)

### 6. Create Testimonials Section

`src/components/home/Testimonials.tsx`:
- "What Our Customer Says" heading (white + red "Customer")
- Carousel or grid of testimonial cards:
  - Circular avatar image
  - Quote/review text
  - Customer name (e.g., "Remington", "Thomson Zarki")
- Navigation arrows or dots

### 7. Create Newsletter Section

`src/components/home/Newsletter.tsx`:
- "Sign Up for Updates & Newsletter" heading (white + red "Updates")
- Email input field with red "Sign Up" button
- Dark background, full width

### 8. Create Footer

`src/components/layout/Footer.tsx`:
- Nike swoosh logo
- 3 link columns:
  - Find Product: Sneakers, Boots, Smart Phone, etc.
  - Get Help: Contacts, Terms, Privacy, Return Policy, Payment Option
  - About Us: About Us, News, Careers, Our Policy
- Social media icons row
- Copyright text

## Component Structure

```
src/components/
├── layout/
│   ├── Header.tsx          # Sticky nav with anchor links
│   └── Footer.tsx          # Multi-column footer
├── home/
│   ├── HeroSection.tsx     # Hero with shoe image + CTA
│   ├── PopularProducts.tsx # Product carousel section
│   ├── ProductCard.tsx     # Individual product card (dark theme)
│   ├── AboutSection.tsx    # Promo + about split layout
│   ├── FeatureProduct.tsx  # Featured product highlight
│   ├── Testimonials.tsx    # Customer reviews
│   └── Newsletter.tsx      # Email signup
└── ui/
    ├── Carousel.tsx        # Reusable carousel with arrows
    └── RatingStars.tsx     # Star rating display
```

## Color Reference (from Design System)

- Background: #0A0A0A (pure black/near-black)
- Card surfaces: #111111 - #1A1A1A
- Primary accent: #FF3B30 (electric red) — buttons, highlights, mixed headings
- Text: white for headings, white/50-70 opacity for body
- Star ratings: gold/yellow

## No 3D Components

This design uses standard product photography only. No Three.js, React Three Fiber, or WebGL. All shoe visuals are regular `<img>` elements.

## Expected Output

- Dark, Nike-inspired landing page
- Smooth anchor scroll navigation
- Product card carousel with wishlist + add to cart
- Testimonials section
- Newsletter signup
- Responsive across all breakpoints
- All sections accessible via header nav

## Edge Cases

- **No featured products**: Show "Coming Soon" placeholder
- **Slow API**: Skeleton loaders for product cards
- **Mobile**: Stack columns vertically, hamburger menu for nav
- **No images**: Show placeholder shoe silhouette

## Known Issues

- **Carousel**: Need to handle touch swipe for mobile
- **Anchor scroll**: Account for sticky header offset
- **Large product images**: Implement lazy loading
