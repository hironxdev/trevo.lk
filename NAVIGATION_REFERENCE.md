# Navigation Reference Guide

Quick reference for all valid routes, navigation structure, and access requirements.

## Route Structure Overview

```
/ (Public)
├── /vehicles          (Browse vehicles)
├── /stays             (Browse stays)
├── /events            (Browse events)
├── /how-it-works      (Info page)
├── /contact           (Contact form)
├── /about             (About page)
├── /privacy           (Privacy policy)
├── /terms             (Terms of service)
├── /auth
│   ├── /sign-in       (Email/password or Google OAuth)
│   ├── /sign-up       (Create account)
│   └── /forgot-password (Password reset)
│
├── /dashboard         (USER only - redirect PARTNER → /partner/dashboard, ADMIN → /admin)
│   ├── /dashboard (overview)
│   ├── /bookings (vehicle bookings)
│   ├── /stays-bookings (stays bookings)
│   ├── /dashboard/favorites (favorite vehicles)
│   ├── /profile (profile settings)
│   └── /settings (account settings)
│
├── /bookings          (USER - vehicle bookings list)
│   └── /bookings/[id] (booking details)
│
├── /stays-bookings    (USER - stays bookings list)
│   └── /stays-bookings/[id] (booking details)
│
├── /partner           (PARTNER only - PENDING/REJECTED shows "Under Review" message)
│   ├── /partner/register (Register as partner)
│   ├── /partner/dashboard (Dashboard)
│   ├── /partner/bookings (Vehicle bookings)
│   │   └── /partner/bookings/[id] (Booking detail)
│   ├── /partner/stays-bookings (Stays bookings)
│   ├── /partner/vehicles (My vehicles list)
│   │   ├── /partner/vehicles/new (Create vehicle)
│   │   ├── /partner/vehicles/[id]/edit (Edit vehicle)
│   │   └── /partner/vehicles/[id] (View vehicle)
│   ├── /partner/stays (My properties)
│   │   ├── /partner/stays/new (Create property)
│   │   ├── /partner/stays/[id]/edit (Edit property)
│   │   └── /partner/stays/[id] (View property)
│   ├── /partner/events (My events)
│   │   ├── /partner/events/new (Create event)
│   │   ├── /partner/events/[id] (View event)
│   │   ├── /partner/events/[id]/edit (Edit event)
│   │   ├── /partner/events/[id]/tickets (Manage tickets)
│   │   └── /partner/events/[id]/submit (Submit for approval)
│   ├── /partner/earnings (Earnings dashboard)
│   ├── /partner/analytics (Analytics dashboard)
│   ├── /partner/notifications (Notifications)
│   └── /partner/settings (Settings)
│
└── /admin             (ADMIN only)
    ├── /admin (dashboard)
    ├── /admin/vehicles (vehicle management)
    │   ├── /admin/vehicles/[id] (view/edit vehicle)
    │   ├── /admin/vehicles/[id]/edit (edit vehicle)
    │   └── /admin/vehicles/new (create vehicle)
    ├── /admin/stays (stays management)
    ├── /admin/events (events management)
    │   ├── /admin/events/[id] (view/approve event)
    │   └── /admin/events/pending (pending approvals)
    ├── /admin/partners (partner management)
    │   └── /admin/partners/[id] (partner details)
    ├── /admin/users (user management)
    ├── /admin/bookings (vehicle bookings)
    ├── /admin/stays-bookings (stays bookings)
    ├── /admin/categories (vehicle categories - Coming Soon)
    ├── /admin/stays-categories (stays categories)
    ├── /admin/analytics (analytics - Coming Soon)
    └── /admin/settings (settings)
```

## Access Control Matrix

| Route | Public | USER | PARTNER | ADMIN | Notes |
|-------|--------|------|---------|-------|-------|
| / | ✓ | ✓ | ✓ | ✓ | Home page |
| /vehicles | ✓ | ✓ | ✓ | ✓ | Browse |
| /stays | ✓ | ✓ | ✓ | ✓ | Browse |
| /events | ✓ | ✓ | ✓ | ✓ | Browse |
| /dashboard | ✗ | ✓ | ✗ | ✗ | Redirects PARTNER→/partner, ADMIN→/admin |
| /bookings | ✗ | ✓ | ✗ | ✗ | User's own bookings |
| /stays-bookings | ✗ | ✓ | ✗ | ✗ | User's own stays |
| /profile | ✗ | ✓ | ✓ | ✓ | User's profile |
| /settings | ✗ | ✓ | ✓ | ✓ | User's settings |
| /partner/** | ✗ | ✗ | ✓ | ✗ | Partner only (KYC required for features) |
| /admin/** | ✗ | ✗ | ✗ | ✓ | Admin only |

## Sidebar Navigation by Role

### Public (No Login)
- Browse Vehicles
- Browse Stays
- Browse Events
- How It Works
- Become Partner
- Contact
- Sign In / Get Started

### USER (Regular User)
**Menu:**
- Overview (Dashboard)
- Vehicle Bookings
- Stays Bookings
- Browse Vehicles
- Browse Stays
- Browse Events
- Favorites
- Profile
- Settings

**Support:**
- Help & Support

**Special Actions:**
- View Partner Panel (only if has PARTNER role)
- Sign Out

### PARTNER (Verified)
**Dashboard:**
- Dashboard

**Vehicles:**
- Vehicle Bookings (with notification badges)
- Stays Bookings
- My Vehicles
- Add Vehicle (disabled until VERIFIED)

**Properties:**
- My Properties
- Add Property (disabled until VERIFIED)

**Events:**
- My Events
- Add Event (disabled until VERIFIED)

**Other:**
- Earnings
- Analytics

**Bottom:**
- Notifications
- Settings
- Help & Support
- Collapse/Expand toggle

### ADMIN
- Dashboard
- Vehicles
- Stays
- Events
- Vehicle Categories
- Stays Categories
- Partners
- Users
- Vehicle Bookings
- Stays Bookings
- Analytics
- Settings

## Page Status Reference

### Fully Implemented
- ✓ Home page
- ✓ Vehicle browsing & filtering
- ✓ Stays browsing & filtering
- ✓ Events browsing (basic)
- ✓ Vehicle bookings (create, list, cancel)
- ✓ Stays bookings (create, list, cancel)
- ✓ User dashboard
- ✓ Partner dashboard & all modules
- ✓ Admin dashboard & management pages
- ✓ Authentication (sign up, sign in, Google OAuth)

### Placeholder/Coming Soon
- 🚧 Payment checkout (shows placeholder)
- 🚧 Admin categories management
- 🚧 Admin analytics dashboard
- 🚧 User profile management (placeholder)
- 🚧 User settings (placeholder)

### Not Implemented
- ✗ Admin messages system (link removed from sidebar)
- ✗ Email notifications UI (backend ready)
- ✗ User password reset flow

## Mobile Navigation

### Mobile Bottom Nav (Fixed)
Shows different items based on role:

**USER:**
- Home (/)
- Vehicles (/vehicles)
- Stays (/stays)
- Bookings (/bookings)
- Account (/dashboard)

**PARTNER:**
- Home (/)
- Search (/vehicles)
- Add (+ button) → /partner/vehicles/new
- Bookings (/partner/bookings)
- Account (/partner/dashboard)

**ADMIN:**
- Home (/)
- Search (/vehicles)
- Vehicles (/admin/vehicles)
- Partners (/admin/partners)

### Mobile Hamburger Menu
Accessible from navigation bar. Contains all main navigation items with categories.

## Redirect Rules

### Unauthenticated
- Any protected route → `/auth/sign-in`
- Successful sign in → `/dashboard` (or previous page)
- Successful sign out → `/`

### Role-Based Redirects
- USER accessing `/admin/**` → `/dashboard`
- USER accessing `/partner/**` → `/dashboard`
- PARTNER accessing `/admin/**` → `/partner/dashboard`
- PARTNER accessing `/dashboard` → `/partner/dashboard`
- ADMIN accessing `/dashboard` → `/admin`
- ADMIN accessing `/partner/**` → `/admin`

### KYC Status Redirects (Partner)
- PENDING accessing feature pages → Shows "Under Review" message
- REJECTED accessing feature pages → Shows rejection reason + reapply option
- VERIFIED → Full access

## Quick Navigation Links

### From Home Page
- Browse Vehicles → /vehicles
- Browse Stays → /stays
- Browse Events → /events
- How It Works → /how-it-works
- Become Partner → /partner/register
- Contact → /contact

### From Vehicle Detail
- Back → /vehicles
- Book Now → Checkout flow
- Partner Info → (inline)
- Reviews → (inline scroll)

### From Dashboard
- Browse Vehicles → /vehicles
- Browse Stays → /stays
- My Bookings → /bookings
- My Stays → /stays-bookings
- Favorites → /dashboard/favorites
- Partner Panel → /partner/dashboard (if partner)

### From Partner Dashboard
- My Vehicles → /partner/vehicles
- Add Vehicle → /partner/vehicles/new
- My Properties → /partner/stays
- Add Property → /partner/stays/new
- My Events → /partner/events
- Create Event → /partner/events/new
- View Bookings → /partner/bookings
- View Analytics → /partner/analytics

### From Admin Dashboard
- Manage Vehicles → /admin/vehicles
- Manage Stays → /admin/stays
- Manage Partners → /admin/partners
- View Users → /admin/users
- Approve Events → /admin/events/pending
- View Bookings → /admin/bookings

## Breadcrumb Navigation

All major pages include breadcrumbs:
- Admin pages: Home > Dashboard > Current Page
- Partner pages: Home > Dashboard > Current Page
- User pages: Home > Dashboard > Current Page

## Error Handling & Edge Cases

### 404 Pages
- Any invalid route → /not-found

### Blank States
- No vehicles → "No vehicles found" message with "Clear Filters" button
- No bookings → "No bookings yet" message with "Browse Vehicles" button
- No stays → "No stays bookings yet" message
- No events → "No events found" message
- No favorites → "No favorites yet" message

### Loading States
- While fetching → Skeleton loader or spinner
- Suspense boundaries → Loading fallback UI

## Testing Navigation

### Route Verification Checklist
- [ ] All sidebar links lead to valid pages
- [ ] No 404 errors on valid routes
- [ ] Redirects work correctly by role
- [ ] Protected routes require authentication
- [ ] Mobile nav matches desktop nav functionality
- [ ] Breadcrumbs show correct hierarchy
- [ ] Back buttons work
- [ ] Modals have close buttons

### Cross-Role Testing
- [ ] Log in as USER → can access /dashboard
- [ ] Log in as PARTNER → redirected to /partner/dashboard
- [ ] Log in as ADMIN → redirected to /admin
- [ ] Try accessing other roles' areas → redirected appropriately

### Mobile Testing
- [ ] Bottom nav visible on all pages
- [ ] Hamburger menu toggles
- [ ] No horizontal scroll
- [ ] Touch targets at least 48px
- [ ] All links functional on mobile
