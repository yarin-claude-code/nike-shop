# Tony's Shoe Store

A modern e-commerce platform for men's footwear built with React, NestJS, and PostgreSQL.

## Monorepo Structure

This project uses [Turborepo](https://turbo.build/repo) to manage a monorepo with multiple applications and shared packages.

```
nike-shop/
├── apps/
│   ├── frontend/          # React + Vite frontend application
│   └── backend/           # NestJS API backend
├── packages/              # Shared packages (future)
├── scripts/               # Build and deployment scripts
├── blueprints/            # Task instructions and SOPs
├── database/              # Database migrations and schemas
└── .workspace/            # Temporary workspace (gitignored)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL 17
- npm 10.2.4+

### Installation

```bash
# Install all dependencies
npm install

# This will install dependencies for all apps in the monorepo
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run specific app
npm run dev --filter=tonys-shoe-store-frontend
npm run dev --filter=tonys-shoe-store-backend
```

### Building

```bash
# Build all apps
npm run build

# Build specific app
npm run build --filter=tonys-shoe-store-frontend
```

### Other Commands

```bash
# Lint all apps
npm run lint

# Run tests
npm run test

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for PostgreSQL
- **Passport** - Authentication middleware
- **JWT** - Token-based authentication

### Database
- **PostgreSQL 17** - Relational database

### DevOps
- **Turborepo** - Monorepo build system
- **TypeScript** - Type safety across all apps

## Project Documentation

See [CLAUDE.md](./CLAUDE.md) for detailed project documentation, architecture decisions, and development guidelines.

## License

Proprietary - All rights reserved
