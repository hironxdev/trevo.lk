# Events & Tickets Module - Setup and Testing Guide

## Navigation Implementation Complete ✓

Steps 1-2 have been completed. Events are now visible throughout the Trevo platform:

### Where Users Can See "Events"

1. **Public Navigation Bar** (All users)
   - Path: Main header `/events`
   - Icon: Calendar
   - Also in mobile menu

2. **User Dashboard Sidebar** (Logged-in users)
   - Path: Dashboard sidebar → "Browse Events" → `/events`
   - For browsing and searching events

3. **Partner Panel** (Approved partners)
   - Path: Partner sidebar → "My Events" → `/partner/events`
   - Path: Partner sidebar → "Add Event" → `/partner/events/new`
   - For managing their events

4. **Admin Panel** (Admins only)
   - Path: Admin sidebar → "Events" → `/admin/events`
   - For reviewing and approving events
   - Includes pending events link → `/admin/events/pending`

## Testing Events Features Locally

### 1. Public Events Browsing
```bash
# Go to homepage and click "Browse Events"
# OR navigate directly
http://localhost:3000/events
```
- See all approved events
- Filter by city, category, price range, date
- Click event to view details
- See organizer info and ticket types

### 2. Create Event as Partner
```bash
# 1. Sign in as a partner or create one via /partner/register
# 2. Partner dashboard → "My Events"
# 3. Click "Add Event"
# 4. Fill form:
#    - Title (EN and SI)
#    - Description (EN and SI)  
#    - Category (Music, Sports, Conference, etc.)
#    - City, Venue Name
#    - Map URL (optional)
#    - Poster URL (optional)
#    - Start Date/Time
#    - End Date/Time (optional)
# 5. Save as DRAFT
```

### 3. Manage Tickets
```bash
# From "My Events" → event → click event
# Tab: "Manage Tickets" or action "Ticket Types"
# Add ticket types:
#   - Name (e.g., VIP, Normal, Early Bird)
#   - Price
#   - Total Qty
#   - Sales Start/End dates
```

### 4. Submit Event for Review
```bash
# From "My Events" → event → "Submit for Review"
# Review checklist (all required):
#   - Event details complete
#   - Poster uploaded
#   - At least one ticket type
# Submit
# Status changes to PENDING_REVIEW
```

### 5. Admin Review Events
```bash
# Sign in as admin (must have role ADMIN)
# Admin panel → "Events"
# See stats: Total, Pending, Approved, Rejected
# Click "Review Now" or go to /admin/events/pending

# Review queue shows all PENDING_REVIEW events
# Click event → Full details view
# Actions:
#   - APPROVE: Event goes live to public
#   - REJECT: Include admin note why
#   
# Can also:
#   - Cancel approved events (if needed)
#   - Confirm payments for bank/cash transfers
```

### 6. User Books Tickets (Stub)
```bash
# Go to event details → "Book Now"
# Redirects to /checkout/[eventId]
# Currently shows "Coming Soon" (will implement in Steps 5-6)
```

### 7. View Ticket (Stub)
```bash
# After checkout (future): /ticket/[bookingId]
# Shows QR code, ticket details, attendance confirmation
# Currently shows "Coming Soon"
```

## Database Schema

Events module uses these Prisma models:

### Core Models
- **Event** - Event details, status, organizer
- **TicketType** - Ticket categories (VIP, Normal, etc.)
- **Booking_Event** - Attendee bookings and payments
- **Ticket** - Individual ticket with QR code

### Support Models
- **PromoCode** - Discount codes (percent or fixed)
- **GroupDiscountRule** - Bulk discounts by quantity
- **NotificationLog** - Email/WhatsApp notifications
- **AdminEventReview** - Approval/rejection audit trail

## Access Control Rules (Enforced)

| Route | Access | Notes |
|-------|--------|-------|
| `/events` | Public | No auth required |
| `/events/[slug]` | Public | Only approved events |
| `/checkout/*` | Logged-in | Requires user session |
| `/partner/events/*` | Partner (VERIFIED) | KYC status = VERIFIED |
| `/admin/events/*` | Admin | role = ADMIN only |

## Important Implementation Notes

### Bilingual Support
- Event titles and descriptions have `En` and `Si` fields
- Forms show fields for both languages
- Public page will have language toggle (Step 8)

### SriLanka-First Features (To implement Steps 3-8)

1. **Payment Methods**
   - CARD: Simulated success
   - BANK_TRANSFER: Slip upload required, admin verifies
   - CASH_DEPOSIT: Slip upload required, admin verifies

2. **WhatsApp Notifications**
   - NotificationLog stores message payload
   - UI shows "Copy WhatsApp Message" button
   - Users can copy and send manually

3. **Promo Codes & Group Discounts**
   - Admin can set up promo codes per event
   - Group discounts auto-apply if qty meets minQty rule
   - UI shows savings

4. **Venue & Map**
   - venueName, city, mapUrl fields
   - Event details show map button
   - Cross-sell: "Book vehicle to venue" links

## Remaining Implementation Tasks (Steps 3-10)

### Step 3: Complete Partner Event Pages
- [ ] Improve event list with more details
- [ ] Add event bookings/attendees list view
- [ ] Add event check-in page with QR verification
- [ ] Mobile-friendly event creation form

### Step 4: Admin Payment Confirmation
- [ ] Admin payment review page (/admin/bookings/events)
- [ ] Slip image viewer
- [ ] Confirm payment → mark PAID → generate tickets
- [ ] Reject payment → revert sold qty atomically

### Step 5: Checkout Implementation
- [ ] Ticket type selection + quantity
- [ ] Promo code input with validation
- [ ] Group discount calculation
- [ ] Payment method choice (CARD/BANK_TRANSFER/CASH_DEPOSIT)
- [ ] Slip upload for bank/cash methods
- [ ] Order summary
- [ ] Payment processing (simulate CARD)
- [ ] Ticket generation for PAID bookings

### Step 6: Ticket Generation & Display
- [ ] Generate Ticket rows with unique codes
- [ ] QR code generation (based on ticketCode)
- [ ] Ticket view page with QR codes
- [ ] Download/print ticket option

### Step 7: WhatsApp & Email Notifications
- [ ] Create NotificationLog on booking creation
- [ ] Show "Copy WhatsApp Message" button
- [ ] Send email notifications if email service enabled
- [ ] Notification history in user dashboard

### Step 8: Language Toggle & SEO
- [ ] Add language toggle (EN/සිං) to event pages
- [ ] Update displayed content based on selection
- [ ] Add OG metadata for social sharing
- [ ] Update layout metadata dynamically

### Step 9: Access Control Audit
- [ ] Verify all routes have correct auth checks
- [ ] Test no redirect loops
- [ ] Test permission edge cases
- [ ] Test mobile access

### Step 10: Documentation
- [ ] End-to-end testing checklist
- [ ] API documentation
- [ ] Partner onboarding guide
- [ ] Admin moderation guide

## Quick Start Command

```bash
# 1. Ensure database is synced
npm run prisma:push
# or
npx prisma db push

# 2. Run dev server
npm run dev

# 3. Navigate to localhost:3000
# 4. Test navigation following sections above

# 5. Create test data
# Go to /partner/events/new as a verified partner
# Create a test event
# Go to /admin/events and approve it
# Go to /events to see it live
```

## File Structure

```
app/(client)/
  ├── events/                          # Public event browsing
  │   ├── page.tsx                    # Event list with filters
  │   └── [slug]/page.tsx             # Event details
  │
  ├── partner/(partner)/
  │   └── events/                     # Partner event management
  │       ├── page.tsx                # List partner events
  │       ├── new/page.tsx            # Create event form
  │       ├── [id]/
  │       │   ├── edit/page.tsx       # Edit event
  │       │   ├── tickets/page.tsx    # Manage ticket types
  │       │   └── submit/page.tsx     # Submit for review
  │       └── _components/
  │           ├── event-form.tsx      # Event creation/edit form
  │           └── ticket-type-form.tsx # Ticket type management
  │
  ├── admin/events/                    # Admin event management
  │   ├── page.tsx                    # Event overview
  │   ├── pending/page.tsx            # Pending approval queue
  │   ├── [id]/page.tsx               # Event review & approval
  │   └── _components/
  │       └── event-approval-form.tsx # Approval decision form
  │
  ├── checkout/
  │   └── [eventId]/page.tsx          # Ticket booking (STUB)
  │
  └── ticket/
      └── [bookingId]/page.tsx        # Ticket view (STUB)

actions/events/
  ├── list.ts                         # Event queries (public, partner, admin)
  ├── create.ts                       # Create, update, delete events
  └── admin.ts                        # Admin approval actions
```

## Next Steps

Once navigation is confirmed working:

1. **Test partner event creation** - Create a test event
2. **Test admin approval** - Approve the test event
3. **Implement checkout** - Step 5 in specification
4. **Add payment flows** - Step 6
5. **Implement notifications** - Step 7
6. **Add language support** - Step 8

See `EVENTS_IMPLEMENTATION_STATUS.md` for detailed progress tracking.
