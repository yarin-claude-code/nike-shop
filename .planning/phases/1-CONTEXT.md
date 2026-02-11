# Phase 1 Context: Database Foundation & Data Integrity

## Seed Data Scope

- **Products per brand:** 6-8 per brand (~30-50 total across 7 brands)
- **Data authenticity:** Real product names and approximate retail prices; descriptions can be generic
- **Image storage:** Download real product images from brand sites, store files in `apps/frontend/public/images/`, database stores URL paths (NOT binary blobs)
- **Seed breadth:** Products, variants, and images only — no reviews in Phase 1

## Variant Structure

- **Size system:** Multi-region — each variant stores US, EU, and UK size values in separate columns
- **Colors per product:** Varies realistically — some products 1 colorway, popular ones 3-4
- **Pricing model:** Price lives on the product level, NOT per variant. Variants track size, color, and stock only
- **Stock levels:** All variants in stock with random quantities (5-50). No out-of-stock variants in seed data

## Brand & Category Taxonomy

- **Brands (7):** Nike, Adidas, Puma, On Cloud, Hoka, Jordan, New Balance
- **Brand data:** Name + logo URL + description (enough for brand pages)
- **Categories (3, flat):** Running, Lifestyle, Basketball — single level, no hierarchy
- **Category structure:** Flat list, no parent/child relationships

## Deferred Ideas

None captured during discussion.

---
*Created: 2026-02-10*
