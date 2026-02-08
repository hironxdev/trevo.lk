import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding events data...");

  try {
    // 1. Find or create an admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: "admin@trevo.lk",
          name: "Admin User",
          role: "ADMIN",
          emailVerified: new Date(),
        },
      });
      console.log("✅ Created admin user:", adminUser.email);
    } else {
      console.log("✅ Admin user exists:", adminUser.email);
    }

    // 2. Find or create an approved event organizer partner
    let organizerPartner = await prisma.partner.findFirst({
      where: {
        user: { role: "INDIVIDUAL_PARTNER" },
        kycStatus: "VERIFIED",
      },
      include: { user: true },
    });

    if (!organizerPartner) {
      const organizerUser = await prisma.user.create({
        data: {
          email: "organizer@trevo.lk",
          name: "Event Organizer",
          role: "INDIVIDUAL_PARTNER",
          phone: "+94712345678",
          emailVerified: new Date(),
        },
      });

      organizerPartner = await prisma.partner.create({
        data: {
          userId: organizerUser.id,
          partnerType: "INDIVIDUAL",
          serviceType: "BOTH", // Can do events
          kycStatus: "VERIFIED",
          fullName: "Event Organizer",
          whatsappNumber: "+94712345678",
          verifiedAt: new Date(),
        },
      });
      console.log("✅ Created event organizer partner:", organizerPartner.user?.email);
    } else {
      console.log("✅ Event organizer partner exists");
    }

    // 3. Create a demo approved event with ticket types
    const now = new Date();
    const eventStartDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
    const eventEndDate = new Date(eventStartDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days later

    let demoEvent = await prisma.event.findFirst({
      where: { slug: "colombo-music-festival-2025" },
    });

    if (!demoEvent) {
      demoEvent = await prisma.event.create({
        data: {
          organizerId: organizerPartner.id,
          slug: "colombo-music-festival-2025",
          titleEn: "Colombo Music Festival 2025",
          titleSi: "කොළඹ සංගීත උfestival 2025",
          descEn:
            "Join us for an amazing music festival featuring local and international artists performing live music across multiple stages.",
          descSi:
            "ස්තරීය සිංහල පරිවර්තනය මෙයට අයිතිවාසිකම් සඳහා.",
          category: "MUSIC",
          city: "Colombo",
          venueName: "Colombo Grounds",
          mapUrl: "https://maps.google.com/maps?q=Colombo+Grounds,+Colombo",
          posterUrl: "/images/events/sample-poster.jpg",
          startAt: eventStartDate,
          endAt: eventEndDate,
          status: "APPROVED",
        },
      });
      console.log("✅ Created demo event:", demoEvent.slug);
    } else {
      console.log("✅ Demo event exists");
    }

    // 4. Create ticket types for the event
    const ticketTypes = [
      { name: "General Admission", price: 2500, totalQty: 500 },
      { name: "VIP", price: 5000, totalQty: 100 },
      { name: "Early Bird", price: 1500, totalQty: 200 },
    ];

    for (const ticketTypeData of ticketTypes) {
      const existingTicketType = await prisma.ticketType.findFirst({
        where: {
          eventId: demoEvent.id,
          name: ticketTypeData.name,
        },
      });

      if (!existingTicketType) {
        await prisma.ticketType.create({
          data: {
            eventId: demoEvent.id,
            ...ticketTypeData,
            currency: "LKR",
            salesStartAt: now,
            salesEndAt: new Date(eventStartDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before event
          },
        });
        console.log(`✅ Created ticket type: ${ticketTypeData.name}`);
      }
    }

    // 5. Create a promo code
    let promoCode = await prisma.promoCode.findFirst({
      where: {
        eventId: demoEvent.id,
        code: "EARLY2025",
      },
    });

    if (!promoCode) {
      promoCode = await prisma.promoCode.create({
        data: {
          eventId: demoEvent.id,
          code: "EARLY2025",
          type: "PERCENT",
          value: 20, // 20% discount
          active: true,
          usageLimit: 100,
          startsAt: now,
          endsAt: new Date(eventStartDate.getTime() - 24 * 60 * 60 * 1000),
        },
      });
      console.log("✅ Created promo code: EARLY2025");
    }

    // 6. Create a group discount rule
    let groupDiscount = await prisma.groupDiscountRule.findFirst({
      where: {
        eventId: demoEvent.id,
        minQty: 10,
      },
    });

    if (!groupDiscount) {
      groupDiscount = await prisma.groupDiscountRule.create({
        data: {
          eventId: demoEvent.id,
          minQty: 10,
          type: "PERCENT",
          value: 15, // 15% discount for groups of 10+
          active: true,
        },
      });
      console.log("✅ Created group discount rule: 10+ tickets get 15% off");
    }

    console.log("\n✅ Event seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
