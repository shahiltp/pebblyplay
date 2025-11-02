## PebblyPlay

INR-first toy e-commerce scaffold using Next.js 15, Prisma, and Auth.js.

### Stack
- Next.js App Router, TypeScript strict
- Tailwind + shadcn-like UI
- Auth.js (NextAuth) with Google OAuth + Credentials
- Prisma (PostgreSQL)
- UploadThing for image uploads
- ISR (Incremental Static Regeneration) for product pages

### Quickstart
1. Install deps
```bash
pnpm i
```

2. Install UploadThing and additional dependencies
```bash
pnpm add uploadthing @uploadthing/react sonner
```

3. Generate Prisma client
```bash
pnpm dlx prisma generate
```

4. Create `.env` from `.env.example` and fill values
   - Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - UploadThing: `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` (get from [uploadthing.com](https://uploadthing.com))

5. Run migrations
```bash
pnpm dlx prisma migrate dev --name catalog_init
```

6. Seed database (admin + categories + sample products)
```bash
pnpm prisma db seed
```

7. Start dev server
```bash
pnpm dev
```

The server will run on `http://localhost:3001`

### Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/pebblyplay"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3001"

# Admin User (for seeding)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# UploadThing (for image uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Razorpay (for payments)
# Get these from https://dashboard.razorpay.com
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxx"
```

### Routes

#### Public Routes
- `/` - Homepage
- `/catalog` - Product catalog with filters, pagination, and sorting
- `/product/[slug]` - Product detail page with ISR (60s revalidation)
- `/sign-up` - User registration
- `/sign-in` - User login
- `/cart` - Shopping cart (coming soon)

#### Protected Routes (Authentication Required)
- `/account` - User account page

#### Admin Routes (OWNER/STAFF Only)
- `/admin` - Admin dashboard
- `/admin/products` - Product list with search and filters
- `/admin/products/new` - Create new product
- `/admin/products/[id]/edit` - Edit product

### Features

#### Product Management
- Full CRUD for products, variants, and images
- Image uploads via UploadThing (max 5MB, JPEG/PNG/WebP)
- Product variants with option values (e.g., color, size)
- Stock management
- Product status (DRAFT, ACTIVE, ARCHIVED)
- Age range filtering

#### Catalog
- Server-side filtering by category, price, age range
- Sorting (price, newest)
- Pagination
- ISR for product pages (60s revalidation)
- JSON-LD schema markup for SEO

#### Database Schema
- Categories with unique slugs
- Products with variants, images, and metadata
- Price in paise (cents) for INR precision
- Cascade deletes for data integrity

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner
- **File Uploads**: UploadThing

### Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### SEO & Security

#### SEO Features

- **Sitemap**: Automatically generated at `/sitemap.xml` with all ACTIVE products
- **Robots.txt**: Available at `/robots.txt` with sitemap reference
- **Canonical URLs**: All pages include canonical links to prevent duplicate content
- **Meta Tags**: Open Graph and Twitter Card meta tags for social sharing
- **JSON-LD Schema**: 
  - Organization schema on homepage
  - Product schema on product pages (with lowest variant price in offers)

##### Adding New Domains to CSP

If you need to add external services (analytics, email providers, etc.) to the Content Security Policy, edit `next.config.ts`:

```typescript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://your-analytics.com",
    // ... add your domains here
  ].join('; '),
}
```

##### Canonical Base URL

Set the canonical base URL via environment variable:

```env
NEXT_PUBLIC_SITE_URL=https://pebblyplay.com
```

If not set, it falls back to `NEXTAUTH_URL` or defaults to `https://pebblyplay.com`. Update `lib/site.ts` to change the default.

##### Sitemap Filtering

The sitemap (`app/sitemap.ts`) automatically filters products by `status: 'ACTIVE'`. Only active products are included in the sitemap.

#### Security Headers

The following security headers are configured in `next.config.ts`:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Disables camera, microphone, geolocation
- `Content-Security-Policy` - Restricts resource loading (allows Razorpay for checkout)

The CSP is configured to work with:
- Next.js scripts and styles
- UploadThing image uploads
- Razorpay checkout (scripts and forms)

### License

Private - All rights reserved