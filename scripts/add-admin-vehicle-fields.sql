-- This script adds new fields to the Vehicle collection for admin-created vehicles
-- Run this after updating the Prisma schema

-- For MongoDB, the schema changes will be applied automatically when using Prisma
-- This file is for documentation purposes

-- New fields added to Vehicle model:
-- isAdminCreated: Boolean (default: false) - Flag to identify admin-created vehicles
-- contactOnly: Boolean (default: false) - Disable booking, contact partner only
-- adminNotes: String (optional) - Internal notes by admin

-- After updating schema.prisma, run:
-- npx prisma generate
-- npx prisma db push
