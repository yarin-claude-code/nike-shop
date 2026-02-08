# Blueprint: React Frontend Setup

## Goal

Set up the React frontend with routing, state management, API layer, and styling foundation following the frontend design skill.

## Inputs Required

- vite_project: initialized Vite + React + TypeScript project
- backend_api: running NestJS API

## Skills Reference

- `senior-fullstack-skill.md` - React patterns, component architecture
- `postgres-database-skill.md` - Data queries

## Project Structure

```
frontend/src/
├── components/       # Reusable UI components
│   ├── ui/          # Base components (Button, Card, etc.)
│   ├── layout/      # Header, Footer, Layout
│   └── product/     # Product-specific components
├── pages/           # Route pages
├── hooks/           # Custom React hooks
├── lib/             # Utilities, API client
├── types/           # TypeScript interfaces
├── styles/          # Global styles
└── stores/          # Zustand stores
```

## Steps

### 1. Configure Tailwind CSS

`src/styles/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }

  body {
    @apply bg-slate-50 text-slate-900 antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors;
  }

  .btn-accent {
    @apply bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors;
  }

  .card {
    @apply bg-white rounded-lg shadow-sm border border-slate-200;
  }
}
```

### 2. Create API Client

`src/lib/api.ts`:
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Create Type Definitions

`src/types/product.ts`:
```typescript
export interface Brand {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  sku: string;
  stockQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  isFeatured: boolean;
  brand: Brand;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}
```

### 4. Create Zustand Store

`src/stores/cartStore.ts`:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  variantId: number;
  productId: number;
  productName: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    { name: 'cart-storage' }
  )
);
```

### 5. Setup React Router

`src/App.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const queryClient = new QueryClient();

export default function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

### 6. Create Layout Component

`src/components/layout/Layout.tsx`:
```typescript
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### 7. Create Header Component

`src/components/layout/Header.tsx`:
```typescript
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

export default function Header(): JSX.Element {
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            TONY'S
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="hover:text-orange-400 transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-orange-400 transition-colors">
              About
            </a>
            <a href="#product" className="hover:text-orange-400 transition-colors">
              Product
            </a>
            <a href="#testimonial" className="hover:text-orange-400 transition-colors">
              Testimonial
            </a>
            <Link to="/products" className="hover:text-orange-400 transition-colors">
              Shop
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative hover:text-orange-400 transition-colors">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="btn-accent">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
```

## Expected Output

- React app with routing configured
- Zustand stores for cart and auth state
- API client with interceptors
- TypeScript types matching backend
- Tailwind CSS with design system

## Edge Cases

- **API offline**: Show error state with retry button
- **Token expired**: Auto-redirect to login
- **Cart persistence**: Use localStorage via Zustand persist

## Known Issues

- **Hydration mismatch**: Use `useEffect` for client-only state
- **Flash of unstyled content**: Load fonts in `<head>`
