# Events & Tickets Feature Implementation

This document outlines the complete Events & Tickets module for Trevo.

## Database Schema

### Models Added

1. **Event** - Main event model with bilingual support (English/Sinhala)
   - Status flow: DRAFT → PENDING_REVIEW → APPROVED/REJECTED → (optional) CANCELLED
   - Organized by approved PARTNER users

2. **TicketType** - Ticket categories within an event (VIP, Normal, EarlyBird, etc.)
   - Tracks available and sold quantities
   - Optional sales date windows

3. **PromoCode** - Discount codes scoped to events
   - Type: PERCENT or FIXED amount
   - Usage limits and date ranges

4. **GroupDiscountRule** - Auto-applied discounts for bulk purchases
   - Minimum quantity triggers discount
   - Type: PERCENT or FIXED amount

5. **Booking_Event** - Ticket booking records
   - Status: PENDING_PAYMENT → PENDING_APPROVAL → PAID → CONFIRMED
   - Tracks payment method (CARD, BANK_TRANSFER, CASH_DEPOSIT)
   - Stores slip URLs for manual payment verification

6. **Ticket** - Individual ticket records with QR codes
   - One ticket per purchased quantity
   - Unique ticket code and QR payload
   - Check-in tracking with timestamp and staff

7. **NotificationLog** - Stores email and WhatsApp notifications
   - Status: QUEUED → SENT or FAILED
   - Stores full message payload for replay

8. **AdminEventReview** - Admin approval history
   - Tracks decision and rejection notes

## Enums Added

- `EventStatus` - DRAFT | PENDING_REVIEW | APPROVED | REJECTED | CANCELLED
- `TicketBookingStatus` - PENDING_PAYMENT | PENDING_APPROVAL | PAID | CONFIRMED | CANCELLED | REFUNDED
- `PaymentMethod` - CARD | BANK_TRANSFER | CASH_DEPOSIT
- `PromoCodeType` - PERCENT | FIXED
- `NotificationChannel` - EMAIL | WHATSAPP
- `NotificationStatus` - QUEUED | SENT | FAILED

## User Roles & Permissions

| Role | Can Create Events | Can Approve Events | Can Browse Events | Can Book Tickets |
|------|-------------------|-------------------|-------------------|------------------|
| USER | No | No | Yes (approved only) | Yes (logged in) |
| INDIVIDUAL_PARTNER | Yes (if approved) | No | Yes | Yes |
| BUSINESS_PARTNER | Yes (if approved) | No | Yes | Yes |
| ADMIN | No | Yes | Yes | Yes |

## Workflow

### Event Lifecycle

1. **Partner Creates Event** → DRAFT status
   - Can edit freely while in DRAFT
   - Stored in `/dashboard/events`

2. **Partner Submits** → PENDING_REVIEW
   - Cannot edit while pending
   - Admin notified of pending approval

3. **Admin Reviews** → APPROVED or REJECTED
   - If APPROVED: visible on `/events` (public)
   - If REJECTED: partner notified with reason, can edit and resubmit

4. **Optional** → CANCELLED
   - Partner or admin can cancel approved event
   - Refund logic applies to bookings

### Booking Lifecycle

1. **User Selects Tickets** → PENDING_PAYMENT
   - Reserves ticket slot (prevents oversale)
   - Quantity deducted from `TicketType.soldQty`

2. **Payment Processing**
   - **CARD**: Simulated success → PAID status immediately
   - **BANK_TRANSFER** / **CASH_DEPOSIT**: → PENDING_APPROVAL
     - Admin confirms slip upload → PAID

3. **Confirmation** → CONFIRMED
   - Tickets generated (one per qty)
   - Notification queued/sent

4. **Check-in** → Ticket marked `checkedInAt`
   - QR code scanned or code manually entered

## API Routes & Components (To Be Created)

### Public Routes

- `GET /events` - List approved events with filters (city, date, category, price)
- `GET /events/[slug]` - Event details + ticket types + organizer info
- `GET /checkout/[eventId]` - Checkout with qty, promo, payment method
- `GET /ticket/[bookingId]` - E-ticket with QR code

### Partner Routes

- `GET /dashboard/events` - Partner's events list
- `GET /dashboard/events/new` - Create new event form
- `GET /dashboard/events/[id]` - Edit event
- `GET /dashboard/events/[id]/bookings` - Attendee list + CSV export
- `GET /dashboard/events/[id]/checkin` - Check-in page

### Admin Routes

- `GET /admin/events/pending` - Pending event approvals
- `GET /admin/events/[id]` - Review + approve/reject
- `GET /admin/bookings` - Search all bookings
- `POST /admin/bookings/confirm-payment` - Confirm slip-based payments

### API Routes (Server Actions & Handlers)

- `POST /api/events` - Create event
- `PATCH /api/events/[id]` - Update event
- `POST /api/events/[id]/submit` - Submit for review
- `POST /api/bookings/event` - Create booking + reserve tickets
- `POST /api/bookings/[id]/payment` - Process payment
- `GET /api/bookings/[id]/tickets` - Generate tickets + QR
- `POST /api/tickets/[code]/checkin` - Validate & check-in ticket
- `POST /api/uploads` - File upload (poster, slip)

## Payment Implementation

### Card Payment (Simulated)
```
1. User selects CARD method
2. Show demo payment form
3. On submit: mark booking PAID immediately
4. Generate tickets
5. Send notification
```

### Bank Transfer & Cash Deposit
```
1. User selects BANK_TRANSFER or CASH_DEPOSIT
2. Show deposit instructions + upload slip form
3. Save slip URL → booking status PENDING_APPROVAL
4. Admin reviews slip → confirms PAID or rejects
5. If PAID: generate tickets + notify
```

## Notifications

### WhatsApp (v0 Implementation)
- Store message template in `NotificationLog`
- Show UI: "Copy WhatsApp Message"
- User manually copies & sends via WhatsApp

### Email (Future)
- Create template with ticket codes, QR, event details
- Send via existing email service if available
- Store in `NotificationLog` as SENT or FAILED

## Trevo Integration

### Event Details Page CTA Buttons
```
+-------------------------------------+
| Book a Vehicle to this Event        | → /vehicles?city=Colombo&date=2025-03-01
| Find a Stay near Venue              | → /stays?city=Colombo&date=2025-03-01
+-------------------------------------+
```

Both CTAs prefill city and event start date.

## Oversale Prevention

```typescript
// In transaction:
1. SELECT totalQty - soldQty AS remaining FROM TicketType WHERE id = ? FOR UPDATE
2. IF remaining < qty THEN ROLLBACK (409: Out of stock)
3. UPDATE TicketType SET soldQty = soldQty + qty
4. INSERT Booking_Event
5. COMMIT
```

## Security & Validation

- **Auth**: Middleware checks role + partner status before accessing `/dashboard/events` and `/admin`
- **Validation**: Zod schemas for all forms
- **SQL Injection**: Prisma parameterized queries
- **File Upload**: Sanitize filenames, validate MIME types
- **Oversale**: DB transaction + atomic increment

## Seeding

Run seed script to create:
- 1 Admin user (admin@trevo.lk)
- 1 Approved partner (organizer@trevo.lk)
- 1 Demo event "Colombo Music Festival 2025"
- 3 Ticket types (General, VIP, EarlyBird)
- 1 Promo code (EARLY2025: 20% off)
- 1 Group discount (10+ tickets: 15% off)

```bash
npm run seed
```

Then run events seed:
```bash
npm run seed:events
```

## Next Steps

1. ✅ Schema + Migrations (DONE)
2. ✅ Seed script (DONE)
3. Build public events list + event details
4. Build partner dashboard pages
5. Build admin approval pages
6. Build checkout + payment handling
7. Build ticket page + QR code
8. Build check-in page
9. Add route protection (middleware)
