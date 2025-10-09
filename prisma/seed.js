import {
  PrismaClient,
  Role,
  RequestType,
  RequestStatus,
  ApprovalAction,
  VisitStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with hybrid plans...");

  // ---------- Regions ----------
  const cairo = await prisma.region.create({
    data: { name: "Cairo", city: "Cairo", country: "Egypt" },
  });

  const alex = await prisma.region.create({
    data: { name: "Alexandria", city: "Alexandria", country: "Egypt" },
  });

  // ---------- Users ----------
  const manager = await prisma.user.create({
    data: {
      name: "Ahmed Saleh",
      email: "manager@golderapharm.com",
      password: "hashedpassword",
      role: Role.MANAGER,
    },
  });

  const supervisor1 = await prisma.user.create({
    data: {
      name: "Sara Hassan",
      email: "supervisor1@golderapharm.com",
      password: "hashedpassword",
      role: Role.SUPERVISOR,
      region: {
        connect: {
          id: cairo.id,
        },
      },
    },
  });

  const rep1 = await prisma.user.create({
    data: {
      name: "Ali Mostafa",
      email: "rep1@golderapharm.com",
      password: "hashedpassword",
      role: Role.MEDICAL_REP,
      regionId: cairo.id,
      supervisorId: supervisor1.id,
    },
  });

  const rep2 = await prisma.user.create({
    data: {
      name: "Nour Ayman",
      email: "rep2@golderapharm.com",
      password: "hashedpassword",
      role: Role.MEDICAL_REP,
      regionId: cairo.id,
      supervisorId: supervisor1.id,
    },
  });

  // ---------- Clients ----------
  const doctor = await prisma.client.create({
    data: {
      name: "Dr. Hany El-Din",
      type: "DOCTOR",
      phone: "01000111222",
      regionId: cairo.id,
      latitude: 30.0444,
      longitude: 31.2357,
    },
  });

  const pharmacy = await prisma.client.create({
    data: {
      name: "Al Shifa Pharmacy",
      type: "PHARMACY",
      phone: "01000333444",
      regionId: cairo.id,
      latitude: 30.045,
      longitude: 31.233,
    },
  });

  // ---------- Products ----------
  const productA = await prisma.product.create({
    data: { name: "PainRelief", category: "Analgesic", price: 55 },
  });
  const productB = await prisma.product.create({
    data: { name: "CardioPlus", category: "Cardiology", price: 120 },
  });

  // ---------- Plan (Weekly) ----------
  const plan = await prisma.plan.create({
    data: {
      title: "October Campaign - Week 1",
      description: "Daily visit plan for Cairo reps",
      startDate: new Date("2025-10-06"),
      endDate: new Date("2025-10-12"),
      createdById: manager.id,
      products: {
        connect: [{ id: productA.id }, { id: productB.id }],
      },
    },
  });

  // ---------- PlanDays (Daily Sub-Plans for Each Rep) ----------
  const weekDates = [
    new Date("2025-10-06"),
    new Date("2025-10-07"),
    new Date("2025-10-08"),
    new Date("2025-10-09"),
    new Date("2025-10-10"),
  ];

  for (const date of weekDates) {
    await prisma.planDay.createMany({
      data: [
        { planId: plan.id, repId: rep1.id, date },
        { planId: plan.id, repId: rep2.id, date },
      ],
    });
  }

  // ---------- Visits (Linked to Daily Plans) ----------
  const planDay1 = await prisma.planDay.findFirst({
    where: { repId: rep1.id, date: new Date("2025-10-07") },
  });
  if (planDay1) {
    await prisma.visit.createMany({
      data: [
        {
          repId: rep1.id,
          clientId: doctor.id,
          planDayId: planDay1.id,
          visitDate: new Date("2025-10-07T10:00:00"),
          status: VisitStatus.COMPLETED,
          repLatitude: 30.0445,
          repLongitude: 31.2358,
          distance: 0.02,
        },
        {
          repId: rep1.id,
          clientId: pharmacy.id,
          planDayId: planDay1.id,
          visitDate: new Date("2025-10-07T12:00:00"),
          status: VisitStatus.PENDING,
        },
      ],
    });
  }

  console.log("✅ Plans, planDays, and visits seeded successfully!");
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
