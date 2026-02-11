# Technology Stack

**Analysis Date:** 2026-02-10

## Languages

**Primary:**
- TypeScript ^5.9.3 (root) / ^5.1.3 (backend) - All application code

**Secondary:**
- JavaScript - Config files (`tailwind.config.js`, `postcss.config.js`, `eslint.config.js`)
- SQL - Database migrations (`database/migrations/*.sql`)

## Runtime

**Environment:**
- Node.js >= 18.0.0 (specified in `package.json` engines)

**Package Manager:**
- npm 10.2.4 (specified via `packageManager` field in root `package.json`)
- Lockfile: `package-lock.json`

## Frameworks

**Core:**
- React ^18.3.1 - Frontend UI (`apps/frontend/`)
- NestJS ^10.0.0 - Backend API (`apps/backend/`)

**Testing:**
- Jest ^29.5.0 - Backend unit/e2e testing
- ts-jest ^29.1.0 - TypeScript transform for Jest
- Supertest ^6.3.3 - HTTP assertion testing

**Build/Dev:**
- Vite ^5.4.10 - Frontend bundler and dev server (`apps/frontend/vite.config.ts`)
- Turborepo ^2.3.0 - Monorepo orchestration (`turbo.json`)
- NestJS CLI ^10.0.0 - Backend build/dev (`nest build`, `nest start --watch`)

## Key Dependencies

**Critical (Frontend):**
- react-router-dom ^6.21.0 - Client-side routing
- @tanstack/react-query ^5.17.0 - Server state management and data fetching
- zustand ^4.4.0 - Client state management
- axios ^1.6.0 - HTTP client for API calls

**Critical (Backend):**
- @nestjs/typeorm ^10.0.1 + typeorm ^0.3.17 - ORM for PostgreSQL
- pg ^8.11.3 - PostgreSQL driver
- @nestjs/jwt ^10.2.0 + @nestjs/passport ^10.0.3 + passport-jwt ^4.0.1 - JWT authentication
- bcrypt ^5.1.1 - Password hashing
- class-validator ^0.14.0 + class-transformer ^0.5.1 - DTO validation and transformation
- @nestjs/config ^3.1.0 - Environment configuration

**Infrastructure:**
- tailwindcss ^3.4.0 - Utility CSS framework (`apps/frontend/tailwind.config.js`)
- autoprefixer ^10.4.16 + postcss ^8.4.32 - CSS processing
- reflect-metadata ^0.2.0 - Decorator metadata (required by NestJS/TypeORM)
- rxjs ^7.8.1 - Reactive extensions (NestJS dependency)

**Code Quality:**
- eslint ^8.44.0 (root/backend) / ^9.39.2 (frontend) - Linting
- prettier ^3.2.5 (root) / ^3.0.0 (backend) - Code formatting
- @typescript-eslint/parser + @typescript-eslint/eslint-plugin - TypeScript ESLint

## Configuration

**Environment:**
- `.env` file at project root (loaded by `@nestjs/config` via `ConfigModule.forRoot()`)
- Backend reads env from both `.env` and `../../.env` (see `apps/backend/src/app.module.ts`)
- Required vars: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USERNAME`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`, `NODE_ENV`, `PORT`
- Frontend API URL: `REACT_APP_API_URL`

**Build:**
- `turbo.json` - Turborepo task pipeline configuration
- `apps/frontend/vite.config.ts` - Vite build config
- `apps/frontend/tsconfig.json` - Frontend TS config (target ES2020, strict, path alias `@/*` -> `src/*`)
- `apps/backend/tsconfig.json` - Backend TS config (target ES2021, CommonJS, decorators enabled)

**TypeScript:**
- Frontend: strict mode, bundler module resolution, `@/*` path alias
- Backend: strictNullChecks, noImplicitAny, experimentalDecorators, emitDecoratorMetadata

## Platform Requirements

**Development:**
- Node.js >= 18
- npm 10.x
- PostgreSQL 17 (local instance)
- TypeORM `synchronize: true` in development mode (auto-creates tables)

**Production:**
- Node.js runtime for backend (`node dist/main`)
- Static file hosting for frontend (Vite build output in `apps/frontend/dist/`)
- PostgreSQL 17 database

---

*Stack analysis: 2026-02-10*
