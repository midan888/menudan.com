# Restaurant QR Menu SaaS — Project Specification

> **Purpose**: This document is the single source of truth for building this product. It is written for an AI coding agent (Claude Code) to follow step-by-step. Every architectural decision, file structure, data model, and feature spec is defined here. When in doubt, refer to this document.

> **Product name**: TBD (use `{{PRODUCT_NAME}}` as placeholder throughout codebase — easy find-and-replace later). Use `menuapp` as the working directory/repo name.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Infrastructure & Deployment](#3-infrastructure--deployment)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Authentication](#6-authentication)
7. [Feature Specs](#7-feature-specs)
   - 7.1 [Onboarding Flow](#71-onboarding-flow)
   - 7.2 [Menu Builder (Dashboard)](#72-menu-builder-dashboard)
   - 7.3 [Public Menu Page](#73-public-menu-page)
   - 7.4 [QR Code Generation](#74-qr-code-generation)
   - 7.5 [AI Menu Upload from Photo](#75-ai-menu-upload-from-photo)
   - 7.6 [Multi-Language Menus](#76-multi-language-menus)
   - 7.7 [Custom Domains](#77-custom-domains)
   - 7.8 [Image Handling](#78-image-handling)
8. [Design System & Themes](#8-design-system--themes)
9. [API Routes](#9-api-routes)
10. [Build Phases & Order of Implementation](#10-build-phases--order-of-implementation)
11. [Environment Variables](#11-environment-variables)
12. [Testing Strategy](#12-testing-strategy)
13. [Future Features (Post-MVP, Do NOT Build Yet)](#13-future-features-post-mvp-do-not-build-yet)

---

## 1. Product Overview

A simple SaaS that lets restaurant owners put their menu online in under 5 minutes and get a QR code for table placement. Guests scan the QR → see a beautiful, fast-loading mobile menu page. No app download required.

**Core value props:**
- Upload a photo of your paper menu → AI extracts items automatically
- 4-5 curated design themes (owners pick a vibe, not build a website)
- Multi-language support via auto-translation
- Custom domain support
- Real-time menu updates (86 an item instantly)
- QR code generation with print-ready PDF output

**Target user:** Single-location restaurant owners worldwide. English-first UI.

**Business model:** Freemium. Free tier with watermark + limits. Paid tiers at ~$9/mo and ~$19/mo (Stripe).

---

## 2. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 14+ (App Router)** | SSR for public menu pages (SEO + performance), React for dashboard. One codebase. |
| Language | **TypeScript** (strict mode) | Type safety across full stack. |
| Database | **PostgreSQL** (via Supabase or self-hosted on Lightsail) | Relational fits the data model perfectly. Multi-tenant by design. |
| ORM | **Drizzle ORM** | Lightweight, type-safe, fast migrations. No heavy abstraction. |
| Auth | **NextAuth.js (Auth.js v5)** | Google OAuth + email/password (credentials provider). |
| Object Storage | **AWS S3** (Lightsail has S3-compatible storage, or use standard S3) | Menu item images, logos, uploaded PDFs/photos. |
| Image Processing | **sharp** | Server-side resize/compress on upload. |
| QR Generation | **qrcode** npm package | Generate QR codes as PNG/SVG. |
| AI / LLM | **Anthropic Claude API** (claude-sonnet-4-20250514) | Menu photo extraction (vision), menu translation. |
| Payments | **Stripe** (Checkout + Customer Portal) | Subscriptions, invoicing, plan management. |
| Email | **Resend** | Transactional emails (welcome, password reset). |
| Styling | **Tailwind CSS** | Dashboard styling. Public menu pages use custom CSS per theme. |
| DNS/Domains | **Caddy** (reverse proxy) | Automatic HTTPS, custom domain support with on-demand TLS. |
| Containerization | **Docker + Docker Compose** | Single-command deployment. |

### Key Constraints
- **Monolith architecture.** No microservices until there's real scaling pain.
- **No Redis** until proven needed. PostgreSQL handles the read load for menu pages.
- **No message queues.** Direct API calls for AI processing. Add queues only if AI extraction volume demands it.
- **No Kubernetes.** Docker Compose on Lightsail.

---

## 3. Infrastructure & Deployment

### Server: AWS Lightsail

- **Instance**: 2 GB RAM / 2 vCPU ($12/mo) to start. Can scale vertically.
- **OS**: Ubuntu 24.04 LTS
- **Static IP**: Attach a Lightsail static IP.
- **DNS**: Point `yourdomain.com` A record to the static IP. Wildcard `*.yourdomain.com` optional (for future subdomain routing).
- **Storage**: Lightsail Object Storage bucket for images (or standard AWS S3 if preferred).
- **Database**: Self-hosted PostgreSQL in Docker on the same instance (for cost savings at start). Migrate to Lightsail Managed Database or RDS when the time comes.
- **Backups**: Lightsail automatic snapshots (daily). PostgreSQL `pg_dump` cron job to S3 nightly.

### Docker Compose Services

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    env_file: .env
    restart: unless-stopped

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app
    restart: unless-stopped

volumes:
  pgdata:
  caddy_data:
  caddy_config:
```

### Caddyfile (Custom Domain Support)

```caddyfile
# Main domain
yourdomain.com {
    reverse_proxy app:3000
}

# Custom domains — on-demand TLS
:443 {
    tls {
        on_demand
    }
    reverse_proxy app:3000
}
```

Caddy's on-demand TLS automatically provisions Let's Encrypt certificates when a custom domain points to the server. The app validates the domain ownership before Caddy provisions the cert (via Caddy's `on_demand` ask endpoint — see Section 7.7).

### CI/CD

- **GitHub Actions** → build Docker image → push to GitHub Container Registry → SSH into Lightsail → `docker compose pull && docker compose up -d`
- Or simpler: **Watchtower** on the Lightsail instance watching the container registry for updates.
- Branch strategy: `main` = production. Push to `main` triggers deploy.

---

## 4. Project Structure

```
menuapp/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/              # Authenticated dashboard route group
│   │   │   ├── layout.tsx            # Dashboard shell (sidebar, nav)
│   │   │   ├── page.tsx              # Dashboard home / overview
│   │   │   ├── menu/
│   │   │   │   ├── page.tsx          # Menu builder
│   │   │   │   └── [menuId]/page.tsx # Edit specific menu
│   │   │   ├── qr/page.tsx           # QR code generation & download
│   │   │   ├── settings/page.tsx     # Restaurant settings, branding, custom domain
│   │   │   ├── billing/page.tsx      # Stripe customer portal link
│   │   │   └── upload/page.tsx       # AI menu upload from photo
│   │   ├── (public)/                 # Public-facing pages
│   │   │   └── r/
│   │   │       └── [slug]/           # Public menu page
│   │   │           └── page.tsx      # SSR rendered menu
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── menus/route.ts        # CRUD menus
│   │   │   ├── categories/route.ts   # CRUD categories
│   │   │   ├── items/route.ts        # CRUD items
│   │   │   ├── upload/
│   │   │   │   ├── image/route.ts    # Image upload endpoint
│   │   │   │   └── menu-photo/route.ts # AI menu extraction
│   │   │   ├── qr/route.ts           # QR generation
│   │   │   ├── translate/route.ts    # Trigger translation
│   │   │   ├── domains/
│   │   │   │   ├── route.ts          # Custom domain management
│   │   │   │   └── verify/route.ts   # Caddy on_demand ask endpoint
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/route.ts
│   │   │   │   ├── webhook/route.ts
│   │   │   │   └── portal/route.ts
│   │   │   └── health/route.ts
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── ui/                       # Reusable UI primitives (Button, Input, Modal, etc.)
│   │   ├── dashboard/                # Dashboard-specific components
│   │   │   ├── MenuBuilder.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   ├── DragSortList.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── AIUploadFlow.tsx
│   │   │   └── QRCodePreview.tsx
│   │   ├── menu/                     # Public menu page components
│   │   │   ├── themes/
│   │   │   │   ├── ClassicTheme.tsx
│   │   │   │   ├── ModernTheme.tsx
│   │   │   │   ├── DarkTheme.tsx
│   │   │   │   └── BistroTheme.tsx
│   │   │   ├── MenuHeader.tsx
│   │   │   ├── CategorySection.tsx
│   │   │   ├── MenuItem.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   └── landing/                  # Landing page components
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client instance
│   │   │   ├── schema.ts             # All table definitions
│   │   │   └── migrations/           # Drizzle migration files
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── s3.ts                     # S3 client + upload helpers
│   │   ├── ai.ts                     # Anthropic API client + prompts
│   │   ├── translate.ts              # Translation logic (Claude API)
│   │   ├── qr.ts                     # QR code generation helpers
│   │   ├── stripe.ts                 # Stripe client + helpers
│   │   ├── domains.ts                # Custom domain validation logic
│   │   ├── image.ts                  # Sharp image processing
│   │   └── constants.ts              # Plan limits, theme configs, etc.
│   ├── middleware.ts                  # Custom domain routing, auth redirects
│   └── types/                        # Shared TypeScript types
│       └── index.ts
├── public/
│   ├── fonts/                        # Self-hosted fonts for menu themes
│   └── images/
├── drizzle.config.ts
├── Dockerfile
├── docker-compose.yml
├── Caddyfile
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## 5. Database Schema

All tables include `tenant_id` for multi-tenant isolation. **Every query MUST filter by `tenant_id`.** No exceptions.

### Tables

```typescript
// src/lib/db/schema.ts

import { pgTable, uuid, text, varchar, integer, boolean, timestamp, decimal, jsonb, uniqueIndex, index } from 'drizzle-orm/pg-core';

// ── Users ──
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  passwordHash: text('password_hash'),           // null if using OAuth only
  emailVerified: timestamp('email_verified'),
  image: text('image'),                           // avatar URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Tenants (Restaurants) ──
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  coverImageUrl: text('cover_image_url'),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  website: text('website'),
  openingHours: jsonb('opening_hours'),           // { mon: { open: "09:00", close: "22:00" }, ... }

  // Branding
  themeId: varchar('theme_id', { length: 50 }).notNull().default('modern'),
  accentColor: varchar('accent_color', { length: 7 }).default('#111111'),
  defaultLanguage: varchar('default_language', { length: 5 }).default('en'),
  enabledLanguages: jsonb('enabled_languages').default(['en']),  // ['en', 'fr', 'hy', ...]

  // Custom domain
  customDomain: varchar('custom_domain', { length: 255 }),
  domainVerified: boolean('domain_verified').default(false),

  // Subscription
  plan: varchar('plan', { length: 20 }).notNull().default('free'),  // 'free' | 'pro' | 'business'
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  trialEndsAt: timestamp('trial_ends_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('tenants_slug_idx').on(table.slug),
  ownerIdx: index('tenants_owner_idx').on(table.ownerId),
  customDomainIdx: uniqueIndex('tenants_custom_domain_idx').on(table.customDomain),
}));

// ── Menus ──
// Most tenants have 1 menu, but the model supports multiple (lunch/dinner/drinks)
export const menus = pgTable('menus', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull().default('Main Menu'),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantIdx: index('menus_tenant_idx').on(table.tenantId),
}));

// ── Categories ──
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuId: uuid('menu_id').notNull().references(() => menus.id, { onDelete: 'cascade' }),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  menuIdx: index('categories_menu_idx').on(table.menuId),
  tenantIdx: index('categories_tenant_idx').on(table.tenantId),
}));

// ── Items ──
export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').notNull().default(true),
  badges: jsonb('badges').default([]),             // ['vegan', 'spicy', 'new', 'chef_pick']
  allergens: jsonb('allergens').default([]),       // ['gluten', 'dairy', 'nuts', ...]
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index('items_category_idx').on(table.categoryId),
  tenantIdx: index('items_tenant_idx').on(table.tenantId),
}));

// ── Translations ──
// Stores translated versions of menu content per language
export const translations = pgTable('translations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  language: varchar('language', { length: 5 }).notNull(),    // 'fr', 'hy', 'ru', 'zh', etc.
  entityType: varchar('entity_type', { length: 20 }).notNull(), // 'item' | 'category' | 'menu'
  entityId: uuid('entity_id').notNull(),
  field: varchar('field', { length: 50 }).notNull(),         // 'name' | 'description'
  value: text('value').notNull(),
  isAutoTranslated: boolean('is_auto_translated').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  lookupIdx: uniqueIndex('translations_lookup_idx').on(
    table.tenantId, table.language, table.entityType, table.entityId, table.field
  ),
}));

// ── Menu Views (Analytics — Phase 2, but create table now) ──
export const menuViews = pgTable('menu_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  menuId: uuid('menu_id').references(() => menus.id),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
  userAgent: text('user_agent'),
  language: varchar('language', { length: 5 }),              // which language the guest viewed
  referrer: text('referrer'),
}, (table) => ({
  tenantViewedIdx: index('menu_views_tenant_viewed_idx').on(table.tenantId, table.viewedAt),
}));

// ── NextAuth Required Tables ──
// NextAuth requires accounts, sessions, and verification_tokens tables.
// Use the official Drizzle adapter schema:
// https://authjs.dev/getting-started/adapters/drizzle
// Include these tables as defined in the adapter docs. Do not customize them.
```

### Key Schema Decisions

- **`tenant_id` on every table**: Redundant on `categories` and `items` (could be derived via joins), but having it directly enables simple, fast queries and makes tenant isolation foolproof.
- **`translations` as a separate table**: EAV-style. Avoids adding `name_fr`, `name_ru` columns for every language. Query pattern: fetch base items, then left-join translations for the requested language.
- **`menuViews` created now but populated later**: Table is cheap. Avoids a migration during Phase 2.
- **`badges` and `allergens` as JSONB arrays**: Simple, queryable, no join tables needed for this use case.
- **`openingHours` as JSONB**: Flexible enough for varied formats without overengineering.

---

## 6. Authentication

### Providers
1. **Google OAuth** — primary, lowest friction for sign-up
2. **Email + Password** (credentials provider) — fallback for users who don't use Google

### Auth Flow
- Sign up → create user → redirect to onboarding (create first restaurant/tenant)
- Login → redirect to dashboard
- Each user can own **one tenant** on free plan, **multiple** on business plan
- Dashboard routes are protected by middleware — redirect to `/login` if no session

### Implementation Notes
- Use Auth.js v5 with the Drizzle adapter
- Store session in database (not JWT) for easy invalidation
- Middleware in `src/middleware.ts` checks auth for `/(dashboard)/*` routes
- Custom domain routing also happens in middleware (see Section 7.7)

---

## 7. Feature Specs

### 7.1 Onboarding Flow

**Trigger**: After first login, if user has no tenant.

**Steps**:
1. "Name your restaurant" — text input, auto-generates slug (kebab-case, deduplicated)
2. "Choose your style" — visual grid of 4 theme thumbnails, click to select
3. "Upload your logo" (optional) — drag-and-drop or file picker, max 2MB, auto-crop to square
4. → Redirect to menu builder with an empty menu created

**Slug generation**:
- `"Le Petit Jardin"` → `le-petit-jardin`
- If taken, append random 4-digit suffix: `le-petit-jardin-4829`
- Validate: lowercase alphanumeric + hyphens only, 3-60 chars
- Reserved slugs: `app`, `api`, `admin`, `dashboard`, `login`, `register`, `settings`, `www`, `menu`, `help`, `support`, `pricing`, `about`

### 7.2 Menu Builder (Dashboard)

**The core CRUD interface for managing the menu.**

**Layout**: Left sidebar with navigation (Menu, QR Codes, Settings, Billing). Main area is the menu builder.

**Menu builder UI**:
- Top: dropdown to select which menu (if multiple), + "Add Menu" button
- Below: list of categories, each expandable/collapsible
- Each category: header with name (inline-editable) + "Add Item" button + drag handle
- Each item: row showing name, price, availability toggle, edit button, drag handle
- Drag-to-reorder within categories (items) and across the menu (categories)
- Click item → slide-out panel or modal with full edit form

**Item edit form fields**:
- Name (required, text)
- Description (optional, textarea, max 500 chars)
- Price (required, number with 2 decimal places)
- Currency (select, default from tenant settings)
- Image (optional, upload via drag-drop or file picker)
- Available toggle (boolean)
- Badges (multi-select: Vegan, Vegetarian, Gluten-Free, Spicy, New, Chef's Pick, Popular)
- Allergens (multi-select: Gluten, Dairy, Nuts, Eggs, Soy, Fish, Shellfish)

**Drag and drop**: Use `@dnd-kit/sortable` for drag-to-reorder. Persist sort order to DB on drop (debounced PATCH to API).

**Auto-save**: Changes save automatically. Show a subtle "Saved" / "Saving..." indicator. No explicit save button.

### 7.3 Public Menu Page

**URL**: `yourdomain.com/r/{slug}` or custom domain (see 7.7)

**This is the most important page in the entire product.** It must:
- Load in < 1 second on 3G
- Look beautiful on mobile (375px primary target)
- Work on desktop too (centered, max-width ~480px)
- Be fully SSR rendered (SEO + speed)
- Have zero JavaScript required for basic viewing (progressive enhancement only)
- Include OpenGraph meta tags + auto-generated OG image

**Rendering logic**:
1. Middleware checks if request is from a custom domain → resolve to tenant
2. Or: parse slug from URL `/r/{slug}` → fetch tenant
3. Fetch tenant settings (theme, branding, languages)
4. Fetch active menu(s) with categories and items (ordered by `sortOrder`)
5. If `?lang=xx` query param, fetch translations for that language
6. Render using the selected theme component
7. Log view to `menuViews` table (fire-and-forget, don't block render)

**Theme rendering**:
- Each theme is a React server component that receives the same props: `{ tenant, menus, categories, items, translations, currentLanguage }`
- The theme controls ALL visual presentation: layout, fonts, colors, spacing
- Tenant's `accentColor` is passed as a CSS variable `--accent` and used by themes
- Themes are in `src/components/menu/themes/`

**Menu page structure** (common across themes):
- Header: restaurant name, logo, tagline/description, optional cover image
- Optional: address, opening hours, phone
- Language switcher (if multiple languages enabled)
- Menu tabs (if multiple menus)
- Categories with items
- Each item: name, description, price, optional image, badges, availability
- Footer: "Powered by {{PRODUCT_NAME}}" (free tier) or nothing (paid tier)

**Performance**:
- Use Next.js ISR (Incremental Static Regeneration) with `revalidate: 60` — pages are cached and regenerated every 60 seconds. This means menu updates appear within 1 minute.
- Images served from S3/CDN with `next/image` for automatic WebP/AVIF conversion and responsive sizing.
- Self-host fonts (Google Fonts subset) — no external requests.
- Critical CSS inlined.

### 7.4 QR Code Generation

**Dashboard page**: `/dashboard/qr`

**Features**:
- Preview of the QR code pointing to the public menu URL
- Download as PNG (high-res, 1024x1024)
- Download as SVG (vector, scalable)
- Download as print-ready PDF containing:
  - Option A: Single large QR code with restaurant name (for window/counter)
  - Option B: Grid of 6 smaller QR codes (for cutting and placing on tables)
  - Option C: Table tent template (foldable card with QR on both sides)
- QR code encodes: `https://yourdomain.com/r/{slug}` (or custom domain if configured)
- On paid tiers: option to add restaurant logo in QR center + accent color

**Implementation**:
- Use `qrcode` npm package for generation
- PDF generation: use `@react-pdf/renderer` or `pdfkit` for the print layouts
- All generation happens server-side via API route, client downloads the result

### 7.5 AI Menu Upload from Photo

**Dashboard page**: `/dashboard/upload`

**Flow**:
1. Owner uploads a photo of their paper menu (or PDF)
2. Client sends image to `/api/upload/menu-photo`
3. Server sends image to Claude Vision API with extraction prompt
4. Claude returns structured JSON of categories and items
5. Server returns extracted data to client
6. Client shows the extracted menu in an **editable preview** — owner can fix names, prices, add missing items, remove errors
7. Owner confirms → data is saved to DB as a new menu (or merged into existing)

**Claude Vision Prompt** (store in `src/lib/ai.ts`):

```
You are a menu extraction assistant. Analyze this restaurant menu image and extract ALL menu items.

Return ONLY valid JSON in this exact format:
{
  "categories": [
    {
      "name": "Category Name",
      "items": [
        {
          "name": "Item Name",
          "description": "Brief description if visible, otherwise empty string",
          "price": 12.50
        }
      ]
    }
  ],
  "currency": "USD",
  "notes": "Any relevant notes about the extraction, e.g. items that were unclear"
}

Rules:
- Extract every item visible on the menu
- Preserve the original language of item names
- Convert all prices to numbers (no currency symbols)
- Detect the currency from symbols or context (USD, EUR, GBP, AMD, RUB, etc.)
- If a price is unclear or missing, set it to 0 and note it
- Group items into their original categories as shown on the menu
- If no clear categories exist, group logically (Starters, Mains, Desserts, Drinks)
- Return ONLY the JSON, no other text
```

**Limits**:
- Free tier: 1 AI upload
- Pro/Business: unlimited
- Max file size: 10MB
- Supported formats: JPEG, PNG, PDF (first page only), HEIC

**Cost estimation**: Claude Sonnet with vision ≈ $0.01-0.03 per extraction.

### 7.6 Multi-Language Menus

**How it works**:
1. Owner writes their menu in one language (the `defaultLanguage`)
2. Owner enables additional languages in settings (e.g., French, Russian, Armenian, Chinese)
3. When languages are enabled, the system auto-translates all menu content via Claude API
4. Translations are stored in the `translations` table
5. Owner can review and manually edit any translation in the dashboard
6. Guest-facing menu shows a language switcher; selecting a language adds `?lang=xx` to the URL

**Translation prompt** (store in `src/lib/translate.ts`):

```
Translate the following restaurant menu content from {sourceLanguage} to {targetLanguage}.

This is for a restaurant menu, so:
- Keep food item names that are commonly known in their original form (e.g., "Bruschetta" stays as "Bruschetta" in most languages)
- Translate descriptions naturally, not literally
- Maintain the same tone and style
- Keep it concise — this is for a mobile menu display

Input (JSON):
{input}

Return ONLY valid JSON in the same structure with translated values. Do not translate the JSON keys, only the values.
```

**Translation trigger**:
- Batch translate when a new language is enabled
- Re-translate individual items when they're updated (debounced)
- Mark translations as `isAutoTranslated: true`; when owner edits, set to `false` (manual edits are never overwritten by auto-translation)

**Language switcher UI**:
- Small dropdown or pill buttons at the top of the public menu page
- Uses native language names: "English", "Français", "Русский", "Հայերեն"
- Switching language updates `?lang=xx` query param (no full page reload — client-side navigation for this part)

**Supported languages** (start with these, expand based on demand):
English, French, Spanish, German, Italian, Portuguese, Russian, Armenian, Arabic, Chinese (Simplified), Japanese, Korean, Turkish, Hindi, Thai, Vietnamese

### 7.7 Custom Domains

**How it works**:
1. Owner enters their custom domain in settings (e.g., `menu.myrestaurant.com`)
2. App shows instructions: "Add a CNAME record pointing `menu.myrestaurant.com` to `yourdomain.com`"
3. Owner adds the DNS record
4. Owner clicks "Verify" → app checks DNS resolution
5. Once verified, Caddy automatically provisions TLS certificate via Let's Encrypt
6. Guests visiting `menu.myrestaurant.com` see the restaurant's menu

**Technical flow**:

1. **Domain registration** (`POST /api/domains`):
   - Validate domain format
   - Save to `tenants.customDomain`, set `domainVerified: false`

2. **Domain verification** (`POST /api/domains/verify`):
   - DNS lookup: check if CNAME/A record points to our server IP
   - If valid: set `domainVerified: true`
   - If not: return helpful error ("DNS record not found yet. It can take up to 48 hours to propagate.")

3. **Caddy on-demand TLS validation** (`GET /api/domains/verify?domain=xxx`):
   - Caddy calls this endpoint before provisioning a certificate
   - Return 200 if domain exists in our DB and is verified
   - Return 404 otherwise (prevents abuse)
   - Configure in Caddyfile: `on_demand { ask http://app:3000/api/domains/verify }`

4. **Request routing** (in `src/middleware.ts`):
   - Check `Host` header
   - If it matches a verified custom domain → look up tenant → rewrite to `/r/{slug}`
   - If it's our main domain → normal routing
   - This is transparent to the user — they see their custom domain in the browser

**Plan restriction**: Custom domains are Pro and Business tier only.

### 7.8 Image Handling

**Upload flow**:
1. Client uploads image via `<input type="file">` or drag-drop
2. POST to `/api/upload/image` as `multipart/form-data`
3. Server processes with Sharp:
   - Resize to max 1200px width (maintain aspect ratio)
   - Generate thumbnail at 400px width
   - Convert to WebP (with JPEG fallback)
   - Strip EXIF data
   - Compress: quality 80
4. Upload both sizes to S3 bucket: `{tenantId}/{type}/{uuid}.webp`
5. Return URLs for both sizes

**File structure in S3**:
```
{tenantId}/
  logos/
    {uuid}.webp
  covers/
    {uuid}.webp
  items/
    {uuid}.webp
    {uuid}_thumb.webp
  uploads/
    {uuid}.{ext}          # Original uploaded menu photos for AI extraction
```

**Limits**:
- Max file size: 5MB (images), 10MB (menu photos for AI)
- Accepted formats: JPEG, PNG, WebP, HEIC
- Free tier: max 20 item images
- Pro: max 200 item images
- Business: unlimited

---

## 8. Design System & Themes

### Dashboard Design

- **Style**: Clean, functional, minimal. Tailwind CSS with a neutral palette.
- **Colors**: White background, gray-900 text, gray-100 borders. Accent color for primary actions (blue-600 or similar).
- **Typography**: System font stack (`font-sans` in Tailwind) — no custom fonts needed for the dashboard.
- **Components**: Standard form elements, cards, modals, dropdowns. Use shadcn/ui components or build simple equivalents with Tailwind.
- **Responsive**: Desktop-first (restaurant owners likely manage on laptop/desktop), but should work on tablet.

### Public Menu Themes

There are 4 themes. Each theme is a self-contained React component with its own CSS. Themes receive the same data props and render the menu differently.

**Theme 1: Classic**
- Aesthetic: Editorial, warm, sophisticated
- Fonts: Playfair Display (headings) + Crimson Pro (body)
- Colors: Cream background (#FDFBF7), dark brown text (#2C2420), muted accents
- Layout: Optional hero/cover image at top, left-aligned categories, items with descriptions
- Best for: Fine dining, wine bars, upscale casual

**Theme 2: Modern**
- Aesthetic: Clean, contemporary, minimal
- Fonts: Syne (headings) + Outfit (body)
- Colors: White background, near-black text, gray accents. Accent color as highlight.
- Layout: Logo circle + name header, horizontal tab navigation for multiple menus, clean item cards
- Best for: Casual dining, fusion, cafes, brunch spots

**Theme 3: Dark**
- Aesthetic: Moody, bold, premium
- Fonts: Playfair Display (headings) + DM Sans (body) + Space Mono (prices)
- Colors: Near-black background (#0A0A0A), warm gold accent (#C8A064), white text
- Layout: Gold accent line, pill-shaped category tabs, generous spacing
- Best for: Bars, cocktail lounges, steakhouses, night venues

**Theme 4: Bistro**
- Aesthetic: Traditional, charming, European
- Fonts: Playfair Display (headings, italic) + Crimson Pro (body)
- Colors: Warm parchment (#F5EDE3), dark brown text (#3D2E1E), gold accents (#B8860B)
- Layout: Centered text, dotted price lines (name ..... $12), ornamental dividers, classic menu feel
- Best for: Bistros, trattorias, traditional restaurants, bakeries

**Theme CSS approach**:
- Each theme has a CSS module or styled component
- Fonts are self-hosted in `/public/fonts/` (subset to latin + cyrillic + armenian for our target)
- The `--accent` CSS variable is set from `tenant.accentColor` and used for highlights, buttons, active states
- Themes reference `--accent` for their accent color — meaning the same theme looks different for each restaurant

### Mobile-First Design Rules

- Primary viewport target: 375px wide (iPhone SE/12 Mini)
- Max content width: 480px, centered on larger screens
- Touch targets: minimum 44x44px
- Font sizes: minimum 14px for body text, 12px for secondary text
- Spacing: use 8px grid (8, 16, 24, 32, 40, 48...)
- Images: lazy-loaded, with aspect-ratio placeholder to prevent layout shift

---

## 9. API Routes

All API routes require authentication except where noted.

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| * | `/api/auth/[...nextauth]` | Public | NextAuth handlers |

### Menus

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/menus` | Yes | List menus for current tenant |
| POST | `/api/menus` | Yes | Create new menu |
| PATCH | `/api/menus/:id` | Yes | Update menu (name, isActive, sortOrder) |
| DELETE | `/api/menus/:id` | Yes | Delete menu + cascade |

### Categories

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories?menuId=x` | Yes | List categories for a menu |
| POST | `/api/categories` | Yes | Create category |
| PATCH | `/api/categories/:id` | Yes | Update category |
| PATCH | `/api/categories/reorder` | Yes | Batch update sortOrder |
| DELETE | `/api/categories/:id` | Yes | Delete category + cascade |

### Items

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/items?categoryId=x` | Yes | List items for a category |
| POST | `/api/items` | Yes | Create item |
| PATCH | `/api/items/:id` | Yes | Update item |
| PATCH | `/api/items/reorder` | Yes | Batch update sortOrder |
| PATCH | `/api/items/:id/availability` | Yes | Quick toggle isAvailable |
| DELETE | `/api/items/:id` | Yes | Delete item |

### Uploads

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/upload/image` | Yes | Upload and process an image |
| POST | `/api/upload/menu-photo` | Yes | Upload menu photo for AI extraction |

### Translation

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/translate` | Yes | Trigger translation for a language |
| GET | `/api/translate?lang=xx` | Yes | Get translations for review/edit |
| PATCH | `/api/translate/:id` | Yes | Edit a specific translation |

### QR Code

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/qr?format=png\|svg\|pdf&layout=single\|grid\|tent` | Yes | Generate and download QR |

### Custom Domains

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/domains` | Yes | Set custom domain |
| POST | `/api/domains/verify` | Yes | Verify DNS for custom domain |
| DELETE | `/api/domains` | Yes | Remove custom domain |
| GET | `/api/domains/verify?domain=x` | **Public** | Caddy on-demand TLS ask endpoint |

### Stripe

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/stripe/checkout` | Yes | Create Stripe Checkout session |
| POST | `/api/stripe/portal` | Yes | Create Stripe Customer Portal session |
| POST | `/api/stripe/webhook` | **Public** (Stripe signature) | Handle Stripe webhook events |

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | Public | Health check for monitoring |

---

## 10. Build Phases & Order of Implementation

### Phase 1: Skeleton (Target: 2-3 days)

Build in this exact order:

1. `npx create-next-app@latest menuapp --typescript --tailwind --app --src-dir`
2. Install dependencies: `drizzle-orm`, `drizzle-kit`, `pg`, `next-auth`, `@auth/drizzle-adapter`, `sharp`, `qrcode`, `@anthropic-ai/sdk`, `stripe`
3. Set up Drizzle: config, schema (all tables from Section 5), initial migration
4. Set up Docker Compose (app + postgres + caddy)
5. Set up NextAuth with Google OAuth + Credentials provider
6. Create middleware for auth protection on dashboard routes
7. Verify: can sign up, sign in, see empty dashboard. DB tables exist. Docker runs.

**Definition of done**: `docker compose up` starts the entire stack. Auth works. DB is migrated.

### Phase 2: Core Menu CRUD (Target: 5-7 days)

1. Onboarding flow (Section 7.1) — create tenant after first login
2. Menu builder UI (Section 7.2) — full CRUD for menus, categories, items
3. Image upload endpoint (Section 7.8) — upload, process, store in S3
4. Drag-to-reorder for categories and items
5. Auto-save with debounced API calls

**Definition of done**: Owner can sign up, create a restaurant, build a complete menu with images, reorder items.

### Phase 3: Public Menu Page + QR (Target: 4-5 days)

1. Implement all 4 theme components (Section 8)
2. Public menu page with SSR (Section 7.3)
3. Theme selection in restaurant settings
4. QR code generation + download (Section 7.4) — PNG, SVG, print PDF
5. OpenGraph meta tags + OG image generation
6. Performance optimization: ISR, image optimization, font loading

**Definition of done**: QR code scans → beautiful mobile menu loads fast. All 4 themes work.

### Phase 4: AI Upload + Translation (Target: 4-5 days)

1. AI menu photo extraction (Section 7.5) — upload, extract, review, save
2. Multi-language translation system (Section 7.6) — auto-translate, edit, language switcher
3. Language switcher on public menu page
4. Translation management UI in dashboard

**Definition of done**: Owner uploads a menu photo → items are extracted → menu is translated to 2+ languages → guests can switch languages.

### Phase 5: Custom Domains + Stripe (Target: 3-4 days)

1. Custom domain flow (Section 7.7) — register, verify, route
2. Caddy on-demand TLS configuration
3. Stripe integration — plans, checkout, webhook, portal
4. Plan enforcement (feature gating based on plan)
5. "Powered by" watermark on free tier

**Definition of done**: Full billing cycle works. Custom domain with auto-TLS works. Free/Pro/Business tiers enforced.

### Phase 6: Polish & Launch (Target: 3-4 days)

1. Landing page — hero, features, pricing, demo QR, CTA
2. Error handling throughout (toast notifications, form validation, API error states)
3. Loading states and skeleton screens
4. Empty states (no menus yet, no items, etc.)
5. Mobile responsiveness audit
6. SEO: sitemap, robots.txt, structured data (Restaurant schema)
7. Transactional emails via Resend (welcome, password reset)
8. Final security audit: rate limiting on API routes, input sanitization, CSRF

**Definition of done**: Production-ready. Landing page converts. No broken states.

---

## 11. Environment Variables

```bash
# .env.example

# ── App ──
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME={{PRODUCT_NAME}}

# ── Database ──
DATABASE_URL=postgresql://user:password@db:5432/menuapp
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=menuapp

# ── Auth ──
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-a-random-32-char-string
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── AWS S3 / Lightsail Object Storage ──
S3_BUCKET=menuapp-assets
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=                          # For Lightsail: https://s3.us-east-1.amazonaws.com

# ── Anthropic (AI) ──
ANTHROPIC_API_KEY=

# ── Stripe ──
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=

# ── Email (Resend) ──
RESEND_API_KEY=
EMAIL_FROM=noreply@yourdomain.com

# ── Caddy ──
CADDY_DOMAIN=yourdomain.com
```

---

## 12. Testing Strategy

**For MVP, keep testing pragmatic:**

- **Type safety**: TypeScript strict mode catches most bugs at compile time. This is your primary defense.
- **API route tests**: Use Vitest + light integration tests for critical API routes (menu CRUD, auth, stripe webhook). Mock DB with test database.
- **E2E smoke tests**: One Playwright test that: signs up → creates a restaurant → adds a menu item → visits the public page → verifies the item appears. This single test catches 80% of regressions.
- **Manual testing**: QR scanning, mobile browsers, slow network simulation.

**Do NOT invest in**:
- Unit tests for React components (visual testing is unreliable for this type of app)
- 100% coverage goals
- Test infrastructure that takes longer to maintain than the code it tests

---

## 13. Future Features (Post-MVP, Do NOT Build Yet)

These are listed here so the architecture can accommodate them, but they should NOT be built during MVP phases.

- **Analytics dashboard**: Scan counts, peak hours, popular items (data is already being collected in `menuViews`)
- **Daily specials banner**: Simple announcement at the top of the menu
- **Online ordering integration**: Partner with delivery services or build basic order flow
- **Reservation link**: Link out to OpenTable, Resy, or embedded widget
- **Multiple locations**: One owner account, multiple tenants
- **Team members**: Invite staff with limited permissions
- **Menu scheduling**: Automatically switch between lunch/dinner menus at set times
- **PDF menu download**: Generate a pretty PDF version of the digital menu
- **Social sharing**: Share menu link on Instagram, WhatsApp with preview
- **Reviews/feedback**: Simple feedback form on the menu page
- **A/B testing themes**: Let owners try different themes and see which gets more engagement
- **White-label/reseller**: Agencies can manage multiple restaurants under their brand

---

## Appendix: Quick Reference Commands

```bash
# Development
npm run dev                              # Start Next.js dev server
npx drizzle-kit generate                 # Generate migration from schema changes
npx drizzle-kit migrate                  # Run migrations
npx drizzle-kit studio                   # Visual DB browser

# Docker
docker compose up -d                     # Start all services
docker compose logs -f app               # Follow app logs
docker compose down                      # Stop all services
docker compose up -d --build             # Rebuild and restart

# Database
docker compose exec db psql -U user -d menuapp   # Connect to DB

# Deployment
docker compose -f docker-compose.prod.yml up -d --build
```