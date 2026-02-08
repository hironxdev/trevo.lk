# Trevo.lk - QA Testing Guide

Comprehensive testing checklist for verifying all features work correctly on localhost.

## Environment Setup

### 1. Install & Run

```bash
# Install dependencies
npm install

# Setup database (create .env.local first with DATABASE_URL)
npx prisma generate
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed

# Start development server
npm run dev
```

### 2. Environment Variables (.env.local)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-32-char-string
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/trevo
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

### 3. Demo Accounts (After Seeding)

- **Admin**: admin@trevo.lk / Admin@123
- **Regular User**: user@trevo.lk / User@123
- **Partner (Verified)**: partner@trevo.lk / Partner@123
- **Partner (Pending)**: pending@trevo.lk / Pending@123

---

## PUBLIC PAGES (No Auth Required)

### Home Page
- [ ] Load `/` → Hero search displays
- [ ] Vehicle carousel loads
- [ ] Stays carousel loads
- [ ] Features section visible
- [ ] Testimonials visible
- [ ] Footer with links

### Navigation Bar
- [ ] Logo links to home
- [ ] "Browse Vehicles" → `/vehicles`
- [ ] "Browse Stays" → `/stays`
- [ ] "Browse Events" → `/events`
- [ ] "How It Works" → `/how-it-works`
- [ ] "Become Partner" → `/partner/register`
- [ ] "Contact" → `/contact`
- [ ] Sign In button → `/auth/sign-in`
- [ ] Get Started button → `/auth/sign-up`
- [ ] Mobile hamburger menu works

### Browse Vehicles (`/vehicles`)
- [ ] Page loads with list/grid of vehicles
- [ ] Filters sidebar visible on desktop
- [ ] Mobile filter button shows sheet
- [ ] Apply location filter
- [ ] Apply price range filter
- [ ] Apply vehicle type filter
- [ ] Apply date range filter
- [ ] Grid/List view toggle works
- [ ] Click vehicle card → detail page
- [ ] Pagination works
- [ ] Empty state shows when no results

### Browse Stays (`/stays`)
- [ ] Page loads with stays listings
- [ ] Filters work (location, price, type, dates)
- [ ] Mobile filters work
- [ ] Click stay card → detail page
- [ ] Empty state when no results

### Browse Events (`/events`)
- [ ] Page loads if events exist
- [ ] Event cards display
- [ ] Click event → detail page
- [ ] Empty state if no events

### Other Pages
- [ ] `/how-it-works` → Info page loads
- [ ] `/contact` → Contact form visible
- [ ] `/about` → About page loads
- [ ] `/privacy` → Privacy policy visible
- [ ] `/terms` → Terms of service visible

---

## AUTHENTICATION

### Sign Up (`/auth/sign-up`)
- [ ] Email input validates
- [ ] Password requires 8+ chars, uppercase, lowercase, number
- [ ] Password confirmation must match
- [ ] Form validation shows error messages
- [ ] Submit creates user account
- [ ] Redirects to login or dashboard
- [ ] Google OAuth button present

### Sign In (`/auth/sign-in`)
- [ ] Email input accepts email format
- [ ] Password input accepts any length (only checked server-side)
- [ ] Valid credentials login successfully
- [ ] Invalid credentials show error
- [ ] Session creates (check cookies)
- [ ] Redirects to dashboard after login
- [ ] Google OAuth works
- [ ] "Forgot Password" link visible

### Session Persistence
- [ ] Login → refresh page → still logged in
- [ ] Logout → session cleared
- [ ] Protected pages redirect to sign-in if not authenticated

---

## USER DASHBOARD (`/dashboard`)

### Access Control
- [ ] Unauthenticated users redirected to `/auth/sign-in`
- [ ] Authenticated non-partner users can access
- [ ] Partners redirected to `/partner/dashboard`
- [ ] Admins redirected to `/admin`

### Dashboard Content
- [ ] Welcome message shows user's first name
- [ ] Dashboard stats card visible
- [ ] Quick actions section (Browse Vehicles, Browse Stays, etc.)
- [ ] Recent bookings section loads
- [ ] Favorite vehicles section loads
- [ ] Popular vehicles carousel visible

### Sidebar Navigation (Desktop)
- [ ] Overview → `/dashboard`
- [ ] Vehicle Bookings → `/bookings`
- [ ] Stays Bookings → `/stays-bookings`
- [ ] Browse Vehicles → `/vehicles`
- [ ] Browse Stays → `/stays`
- [ ] Browse Events → `/events`
- [ ] Favorites → `/dashboard/favorites`
- [ ] Profile → `/profile`
- [ ] Settings → `/settings`
- [ ] Help & Support → `/contact`
- [ ] Sign Out button works

### Mobile Navigation (Bottom Nav)
- [ ] Home icon → `/`
- [ ] Search icon → `/vehicles`
- [ ] Stays icon → `/stays`
- [ ] Bookings icon → `/bookings`
- [ ] Account icon → `/dashboard`
- [ ] Active tab highlights

### Profile Page (`/profile`)
- [ ] Accessible from sidebar
- [ ] Profile tab shows placeholder (coming soon)
- [ ] Password tab shows placeholder (coming soon)

### Settings Page (`/settings`)
- [ ] Accessible from sidebar
- [ ] Shows placeholder (coming soon)

---

## VEHICLE BOOKINGS

### Browse Vehicles (`/vehicles`)
- [ ] Load page → vehicles list displays
- [ ] Filters work (location, price, type, date range)
- [ ] Search by make/model/location works
- [ ] Click vehicle → detail page

### Vehicle Detail Page (`/vehicles/[id]`)
- [ ] Vehicle info displays (make, model, price, images)
- [ ] Image gallery works
- [ ] Features list visible
- [ ] Partner info visible
- [ ] Reviews section visible
- [ ] Ratings display
- [ ] "Book Now" button present
- [ ] Date picker works

### Booking Flow
- [ ] Select pickup/dropoff dates
- [ ] Select pickup/dropoff location
- [ ] "Continue" → checkout page
- [ ] Pricing calculation shows
- [ ] Deposit amount visible
- [ ] Submit → booking created

### My Bookings (`/bookings`)
- [ ] Accessible from dashboard/sidebar
- [ ] Active bookings tab shows pending/confirmed/active
- [ ] Completed bookings tab shows finished bookings
- [ ] Cancelled bookings tab shows cancelled ones
- [ ] Click booking → detail page
- [ ] Cancel booking button works (if PENDING)
- [ ] Empty state when no bookings

### Booking Detail (`/bookings/[id]`)
- [ ] Booking info displays correctly
- [ ] Vehicle details visible
- [ ] Pricing breakdown shows
- [ ] Status badge visible
- [ ] Cancel button (if applicable)
- [ ] Back button works

---

## STAYS BOOKINGS

### Browse Stays (`/stays`)
- [ ] Load page → stays list displays
- [ ] Filters work (location, price, type, dates)
- [ ] Click stay → detail page

### Stays Detail Page (`/stays/[id]`)
- [ ] Stays info displays
- [ ] Image gallery works
- [ ] Amenities list visible
- [ ] Pricing visible
- [ ] Reviews section visible
- [ ] "Book Now" button present

### Booking Flow
- [ ] Select check-in/check-out dates
- [ ] "Continue" → checkout page
- [ ] Pricing calculation shows
- [ ] Submit → booking created

### My Stays Bookings (`/stays-bookings`)
- [ ] Lists user's stays bookings
- [ ] Filter by status (Active, Completed, Cancelled)
- [ ] Click booking → detail page
- [ ] Cancel booking works (if PENDING)
- [ ] Empty state when no bookings

---

## EVENTS (If Data Exists)

### Browse Events (`/events`)
- [ ] Events list displays
- [ ] Filter by category/location/date
- [ ] Click event → detail page

### Event Detail (`/events/[slug]`)
- [ ] Event info displays (title, description, date, venue)
- [ ] Ticket types list visible
- [ ] "Get Tickets" button present
- [ ] Checkout page shows (currently placeholder)

---

## PARTNER PANEL (`/partner/dashboard`)

### Access Control
- [ ] Only partners (BUSINESS_PARTNER, INDIVIDUAL_PARTNER) can access
- [ ] Non-partners redirected to `/dashboard`

### Partner Status: PENDING
- [ ] Shows "Application Under Review" message
- [ ] Displays expected timeline
- [ ] Cannot access features yet
- [ ] Support contact button visible

### Partner Status: REJECTED
- [ ] Shows rejection message
- [ ] Shows rejection reason
- [ ] "Reapply" button visible
- [ ] Support contact button visible

### Partner Status: VERIFIED
- [ ] Dashboard loads successfully
- [ ] Welcome message shows partner name
- [ ] Dashboard stats visible (earnings, bookings, etc.)

### Sidebar Navigation
- [ ] Dashboard → `/partner/dashboard`
- [ ] Vehicle Bookings → `/partner/bookings`
- [ ] Stays Bookings → `/partner/stays-bookings`
- [ ] My Vehicles → `/partner/vehicles`
- [ ] Add Vehicle → `/partner/vehicles/new`
- [ ] My Properties → `/partner/stays`
- [ ] Add Property → `/partner/stays/new`
- [ ] My Events → `/partner/events`
- [ ] Add Event → `/partner/events/new`
- [ ] Earnings → `/partner/earnings`
- [ ] Analytics → `/partner/analytics`
- [ ] Notifications → `/partner/notifications`
- [ ] Settings → `/partner/settings`

### My Vehicles (`/partner/vehicles`)
- [ ] Lists partner's vehicles
- [ ] Empty state when no vehicles
- [ ] "Add Vehicle" button works

### Add Vehicle (`/partner/vehicles/new`)
- [ ] Form displays with fields:
  - Make, Model, Year, Color
  - Vehicle Type, Category
  - License Plate, Features
  - Pricing (per day, per km, monthly)
  - Images upload
  - Availability dates
- [ ] Form validation works
- [ ] Submit creates vehicle
- [ ] Redirects to vehicles list

### My Properties (`/partner/stays`)
- [ ] Lists partner's stays
- [ ] Empty state when no properties
- [ ] "Add Property" button works

### Add Property (`/partner/stays/new`)
- [ ] Form displays with fields:
  - Name, Description
  - Type, Location, Address
  - Bedrooms, Bathrooms, Max Guests
  - Amenities, Rules
  - Pricing (per night, week, month)
  - Images upload
- [ ] Form validation works
- [ ] Submit creates stay
- [ ] Redirects to properties list

### My Events (`/partner/events`)
- [ ] Lists partner's events
- [ ] Status badges show (Draft, Pending, Approved, etc.)
- [ ] Empty state when no events
- [ ] "Create Event" button works

### Create Event (`/partner/events/new`)
- [ ] Form displays with fields:
  - Event title, description
  - Date/time, location, venue
  - Category, poster image
  - Ticket types, pricing
- [ ] Form validation works
- [ ] Submit creates event
- [ ] Redirects to events list

### Vehicle Bookings (`/partner/bookings`)
- [ ] Lists bookings for partner's vehicles
- [ ] Filter by status
- [ ] Approve/reject buttons (if PENDING)
- [ ] Booking details accessible
- [ ] Empty state when no bookings

### Stays Bookings (`/partner/stays-bookings`)
- [ ] Lists bookings for partner's stays
- [ ] Filter by status
- [ ] Approve/reject buttons
- [ ] Empty state when no bookings

### Earnings (`/partner/earnings`)
- [ ] Earnings dashboard loads
- [ ] Shows total earnings, pending payouts
- [ ] Earnings breakdown visible
- [ ] Transaction history (if implemented)

### Analytics (`/partner/analytics`)
- [ ] Analytics page loads
- [ ] Shows metrics (views, bookings, revenue, etc.)
- [ ] Charts display (if implemented)

---

## ADMIN PANEL (`/admin`)

### Access Control
- [ ] Only ADMIN role can access
- [ ] Non-admins redirected to `/dashboard`

### Dashboard (`/admin`)
- [ ] Admin stats visible (users, vehicles, bookings, etc.)
- [ ] Quick action buttons present
- [ ] Recent activity section (if implemented)

### Sidebar Navigation
- [ ] Dashboard → `/admin`
- [ ] Vehicles → `/admin/vehicles`
- [ ] Stays → `/admin/stays`
- [ ] Events → `/admin/events`
- [ ] Partners → `/admin/partners`
- [ ] Users → `/admin/users`
- [ ] Vehicle Bookings → `/admin/bookings`
- [ ] Stays Bookings → `/admin/stays-bookings`
- [ ] Stays Categories → `/admin/stays-categories`
- [ ] Vehicle Categories → `/admin/categories`
- [ ] Analytics → `/admin/analytics`
- [ ] Settings → `/admin/settings`

### Vehicle Management (`/admin/vehicles`)
- [ ] Lists all vehicles (approved and pending)
- [ ] Filter by status, category, partner
- [ ] Create new vehicle button
- [ ] Click vehicle → detail page
- [ ] Approve/reject pending vehicles
- [ ] Edit vehicle details
- [ ] Delete vehicle (soft delete)

### Stays Management (`/admin/stays`)
- [ ] Lists all stays
- [ ] Filter by status, category, partner
- [ ] Click stay → detail page
- [ ] Approve/reject pending stays

### Events Management (`/admin/events`)
- [ ] Lists all events
- [ ] Filter by status
- [ ] Click event → detail page
- [ ] Approve/reject pending events

### Pending Events (`/admin/events/pending`)
- [ ] Shows only pending approval events
- [ ] Approve/reject with note
- [ ] Redirects to approved list after action

### Partner Management (`/admin/partners`)
- [ ] Lists all partners
- [ ] Filter by KYC status (Pending, Verified, Rejected)
- [ ] Click partner → detail view
- [ ] View partner info (name, business, documents)
- [ ] Approve/reject KYC

### Partner Detail (`/admin/partners/[id]`)
- [ ] Partner personal/business info displays
- [ ] Document uploads visible
- [ ] Approve/reject KYC buttons
- [ ] Partner's vehicles/stays listed
- [ ] Earnings overview (if applicable)

### User Management (`/admin/users`)
- [ ] Lists all users
- [ ] Filter by role
- [ ] Click user → detail page
- [ ] View user bookings, reviews, etc.
- [ ] Deactivate user (if applicable)

### Vehicle Bookings (`/admin/bookings`)
- [ ] Lists all vehicle bookings
- [ ] Filter by status, user, partner
- [ ] Click booking → detail page
- [ ] View booking details, pricing, payment status

### Stays Bookings (`/admin/stays-bookings`)
- [ ] Lists all stays bookings
- [ ] Filter by status, user, partner
- [ ] Click booking → detail page

### Categories (`/admin/categories`)
- [ ] Shows "Coming Soon" placeholder
- [ ] Link functional

### Stays Categories (`/admin/stays-categories`)
- [ ] List/manage stays categories (if implemented)
- [ ] Add/edit/delete categories

### Analytics (`/admin/analytics`)
- [ ] Shows "Coming Soon" placeholder
- [ ] Link functional

---

## RESPONSIVE DESIGN

### Mobile Testing (< 640px)

**General Layout:**
- [ ] No horizontal scroll on any page
- [ ] Content readable without zoom
- [ ] Buttons 48px minimum height
- [ ] Spacing appropriate

**Hero Search:**
- [ ] Tabs stack vertically
- [ ] Date pickers fit screen
- [ ] Search button full width

**Filters:**
- [ ] Filter sheet slides in from left
- [ ] Close button visible
- [ ] Filter options scrollable if needed

**Forms:**
- [ ] Inputs full width
- [ ] Labels visible
- [ ] Error messages inline
- [ ] Submit button full width

**Tables/Lists:**
- [ ] Horizontal scroll only if necessary
- [ ] Cards used instead of tables
- [ ] Important data prioritized

**Navigation:**
- [ ] Bottom nav always visible
- [ ] Hamburger menu for desktop nav
- [ ] Mobile menu closes on link click

### Tablet Testing (640px - 1024px)

- [ ] Two-column layouts work
- [ ] Sidebar toggleable
- [ ] Forms display properly
- [ ] Images scale appropriately

### Desktop Testing (> 1024px)

- [ ] Three-column layouts (sidebar + content + aside)
- [ ] Sidebars visible by default
- [ ] Maximum width enforced (typically 1400px)
- [ ] Hover states on interactive elements
- [ ] Consistent spacing/typography

---

## ROUTING & REDIRECTS

### Unauthenticated Users
- [ ] `/dashboard` → `/auth/sign-in`
- [ ] `/bookings` → `/auth/sign-in`
- [ ] `/partner/dashboard` → `/auth/sign-in`
- [ ] `/admin` → `/auth/sign-in`

### Role-Based Redirects
- [ ] User accessing `/admin` → `/dashboard`
- [ ] Partner accessing `/admin` → `/partner/dashboard`
- [ ] Admin accessing `/partner` → `/admin`
- [ ] User accessing `/partner/dashboard` → `/dashboard`

### Valid Routes
- [ ] All `/` routes work
- [ ] All `/vehicles/**` routes work
- [ ] All `/stays/**` routes work
- [ ] All `/events/**` routes work
- [ ] All `/dashboard/**` routes work
- [ ] All `/bookings/**` routes work
- [ ] All `/partner/**` routes work (if partner)
- [ ] All `/admin/**` routes work (if admin)

### 404 Handling
- [ ] `/nonexistent` → `/not-found` page

---

## ERROR HANDLING & EMPTY STATES

### Empty States
- [ ] No vehicles → "No vehicles found" with clear filters button
- [ ] No bookings → "No bookings yet" with browse button
- [ ] No stays → "No properties yet" with create button
- [ ] No events → "No events found" or empty calendar
- [ ] No reviews → "No reviews yet"

### Error Handling
- [ ] Network errors show toast notification
- [ ] Form errors show inline validation
- [ ] Database errors show user-friendly messages
- [ ] Missing required data doesn't crash page
- [ ] API failures handled gracefully

### Notifications
- [ ] Success actions show toast
- [ ] Error actions show toast
- [ ] Warnings display appropriately
- [ ] Toasts auto-dismiss after 3-5 seconds

---

## PERFORMANCE

### General
- [ ] No console JavaScript errors
- [ ] No TypeScript type errors during build
- [ ] Page loads within 3 seconds
- [ ] Smooth scrolling without jank

### Images
- [ ] Images use `next/image` (optimized)
- [ ] Lazy loading for off-screen images
- [ ] Proper aspect ratios maintained
- [ ] No cumulative layout shift

### Data Loading
- [ ] Skeleton loaders while fetching
- [ ] Suspense boundaries working
- [ ] No loading state flicker
- [ ] Pagination works for large lists

---

## Database Seeding

After running `npx prisma db seed`, verify:

- [ ] Admin user exists
- [ ] Multiple regular users created
- [ ] Multiple partners created (verified + pending)
- [ ] Sample vehicles exist and are approved
- [ ] Sample stays exist
- [ ] Sample bookings created
- [ ] Sample reviews exist
- [ ] Events created (if seeder includes)

---

## Build & Deployment Checklist

```bash
# Verify production build works
npm run build

# Start production mode
npm start

# Visit http://localhost:3000 and run smoke tests
```

- [ ] Build completes without errors
- [ ] No build warnings
- [ ] Production mode works
- [ ] All pages load
- [ ] Navigation works
- [ ] Functionality unchanged

---

## Known Limitations / Coming Soon

- [ ] Checkout payment processing (placeholder in place)
- [ ] Admin messages system (coming soon)
- [ ] Category management UI (coming soon)
- [ ] Advanced analytics (coming soon)
- [ ] Profile/settings UI (coming soon)
- [ ] Password reset flow (coming soon)
- [ ] Email notifications (backend setup complete)

---

## Reporting Issues

If you find bugs:

1. Describe the issue clearly
2. List steps to reproduce
3. Include expected vs actual behavior
4. Note browser/device used
5. Attach screenshot if applicable
6. Create GitHub issue with label `bug`
