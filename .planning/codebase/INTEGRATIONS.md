# External Integrations

**Analysis Date:** 2026-02-10

## APIs & External Services

**None detected.** The application currently has no third-party API integrations (no Stripe, no email services, no cloud storage). All functionality is self-contained.

## Data Storage

**Database:**
- PostgreSQL 17 (local)
  - Connection: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USERNAME`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`
  - Client: TypeORM ^0.3.17 via `@nestjs/typeorm` ^10.0.1
  - Driver: `pg` ^8.11.3
  - Configuration: `apps/backend/src/app.module.ts` (TypeOrmModule.forRootAsync)
  - Entity auto-discovery: `__dirname + '/**/*.entity{.ts,.js}'`
  - Synchronize enabled in development (auto-schema sync)
  - Migrations: `database/migrations/001_initial_schema.sql`, `database/migrations/002_drop_model_3d_url.sql`, `database/migrations/003_update_product_images.sql`

**File Storage:**
- None. Product images are stored as URLs in the database (`product_images` table).

**Caching:**
- None.

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based authentication
  - Implementation: `@nestjs/passport` + `passport-jwt` + `@nestjs/jwt`
  - Password hashing: `bcrypt`
  - Module: `apps/backend/src/auth/` (AuthModule)
  - User module: `apps/backend/src/users/` (UsersModule)

## Monitoring & Observability

**Error Tracking:**
- None.

**Logs:**
- TypeORM query logging enabled in development mode (`logging: configService.get('NODE_ENV') === 'development'`)
- No structured logging framework.

## CI/CD & Deployment

**Hosting:**
- Not configured. Local development only.

**CI Pipeline:**
- Not detected (no `.github/workflows/`, no `Jenkinsfile`, no `Dockerfile` in common locations).

## Environment Configuration

**Required env vars:**
- `POSTGRES_HOST` - Database host (default: `localhost`)
- `POSTGRES_PORT` - Database port (default: `5432`)
- `POSTGRES_USERNAME` - Database user (default: `postgres`)
- `POSTGRES_PASSWORD` - Database password (default: `postgres`)
- `POSTGRES_DATABASE` - Database name (default: `tonys_shoes`)
- `NODE_ENV` - Environment (controls TypeORM sync and logging)
- `PORT` - Backend server port (default: `3000`)
- `REACT_APP_API_URL` - Frontend API base URL

**Secrets location:**
- `.env` file at project root (gitignored)
- `.env.example` provides template

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

## Frontend-Backend Communication

**Pattern:**
- Frontend uses `axios` ^1.6.0 as HTTP client
- Server state managed via `@tanstack/react-query` ^5.17.0
- API base URL configured via `REACT_APP_API_URL` env var
- Backend exposes REST API on `PORT` (default 3000)

---

*Integration audit: 2026-02-10*
