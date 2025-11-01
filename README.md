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

### License

Private - All rights reserved