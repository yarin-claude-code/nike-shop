# Tony's Shoe Store — Full Refactor

## What This Is

A multi-brand online shoe store (Nike, Adidas, Puma, On Cloud, etc.) built as a production-quality learning project. Turborepo monorepo with React + Vite frontend, NestJS backend, and PostgreSQL database. The store showcases real shoe products with authentic images, modern UI/UX inspired by top e-commerce and design references (Dribbble, 21st.dev, Nike.com), and clean, maintainable code throughout.

## Core Value

Users can browse and shop real shoes from multiple brands with a polished, consistent experience — every image matches its product, every page feels intentional, and the code behind it is something to be proud of.

## Requirements

### Validated

- ✓ Monorepo structure (Turborepo, apps/frontend + apps/backend) — existing
- ✓ NestJS backend with modular architecture (products, orders, auth, cart, brands, categories) — existing
- ✓ React frontend with client-side routing, Zustand, React Query — existing
- ✓ PostgreSQL database with TypeORM — existing
- ✓ JWT authentication flow (login, register, protected routes) — existing
- ✓ Product browsing (list, detail pages) — existing (broken images)
- ✓ Cart functionality (client-side, Zustand + localStorage) — existing
- ✓ Homepage landing page with sections (hero, popular products, testimonials, newsletter, footer) — existing

### Active

- [ ] Real shoe product images sourced from brand sites (Nike, Adidas, Puma, On Cloud)
- [ ] Consistent images across all views (listing, detail, cart)
- [ ] Multi-brand product catalog (not just Nike)
- [ ] Research-driven UI/UX redesign (Dribbble, 21st.dev, real retailer references)
- [ ] Frontend code refactor — clean component patterns, proper structure
- [ ] Backend code refactor — effective NestJS patterns, clean API design
- [ ] Database schema refactor — proper architecture for multi-brand store
- [ ] Product detail page that shows correct, matching images
- [ ] Natural, intuitive navigation and page transitions
- [ ] Clear git workflow and project structure

### Out of Scope

- Real payment processing — learning project, not a real store
- User-generated content (reviews, ratings from real users) — can use mock data
- Mobile app — web only
- Deployment/hosting — local development focus
- Real inventory management — static seed data is fine

## Context

- Existing codebase has a warm cream/beige theme that was recently redesigned, but execution has gaps
- Product images currently show random/wrong images (cakes, mismatched products) — this is the most visible problem
- The product detail page (`/product/:id`) shows different images than the listing page
- Frontend lacks consistent component patterns and feels unpolished
- Database schema exists (001_initial_schema.sql) with products, variants, images, brands, categories, orders, cart — needs review for multi-brand support
- Backend has standard NestJS modules but service logic needs cleanup
- Cart is client-side only (Zustand + localStorage), no server-side sync
- TypeORM with synchronize:true in dev mode

## Constraints

- **Tech stack**: Keep React + Vite, NestJS, PostgreSQL, Turborepo — refactor within existing stack
- **Learning focus**: Code should demonstrate best practices, not just work
- **Images**: Must be real shoe product photos, not stock/placeholder — sourced from brand sites
- **Design direction**: Research-driven — look at Dribbble, 21st.dev, Nike.com, Adidas.com for inspiration before committing to a direction

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Multi-brand store (not Nike-only) | Broader catalog, more realistic e-commerce experience | — Pending |
| Real product images from brand sites | Current placeholder images are broken and inconsistent | — Pending |
| Research-driven UI/UX redesign | User wants design guided by real references, not assumptions | — Pending |
| Keep existing tech stack | Refactor within known tools rather than rewrite | — Pending |

---
*Last updated: 2026-02-10 after initialization*
