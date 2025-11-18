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

# Resend (for order confirmation emails)
# Get API key from https://resend.com
RESEND_API_KEY="re_xxxxx"
RESEND_FROM="PebblyPlay <orders@pebblyplay.com>"
```

### Routes

#### Public Routes
- `/` - Homepage with hero section and category cards
- `/catalog` - Product catalog with filters, pagination, and sorting
- `/product/[slug]` - Product detail page with ISR (60s revalidation)
- `/sign-up` - User registration
- `/sign-in` - User login
- `/cart` - Shopping cart
- `/policies/privacy` - Privacy Policy
- `/policies/terms` - Terms of Service
- `/policies/shipping-and-returns` - Shipping and Returns Policy

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

### Email (Resend)

Order confirmation emails are sent automatically when an order status becomes `PAID`.

#### Setup

1. **Get Resend API Key**: Sign up at [resend.com](https://resend.com) and create an API key
2. **Verify Sending Domain**: Add and verify your domain in Resend dashboard
3. **Configure Environment Variables**:
   ```env
   RESEND_API_KEY="re_xxxxx"
   RESEND_FROM="PebblyPlay <orders@pebblyplay.com>"
   ```
   The `RESEND_FROM` email must match a verified domain in your Resend account.

#### How It Works

- Emails are triggered automatically when:
  - Payment is verified via `/api/payments/verify` (frontend checkout flow)
  - Payment is captured via Razorpay webhook (`/api/webhooks/razorpay`)
- **Idempotency**: Emails are never sent twice. The system checks `emailSentAt` before sending.
- If one path runs first and sends the email, the other path becomes a no-op.

#### Email Content

The order confirmation email includes:
- Order number and date
- Customer email
- Table of items with variant options, quantities, and prices
- Subtotal and total (formatted in INR)

#### Preview Template

Admins can preview email templates at `/admin/dev/email-preview?id=ORDER_ID` (OWNER/STAFF only).

### Policies

The site includes three policy pages accessible from the footer:

- **Privacy Policy** (`/policies/privacy`) - Information about data collection, usage, and user rights
- **Terms of Service** (`/policies/terms`) - Terms and conditions for using the website and services
- **Shipping and Returns** (`/policies/shipping-and-returns`) - Shipping information and return policy for India

All policy pages include:
- Accessible headings with anchorable subheadings
- SEO meta tags (Open Graph and Twitter Cards)
- Canonical URLs
- Contact information (support@pebblyplay.com)

The policies use boilerplate text with placeholders for:
- Company: "PebblyPlay"
- Email: "support@pebblyplay.com"
- Country: India
- Currency: INR
- Shipping: Domestic India baseline; refunds within 7 days for unopened toys

**Note:** Policy content is editable and should be reviewed by legal counsel before production use.

### Design System

PebblyPlay uses a cohesive design system built on Tailwind CSS and shadcn/ui with custom tokens and theming.

#### Color Tokens

**Brand Colors:**
- `--brand-primary`: #FF7A59 (Primary brand color)
- `--brand-primary-600`: #FF6A43 (Darker variant)
- `--brand-accent`: #4F46E5 (Accent color)
- `--brand-accent-600`: #4338CA (Darker variant)

**Semantic Colors:**
- `success`: Green for success states
- `warn`: Orange/yellow for warnings
- `danger`: Red for errors/destructive actions

**Neutral Palette:**
- Full neutral scale from 50-950 for grays and backgrounds

**Usage in Tailwind:**
```tsx
// Brand colors
<div className="bg-brand-primary text-white">...</div>
<div className="bg-brand-accent-600">...</div>

// Semantic colors
<div className="bg-success text-success-foreground">...</div>
<div className="bg-warn text-warn-foreground">...</div>
<div className="bg-danger text-danger-foreground">...</div>

// Primary/Accent (mapped to brand)
<Button variant="primary">Primary Button</Button>
<Button variant="link">Link Button</Button>
```

#### Typography

**Font Families:**
- **Display**: Fredoka (for headings, hero text)
- **Body**: Inter (for body text, UI)

**Usage:**
```tsx
<h1 className="font-display">Display Heading</h1>
<p className="font-sans">Body text</p>
```

#### Border Radius

- `--radius`: 20px (default, used for buttons, cards)
- `--radius-lg`: 30px (for larger elements)

**Tailwind Classes:**
- `rounded` or `rounded-2xl`: 20px
- `rounded-lg`: 30px
- `rounded-xl`: 18px (calculated)
- `rounded-md`: 18px (calculated)
- `rounded-sm`: 16px (calculated)

#### Shadows

**Custom Shadows:**
- `--shadow-md`: Medium elevation shadow
- `--shadow-lg`: Large elevation shadow

**Utility Classes:**
- `shadow-elevate`: Applies medium shadow
- `hover:shadow-float`: Applies large shadow on hover with slight lift

**Usage:**
```tsx
<div className="shadow-elevate">Card with elevation</div>
<div className="hover:shadow-float">Hover to float</div>
```

#### Button Variants

**Available Variants:**
- `default` / `primary`: Brand primary color (orange)
- `secondary`: Muted background
- `outline`: Outlined style
- `ghost`: Transparent with hover state
- `link`: Accent color text with underline
- `destructive`: Red for destructive actions

**Sizes:**
- `sm`: Small (h-9)
- `default`: Default (h-11) - larger for better touch targets
- `lg`: Large (h-14) - for hero CTAs
- `icon`: Square icon button (h-11)

**Usage:**
```tsx
<Button variant="primary" size="lg">Hero CTA</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="link">Text Link</Button>
```

#### Animations

**Available Animations:**
- `animate-float`: Gentle floating animation (3s infinite)
- `animate-fade-in`: Fade in with slide up (0.5s)

**Usage:**
```tsx
<div className="animate-float">Floating element</div>
<div className="animate-fade-in">Fade in on mount</div>
```

#### Theme Provider

The app includes a `ThemeProvider` component for theme management. Currently set to light mode by default, but can be extended for dark mode support.

**Location:** `components/ui/theme-provider.tsx`

#### CSS Variables

All design tokens are defined as CSS variables in `styles/globals.css`:
- Colors (brand, semantic, neutrals)
- Border radius
- Shadows
- Typography (via font variables)

This allows for easy theming and customization without modifying component code.

### Hero Images

The Hero component supports optional image collages for visual appeal. Placeholder images are located in `/public/brand/`:

- `hero-1.svg`, `hero-2.svg`, `hero-3.svg` - Placeholder SVGs with "Replace me" text

**To replace with UploadThing URLs:**

1. Upload your hero images via the admin panel or UploadThing dashboard
2. Copy the image URLs from UploadThing
3. Update the Hero component usage in `app/(site)/page.tsx`:

```tsx
<Hero 
  images={[
    { 
      src: 'https://utfs.io/f/your-uploadthing-url-1', 
      alt: 'Meaningful description of image 1' 
    },
    { 
      src: 'https://utfs.io/f/your-uploadthing-url-2', 
      alt: 'Meaningful description of image 2' 
    },
    { 
      src: 'https://utfs.io/f/your-uploadthing-url-3', 
      alt: 'Meaningful description of image 3' 
    },
  ]}
/>
```

**Image Guidelines:**
- Recommended aspect ratio: 4:5 (portrait)
- Maximum 3 images displayed (staggered collage on md+ screens)
- Images are hidden on mobile for performance
- First image uses `priority` loading, others use `lazy` loading
- All images require meaningful `alt` text for accessibility
- Images have rounded-2xl frames and subtle hover rotation (respects prefers-reduced-motion)

### License

Private - All rights reserved