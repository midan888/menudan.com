# CLAUDE.md — MenuForYou

## Project Overview

Restaurant QR Menu SaaS. Full spec lives in [agent.md](agent.md) — read it for detailed architecture, data models, API routes, and feature specs.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (no shadcn — all components are custom-built)
- **Auth**: NextAuth v5 beta (`@auth/drizzle-adapter`, JWT strategy)
- **Database**: PostgreSQL + Drizzle ORM (migrations in `src/lib/db/migrations/`)
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) for menu photo extraction + translations
- **Payments**: Stripe (checkout, portal, webhooks)
- **Email**: Resend
- **Images**: S3-compatible storage (AWS/Lightsail), processed with Sharp
- **Drag & Drop**: dnd-kit
- **QR**: `qrcode` package

## Key Directories

- `src/app/` — Next.js App Router pages and API routes
- `src/app/(auth)/` — Login and register pages
- `src/app/(dashboard)/` — Authenticated dashboard (menu builder, QR, settings, billing, languages, upload)
- `src/app/(public)/r/[slug]/` — Public menu page (customer-facing)
- `src/app/onboarding/` — Post-registration onboarding flow
- `src/components/menu/themes/` — 4 theme components (Classic, Modern, Dark, Bistro) + fonts.css
- `src/components/dashboard/` — Dashboard UI components (MenuBuilder, CategoryCard, ItemFormModal, SortableItem, SettingsForm, QRCodeView, BillingView, LanguagesView, AIUploadView, MobileNav)
- `src/components/ui/` — Shared UI (Toaster)
- `src/lib/` — Core utilities (db, auth, ai, stripe, translate, tenant, rate-limit, email, constants)
- `src/types/` — Shared TypeScript types (User, Tenant, Menu, Category, Item, Translation)

## Database Schema

Tables: `users`, `accounts`, `sessions`, `verification_tokens` (NextAuth), `tenants` (restaurants), `menus`, `categories`, `items`, `translations`, `menu_views` (analytics).

Key relationships: User -> Tenant (1:1 owner), Tenant -> Menus -> Categories -> Items. Translations are polymorphic (entityType + entityId + field).

## API Routes

- `POST /api/auth/register` — User registration
- `GET|POST /api/auth/[...nextauth]` — NextAuth handlers
- `GET|POST /api/menus` + `PATCH|DELETE /api/menus/[id]` — Menu CRUD
- `GET|POST /api/categories` + `PATCH|DELETE /api/categories/[id]` + `PUT /api/categories/reorder`
- `GET|POST /api/items` + `PATCH|DELETE /api/items/[id]` + `PUT /api/items/reorder` + `PATCH /api/items/[id]/availability`
- `POST /api/upload/menu-photo` — AI menu extraction from photo
- `POST /api/upload/menu-photo/save` — Save extracted menu data
- `POST /api/upload/image` — Item image upload to S3
- `POST|GET /api/translate` + `GET /api/translate/[id]` — AI translations
- `GET|PATCH /api/settings` — Tenant settings
- `GET /api/qr` — QR code generation
- `POST /api/stripe/checkout` + `POST /api/stripe/portal` + `POST /api/stripe/webhook`
- `GET|POST|DELETE /api/domains` + `POST /api/domains/verify` + `GET /api/domains/resolve`
- `GET /api/health` — Health check
- `POST /api/onboarding` — Onboarding completion

## Auth & Proxy

- Providers: Google OAuth + email/password credentials
- JWT strategy (not database sessions)
- Proxy (`src/proxy.ts`) handles: custom domain routing (rewrites to `/r/[slug]`), auth redirects for protected paths, redirect authenticated users away from login/register
- Protected paths: `/menu`, `/qr`, `/settings`, `/billing`, `/upload`, `/onboarding`, `/languages`
- Session token cookies: `authjs.session-token` or `__Secure-authjs.session-token`

## Design System

- **Landing page**: Indigo/violet/purple gradient palette with teal accents (recently redesigned)
- **Dashboard**: Tailwind utility classes, gray-900 primary
- **Menu themes**: Self-contained components with inline `<style>` tags, CSS variable `--accent` for tenant accent color
- **Fonts**: Playfair Display, Crimson Pro, Syne, Outfit, DM Sans, Space Mono (loaded via `fonts.css`)
- **No global CSS variable theming** — each theme component owns its own colors/typography

## Plans & Limits

Defined in `src/lib/constants.ts`:
- **Free**: 1 menu, 20 images, 1 AI upload
- **Pro** ($9/mo): 5 menus, 200 images, unlimited AI uploads, custom domain, no watermark
- **Business** ($19/mo): Unlimited everything + priority support

## Supported Features

- 4 menu themes: classic, modern, dark, bistro
- 16 languages for AI translation
- 7 item badges: vegan, vegetarian, gluten-free, spicy, new, chef_pick, popular
- 7 allergens: gluten, dairy, nuts, eggs, soy, fish, shellfish
- Custom domain support with auto-HTTPS (Caddy)

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run db:generate` — Generate Drizzle migrations
- `npm run db:migrate` — Run migrations
- `npm run db:studio` — Open Drizzle Studio

## Environment Variables

See `.env.example` for all required vars. Key groups: App (URL, name), Database (PostgreSQL), Auth (NextAuth + Google OAuth), S3 storage, Anthropic API, Stripe, Resend email, Caddy domain.

## Tailwind v4 Notes

- Use `bg-linear-to-r` (not `bg-gradient-to-r`) — canonical syntax in v4
- Use standard size classes like `h-125` instead of `h-[500px]` where available

## Conventions

- Use `process.env.NEXT_PUBLIC_APP_NAME` for product name references
- Accent color stored per-tenant in DB (`accentColor`), passed as prop to theme components
- Mobile-first responsive design (menu themes max 480px width)
- API routes in `src/app/api/`
- All IDs are UUIDs
- Drizzle ORM with typed queries (no raw SQL)
- Reserved slugs defined in `src/lib/constants.ts`
