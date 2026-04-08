# SaaS Toolkit Monorepo

A comprehensive, production-ready monorepo for building modern SaaS applications with Next.js, PostgreSQL, and shadcn/ui.

## 🚀 Tech Stack

- **Language**: TypeScript everywhere
- **Runtime**: Node.js 20+
- **Package Manager**: pnpm workspaces
- **Monorepo Orchestrator**: Turborepo
- **Frontend**: Next.js 16 (App Router, RSC, Server Actions)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Authentication**: NextAuth.js (stubbed)
- **Hosting**: Vercel-ready

## 📁 Project Structure

```
our-product-boilerplate/
├── apps/
│   ├── web/                 # Main Next.js application
│   └── admin/              # Internal admin console (port 3001)
├── packages/
│   ├── @acmecorp/config/       # Shared configurations (ESLint, Prettier, Tailwind)
│   ├── @acmecorp/env/          # Environment validation with Zod
│   ├── @acmecorp/db/           # Prisma client and database schema
│   ├── @acmecorp/api/          # API layer stubs
│   ├── @acmecorp/auth/         # NextAuth configuration and RBAC
│   ├── @acmecorp/users/        # User domain logic
│   ├── @acmecorp/orgs/         # Organization domain logic
│   ├── @acmecorp/router/       # Typed route helpers
│   ├── @acmecorp/ui/           # shadcn/ui components and styling
│   ├── @acmecorp/icons/        # Icon system
│   ├── @acmecorp/email/        # Email templates
│   └── @acmecorp/payments/     # Payment integration stubs
├── package.json            # Root package.json with workspace scripts
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── turbo.json             # Turborepo pipeline configuration
└── README.md              # This file
```

## 🛠️ Prerequisites

- **Node.js**: 20.0.0 or higher
- **pnpm**: 8.15.0 or higher
- **PostgreSQL**: Running instance (for database operations)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd our-product-boilerplate

# Install dependencies (this installs everything for all packages and apps)
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your configuration
# Required variables:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (for authentication)
# - NEXTAUTH_URL (your app URL)
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed
```

### 4. Start Development

```bash
# 🎯 MAIN COMMAND - Start everything from the root folder
pnpm dev

# This single command will:
# ✅ Start the main app on http://localhost:3000
# ✅ Start the admin app on http://localhost:3001
# ✅ Build all packages automatically
# ✅ Enable hot reloading for all apps
# ✅ Handle all workspace dependencies

# Alternative: Start individual apps (only if needed)
pnpm --filter web dev        # Only main app on http://localhost:3000
pnpm --filter admin dev      # Only admin app on http://localhost:3001
```

## 📋 Available Commands

### Root Level Commands

```bash
# Development (from root folder - our-product-boilerplate/)
pnpm dev                    # Start ALL apps simultaneously (web + admin)
pnpm dev --concurrency 15   # Start with custom concurrency

# Building
pnpm build                  # Build all packages and apps
pnpm build --filter web     # Build only the web app
pnpm build --filter admin   # Build only the admin app

# Code Quality
pnpm lint                   # Lint all packages and apps
pnpm typecheck             # Type check all TypeScript files
pnpm format                # Format code with Prettier

# Database Operations
pnpm db:generate           # Generate Prisma client
pnpm db:migrate            # Run database migrations
pnpm db:seed               # Seed database with sample data
pnpm db:studio             # Open Prisma Studio
pnpm db:push               # Push schema changes to database

# Utilities
pnpm clean                 # Clean all build outputs
pnpm test                  # Run tests (when implemented)
pnpm rename @new-name      # Rename all @acmecorp packages to @new-name
```

### Package-Specific Commands

```bash
# Build individual packages
pnpm --filter @acmecorp/ui build
pnpm --filter @acmecorp/db build
pnpm --filter @acmecorp/env build

# Development mode for packages
pnpm --filter @acmecorp/ui dev
pnpm --filter @acmecorp/db dev

# Type checking for packages
pnpm --filter @acmecorp/ui typecheck
pnpm --filter @acmecorp/db typecheck
```

### App-Specific Commands (Alternative - Individual Development)

```bash
# Web App (Main Application) - Only if you want to run it separately
cd apps/web
pnpm dev                   # Start on http://localhost:3000
pnpm build                 # Build for production
pnpm start                 # Start production server
pnpm lint                  # Lint web app

# Admin App (Internal Console) - Only if you want to run it separately
cd apps/admin
pnpm dev                   # Start on http://localhost:3001
pnpm build                 # Build for production
pnpm start                 # Start production server
pnpm lint                  # Lint admin app

# ⚠️ Note: Usually you'll run everything from the root folder with `pnpm dev`
```

## 🌐 Application URLs

When you run `pnpm dev` from the root folder, you'll have access to:

- **Main App**: http://localhost:3000
  - Home page with feature overview
  - Dashboard with sample statistics
  - Uses `@acmecorp/ui` components and styling

- **Admin App**: http://localhost:3001
  - Internal admin console
  - Hidden from search engines
  - Placeholder sections for user management

**Both apps run simultaneously when you use `pnpm dev` from the root!**

## 📦 Package Details

### Core Packages

#### `@acmecorp/config`

Shared configurations for the entire monorepo.

```bash
# Usage in other packages
pnpm add @acmecorp/config --workspace
```

#### `@acmecorp/env`

Environment variable validation with Zod schemas.

```typescript
import { validateServerEnv, validateClientEnv } from "@acmecorp/env";

// Server-side validation
const serverEnv = validateServerEnv(process.env);

// Client-side validation
const clientEnv = validateClientEnv(process.env);
```

#### `@acmecorp/db`

Prisma client and database schema.

```typescript
import { db } from "@acmecorp/db";

// Use the database client
const users = await db.user.findMany();
```

#### `@acmecorp/ui`

shadcn/ui components and styling system.

```typescript
import { Button } from "@acmecorp/ui";

// Use UI components
<Button variant="default">Click me</Button>
```

#### `@acmecorp/icons`

Centralized icon system with Lucide, React Icons, and custom SVG support.

```typescript
import { Icon } from "@acmecorp/icons";

// Use unified icon component
<Icon name="home" size={24} className="text-blue-500" />
<Icon name="github" size={20} />
<Icon name="custom-logo" size={32} />

// Or import directly for better tree-shaking
import { Home, User, Settings } from "@acmecorp/icons";
<Home size={24} />
```

### Domain Packages

#### `@acmecorp/users`

User domain logic and types.

```typescript
import { userService, type User } from "@acmecorp/users";

// Use user service
const user = await userService.findById("user-id");
```

#### `@acmecorp/orgs`

Organization domain logic and types.

```typescript
import { orgService, type Organization } from "@acmecorp/orgs";

// Use organization service
const org = await orgService.findById("org-id");
```

## 🔧 Development Workflow

### Adding New Packages

1. Create package directory:

```bash
mkdir packages/@acmecorpcorp/new-package
cd packages/@acmecorpcorp/new-package
```

2. Initialize package:

```bash
pnpm init
```

3. Add to workspace in `pnpm-workspace.yaml` (already configured)

4. Add build configuration:

```bash
# Add tsup.config.ts for building
# Add tsconfig.json for TypeScript
# Add package.json with proper exports
```

### Adding New Apps

1. Create app directory:

```bash
mkdir apps/new-app
cd apps/new-app
```

2. Initialize Next.js app:

```bash
pnpm create next-app . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

3. Configure workspace integration:

```bash
# Update next.config.js with webpack aliases
# Add @acmecorp/* package dependencies
# Configure TypeScript paths
```

### Code Quality

```bash
# Before committing
pnpm lint                  # Check code style
pnpm typecheck            # Verify TypeScript
pnpm format               # Format code
pnpm build                # Ensure everything builds
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Required for production:

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### Database Migration

```bash
# In production
pnpm db:migrate
pnpm db:generate
```

## 🐛 Troubleshooting

### Common Issues

#### Module Resolution Errors

If you see "Module not found" errors:

```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild packages
pnpm build
```

#### Database Connection Issues

```bash
# Check database URL
echo $DATABASE_URL

# Test connection
pnpm db:studio
```

#### Port Conflicts

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Kill processes if needed
pkill -f "next dev"
```

### Development Tips

1. **Use Turborepo Remote Caching**: Set up remote caching for faster builds
2. **Monitor Bundle Size**: Use `@next/bundle-analyzer` for web apps
3. **Type Safety**: Always run `pnpm typecheck` before committing
4. **Package Dependencies**: Use workspace dependencies (`@acmecorp/*`) instead of relative imports

## 🚀 Deployment

### Vercel Deployment

This monorepo is optimized for Vercel deployment. See the complete deployment guide:

📖 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive Vercel deployment guide

### Quick Deploy

1. **Connect to Vercel**:
   - Import your Git repository
   - Set root directory to `apps/web`
   - Build command: `pnpm build`
   - Install command: `cd ../.. && pnpm install`

2. **Environment Variables**:

   ```bash
   DATABASE_URL=your_postgres_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Deploy**: Click deploy and you're live! 🎉

### Alternative: Use Deployment Script

```bash
# Make the script executable (first time only)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint && pnpm typecheck && pnpm build`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
