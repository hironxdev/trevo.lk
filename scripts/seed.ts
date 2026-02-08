import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Clear existing data
  await prisma.adminLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  console.log("Cleared existing data")

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10)

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@trevo.lk",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+94771234567",
      emailVerified: new Date(),
    },
  })
  console.log("Created admin:", admin.email)

  // Create Regular Users
  const user1 = await prisma.user.create({
    data: {
      name: "John Perera",
      email: "john@example.com",
      password: hashedPassword,
      role: "USER",
      phone: "+94772345678",
      emailVerified: new Date(),
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: "Sarah Fernando",
      email: "sarah@example.com",
      password: hashedPassword,
      role: "USER",
      phone: "+94773456789",
      emailVerified: new Date(),
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: "Mike Silva",
      email: "mike@example.com",
      password: hashedPassword,
      role: "USER",
      phone: "+94774567890",
      emailVerified: new Date(),
    },
  })
  console.log("Created users")

  // Create Individual Partner (Verified)
  const individualPartnerUser = await prisma.user.create({
    data: {
      name: "Kasun Bandara",
      email: "kasun@example.com",
      password: hashedPassword,
      role: "INDIVIDUAL_PARTNER",
      phone: "+94775678901",
      emailVerified: new Date(),
    },
  })

  const individualPartner = await prisma.partner.create({
    data: {
      userId: individualPartnerUser.id,
      partnerType: "INDIVIDUAL",
      kycStatus: "VERIFIED",
      verifiedAt: new Date(),
      fullName: "Kasun Bandara",
      nicNumber: "199012345678",
      dateOfBirth: new Date("1990-05-15"),
      gender: "Male",
      whatsappNumber: "+94775678901",
      residentialAddress: "123 Galle Road, Colombo 03",
      drivingLicenseNumber: "B1234567",
      drivingLicenseExpiry: new Date("2027-12-31"),
      bankDetails: {
        bankName: "Commercial Bank",
        accountName: "Kasun Bandara",
        accountNumber: "1234567890",
        branch: "Colombo Main",
      },
      documents: [
        { type: "nic", url: "/placeholder.jpg", name: "NIC Front" },
        { type: "license", url: "/placeholder.jpg", name: "Driving License" },
        { type: "vehicle_book", url: "/placeholder.jpg", name: "Vehicle Book" },
      ],
    },
  })
  console.log("Created individual partner (verified)")

  // Create Individual Partner (Pending)
  const pendingIndividualUser = await prisma.user.create({
    data: {
      name: "Nimal Jayawardena",
      email: "nimal@example.com",
      password: hashedPassword,
      role: "INDIVIDUAL_PARTNER",
      phone: "+94776789012",
      emailVerified: new Date(),
    },
  })

  const pendingIndividualPartner = await prisma.partner.create({
    data: {
      userId: pendingIndividualUser.id,
      partnerType: "INDIVIDUAL",
      kycStatus: "PENDING",
      fullName: "Nimal Jayawardena",
      nicNumber: "198512345678",
      dateOfBirth: new Date("1985-08-20"),
      gender: "Male",
      whatsappNumber: "+94776789012",
      residentialAddress: "456 Kandy Road, Kadawatha",
      drivingLicenseNumber: "B7654321",
      drivingLicenseExpiry: new Date("2026-06-30"),
      bankDetails: {
        bankName: "Sampath Bank",
        accountName: "Nimal Jayawardena",
        accountNumber: "0987654321",
        branch: "Kadawatha",
      },
      documents: [
        { type: "nic", url: "/placeholder.jpg", name: "NIC Front" },
        { type: "license", url: "/placeholder.jpg", name: "Driving License" },
      ],
    },
  })
  console.log("Created individual partner (pending)")

  // Create Business Partner (Verified)
  const businessPartnerUser = await prisma.user.create({
    data: {
      name: "Lanka Rent A Car",
      email: "info@lankarentacar.lk",
      password: hashedPassword,
      role: "BUSINESS_PARTNER",
      phone: "+94112345678",
      emailVerified: new Date(),
    },
  })

  const businessPartner = await prisma.partner.create({
    data: {
      userId: businessPartnerUser.id,
      partnerType: "BUSINESS",
      kycStatus: "VERIFIED",
      verifiedAt: new Date(),
      businessName: "Lanka Rent A Car (Pvt) Ltd",
      businessRegNumber: "PV12345",
      businessRegDate: new Date("2015-03-15"),
      businessType: "Pvt Ltd",
      vatNumber: "VAT123456",
      authorizedPersonName: "Chaminda Rajapaksa",
      authorizedPersonNic: "197812345678",
      authorizedPersonDesignation: "Managing Director",
      businessAddress: "789 Duplication Road, Colombo 04",
      businessHotline: "+94112345678",
      businessEmail: "info@lankarentacar.lk",
      totalVehicles: 25,
      bankDetails: {
        bankName: "Bank of Ceylon",
        accountName: "Lanka Rent A Car (Pvt) Ltd",
        accountNumber: "5678901234",
        branch: "Colombo Fort",
      },
      documents: [
        { type: "business_reg", url: "/placeholder.jpg", name: "Business Registration" },
        { type: "vat", url: "/placeholder.jpg", name: "VAT Certificate" },
        { type: "id", url: "/placeholder.jpg", name: "Director NIC" },
      ],
    },
  })
  console.log("Created business partner (verified)")

  // Create Business Partner (Pending)
  const pendingBusinessUser = await prisma.user.create({
    data: {
      name: "Quick Wheels",
      email: "contact@quickwheels.lk",
      password: hashedPassword,
      role: "BUSINESS_PARTNER",
      phone: "+94113456789",
      emailVerified: new Date(),
    },
  })

  const pendingBusinessPartner = await prisma.partner.create({
    data: {
      userId: pendingBusinessUser.id,
      partnerType: "BUSINESS",
      kycStatus: "PENDING",
      businessName: "Quick Wheels",
      businessRegNumber: "SP67890",
      businessRegDate: new Date("2020-07-01"),
      businessType: "Sole Proprietor",
      authorizedPersonName: "Sunil Perera",
      authorizedPersonNic: "198012345678",
      authorizedPersonDesignation: "Owner",
      businessAddress: "45 Negombo Road, Wattala",
      businessHotline: "+94113456789",
      businessEmail: "contact@quickwheels.lk",
      totalVehicles: 5,
      bankDetails: {
        bankName: "HNB",
        accountName: "Quick Wheels",
        accountNumber: "1122334455",
        branch: "Wattala",
      },
      documents: [{ type: "business_reg", url: "/placeholder.jpg", name: "Business Registration" }],
    },
  })
  console.log("Created business partner (pending)")

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Budget Daily",
        description: "Affordable cars for everyday use",
        slug: "budget-daily",
        category: "BUDGET_DAILY",
        icon: "car",
      },
    }),
    prisma.category.create({
      data: {
        name: "Luxury",
        description: "Premium vehicles for special occasions",
        slug: "luxury",
        category: "LUXURY",
        icon: "crown",
      },
    }),
    prisma.category.create({
      data: {
        name: "Mid Range",
        description: "Comfortable vehicles for families",
        slug: "mid-range",
        category: "MID_RANGE",
        icon: "car-front",
      },
    }),
    prisma.category.create({
      data: {
        name: "Tourism",
        description: "Vehicles perfect for sightseeing",
        slug: "tourism",
        category: "TOURISM",
        icon: "map",
      },
    }),
    prisma.category.create({
      data: {
        name: "Travel",
        description: "Long distance travel vehicles",
        slug: "travel",
        category: "TRAVEL",
        icon: "plane",
      },
    }),
    prisma.category.create({
      data: {
        name: "Business",
        description: "Professional vehicles for executives",
        slug: "business",
        category: "BUSINESS",
        icon: "briefcase",
      },
    }),
  ])
  console.log("Created categories")

  // Create Vehicles for Individual Partner (Approved)
  const vehicle1 = await prisma.vehicle.create({
    data: {
      partnerId: individualPartner.id,
      categoryId: categories[0].id, // Budget Daily
      make: "Toyota",
      model: "Axio",
      year: 2019,
      color: "White",
      licensePlate: "CAB-1234",
      status: "AVAILABLE",
      pricePerDay: 5500,
      depositRequired: 15000,
      unlimitedMileage: false,
      pricePerKm: 35,
      location: "Colombo",
      images: ["/toyota-corolla.jpg", "/car-front.png"],
      isApproved: true,
      approvedAt: new Date(),
      features: {
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        airConditioning: true,
        bluetooth: true,
        reverseCamera: true,
      },
      specifications: {
        engine: "1500cc",
        mileage: "15 km/l",
        doors: 4,
      },
    },
  })

  // Create Vehicles for Business Partner (Mixed approval status)
  const vehicle2 = await prisma.vehicle.create({
    data: {
      partnerId: businessPartner.id,
      categoryId: categories[1].id, // Luxury
      make: "Mercedes-Benz",
      model: "E-Class",
      year: 2022,
      color: "Black",
      licensePlate: "LUX-5678",
      status: "AVAILABLE",
      pricePerDay: 25000,
      depositRequired: 100000,
      unlimitedMileage: true,
      location: "Colombo",
      images: ["/car-side-view.png"],
      isApproved: true,
      approvedAt: new Date(),
      features: {
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        airConditioning: true,
        bluetooth: true,
        reverseCamera: true,
        leatherSeats: true,
        sunroof: true,
        navigation: true,
      },
      specifications: {
        engine: "2000cc",
        mileage: "12 km/l",
        doors: 4,
      },
    },
  })

  const vehicle3 = await prisma.vehicle.create({
    data: {
      partnerId: businessPartner.id,
      categoryId: categories[2].id, // Mid Range
      make: "Honda",
      model: "Civic",
      year: 2021,
      color: "Silver",
      licensePlate: "MID-9012",
      status: "AVAILABLE",
      pricePerDay: 8500,
      depositRequired: 25000,
      unlimitedMileage: false,
      pricePerKm: 40,
      location: "Colombo",
      images: ["/honda-civic.jpg"],
      isApproved: true,
      approvedAt: new Date(),
      features: {
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        airConditioning: true,
        bluetooth: true,
        reverseCamera: true,
      },
      specifications: {
        engine: "1800cc",
        mileage: "14 km/l",
        doors: 4,
      },
    },
  })

  // Create a pending vehicle
  const vehicle4 = await prisma.vehicle.create({
    data: {
      partnerId: businessPartner.id,
      categoryId: categories[3].id, // Tourism
      make: "Toyota",
      model: "Hiace",
      year: 2020,
      color: "White",
      licensePlate: "VAN-3456",
      status: "AVAILABLE",
      pricePerDay: 15000,
      depositRequired: 50000,
      unlimitedMileage: true,
      location: "Colombo",
      images: ["/placeholder.jpg"],
      isApproved: false, // Pending approval
      features: {
        seats: 14,
        transmission: "Manual",
        fuelType: "Diesel",
        airConditioning: true,
      },
      specifications: {
        engine: "2800cc",
        mileage: "10 km/l",
        doors: 4,
      },
    },
  })
  console.log("Created vehicles")

  // Create Bookings
  const booking1 = await prisma.booking.create({
    data: {
      vehicleId: vehicle1.id,
      userId: user1.id,
      partnerId: individualPartner.id,
      startDate: new Date("2025-01-10"),
      endDate: new Date("2025-01-15"),
      totalDays: 5,
      pricing: {
        dailyRate: 5500,
        totalBase: 27500,
        deposit: 15000,
        total: 42500,
      },
      status: "COMPLETED",
      pickupLocation: "Colombo Fort",
      dropoffLocation: "Colombo Fort",
      depositPaid: 15000,
      depositRefunded: true,
    },
  })

  const booking2 = await prisma.booking.create({
    data: {
      vehicleId: vehicle2.id,
      userId: user2.id,
      partnerId: businessPartner.id,
      startDate: new Date("2025-01-20"),
      endDate: new Date("2025-01-22"),
      totalDays: 2,
      pricing: {
        dailyRate: 25000,
        totalBase: 50000,
        deposit: 100000,
        total: 150000,
      },
      status: "CONFIRMED",
      pickupLocation: "Bandaranaike Airport",
      dropoffLocation: "Colombo",
      depositPaid: 100000,
      depositRefunded: false,
    },
  })

  const booking3 = await prisma.booking.create({
    data: {
      vehicleId: vehicle3.id,
      userId: user3.id,
      partnerId: businessPartner.id,
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-02-05"),
      totalDays: 4,
      pricing: {
        dailyRate: 8500,
        totalBase: 34000,
        deposit: 25000,
        total: 59000,
      },
      status: "PENDING",
      pickupLocation: "Colombo",
      dropoffLocation: "Kandy",
      depositPaid: 25000,
      depositRefunded: false,
    },
  })
  console.log("Created bookings")

  // Create Reviews
  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      vehicleId: vehicle1.id,
      userId: user1.id,
      rating: 5,
      comment:
        "Excellent car! Very clean and well maintained. Kasun was very helpful and responsive. Highly recommended!",
      isApproved: true,
    },
  })
  console.log("Created reviews")

  // Create Payments
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: 42500,
      method: "CARD",
      status: "COMPLETED",
      transactionId: "TXN001",
      paidAt: new Date("2025-01-10"),
    },
  })

  await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      amount: 150000,
      method: "BANK_TRANSFER",
      status: "COMPLETED",
      transactionId: "TXN002",
      paidAt: new Date("2025-01-19"),
    },
  })
  console.log("Created payments")

  // Create Notifications
  await prisma.notification.create({
    data: {
      userId: individualPartnerUser.id,
      type: "KYC_APPROVED",
      title: "KYC Verified",
      message: "Your partner application has been approved. You can now add vehicles.",
      link: "/partner/dashboard",
      read: true,
    },
  })

  await prisma.notification.create({
    data: {
      userId: pendingIndividualUser.id,
      type: "KYC_PENDING",
      title: "Application Received",
      message: "Your partner application is under review. We'll notify you once verified.",
      link: "/partner/dashboard",
      read: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: "BOOKING_COMPLETED",
      title: "Booking Completed",
      message: "Your booking for Toyota Axio has been completed. Please leave a review!",
      link: "/dashboard",
      read: false,
    },
  })
  console.log("Created notifications")

  console.log("Seed completed successfully!")
  console.log("\n--- Login Credentials ---")
  console.log("Admin: admin@trevo.lk / password123")
  console.log("User: john@example.com / password123")
  console.log("Individual Partner (Verified): kasun@example.com / password123")
  console.log("Individual Partner (Pending): nimal@example.com / password123")
  console.log("Business Partner (Verified): info@lankarentacar.lk / password123")
  console.log("Business Partner (Pending): contact@quickwheels.lk / password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
