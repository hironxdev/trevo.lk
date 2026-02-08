-- Migration script for Stays feature
-- This script documents the schema changes for the Stays rental feature

-- New Enums Added:
-- ServiceType: VEHICLE, STAYS
-- StaysType: HOUSE, APARTMENT, VILLA, HOTEL, GUEST_HOUSE, BUNGALOW, ROOM, OTHER
-- StaysCategoryType: BUDGET, STANDARD, LUXURY, PREMIUM, BEACHFRONT, HILL_COUNTRY, CITY_CENTER, RURAL
-- StaysBookingStatus: PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED, REJECTED

-- Partner Model Updates:
-- Added: serviceType field (defaults to VEHICLE)
-- Added: stays and staysBookings relations

-- User Model Updates:
-- Added: staysBookings and staysReviews relations

-- New Models:
-- StaysCategory: Category definitions for stays
-- Stays: Property listings
-- StaysBooking: Booking records for stays
-- StaysPayment: Payment records for stays
-- StaysReview: User reviews for stays

-- Note: Run `npx prisma generate` and `npx prisma db push` after this migration
