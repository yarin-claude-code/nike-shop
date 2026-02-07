# Blueprint: Project Initialization

## Goal

Set up the complete monorepo with React frontend, NestJS backend, and PostgreSQL database connection.

## Inputs Required

- project_name: string (Tony's Shoe Store)
- postgres_config: object (host, port, username, password, database)

## Skills Reference

- `senior-fullstack-skill.md` - Project scaffolding patterns
- `postgres-database-skill.md` - Database connection setup

## Steps

### 1. Initialize Monorepo Structure

```bash
# Create frontend (React + Vite + TypeScript)
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install

# Create backend (NestJS)
npm i -g @nestjs/cli
nest new backend --package-manager npm
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install @react-three/fiber @react-three/drei three @types/three
npm install zustand axios react-router-dom
npm install tailwindcss postcss autoprefixer
npm install @tanstack/react-query
npx tailwindcss init -p
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/config @nestjs/passport passport passport-jwt
npm install bcrypt class-validator class-transformer
npm install @types/bcrypt @types/passport-jwt --save-dev
```

### 4. Configure Environment Variables

Create `.env` in backend:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=tonys_shoe_store
JWT_SECRET=your_jwt_secret
```

### 5. Configure TypeORM Connection

In `backend/src/app.module.ts`:
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Use migrations in production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 6. Setup Tailwind Config

In `frontend/tailwind.config.js`:
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        accent: '#ff6b35',
      },
    },
  },
  plugins: [],
}
```

### 7. Verify Setup

```bash
# Test backend
cd backend && npm run start:dev

# Test frontend
cd frontend && npm run dev

# Test database connection
psql -h localhost -U your_username -d tonys_shoe_store
```

## Expected Output

- `/frontend` - React + Vite + Three.js app
- `/backend` - NestJS API connected to PostgreSQL
- Both running locally without errors

## Edge Cases

- **PostgreSQL not running**: Start PostgreSQL service first
- **Port conflicts**: Change ports in .env (default: 3000 backend, 5173 frontend)
- **Node version mismatch**: Use Node 18+ for compatibility

## Known Issues

- **TypeORM synchronize:true in dev**: Safe for development, NEVER use in production
- **CORS errors**: Configure CORS in NestJS main.ts for frontend origin
