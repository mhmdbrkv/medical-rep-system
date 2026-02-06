import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

// Get Reps Dashboard
const getRepsDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Define date boundaries without mutating 'now'
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));

    // 1. Get Rep and SubRegion first (needed for account counts)
    const rep = await prisma.user.findUnique({
      where: { id: userId },
      include: { subRegion: true },
    });

    if (!rep) return res.status(404).json({ message: "Rep not found" });

    // 2. Run independent queries in parallel
    const [
      docCount,
      pharmCount,
      plans,
      completedVisits,
      pendingRequests,
      todayVisits,
    ] = await Promise.all([
      prisma.doctor.count({ where: { subRegion: rep.subRegion?.name } }),
      prisma.pharmacy.count({ where: { subRegion: rep.subRegion?.name } }),
      prisma.plan.findMany({
        where: {
          repId: userId,
          status: "APPROVED",
          startDate: { gte: startOfMonth, lt: endOfMonth },
        },
      }),
      prisma.visit.count({
        where: {
          userId: userId,
          date: { gte: startOfMonth, lt: endOfMonth },
          status: "COMPLETED",
        },
      }),
      prisma.request.findMany({ where: { userId, status: "PENDING" } }),
      prisma.visit.findMany({
        where: { userId: userId, date: { gte: startOfToday, lt: endOfToday } },
      }),
    ]);

    // 3. Calculations
    const totalAccounts = docCount + pharmCount;
    const targetDoctorsPlanned = plans.reduce(
      (sum, p) => sum + (p.targetDoctors || 0),
      0,
    );
    const targetVisitsPlanned = plans.reduce(
      (sum, p) => sum + (p.targetVisits || 0),
      0,
    );

    const coverage =
      totalAccounts > 0
        ? ((targetDoctorsPlanned / totalAccounts) * 100).toFixed(2)
        : 0;
    const targetAchievement =
      targetVisitsPlanned > 0
        ? ((completedVisits / targetVisitsPlanned) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      status: "success",
      data: {
        rep,
        metrics: {
          coverage: `${coverage}%`,
          targetAchievement: `${targetAchievement}%`,
          pendingRequestsCount: pendingRequests.length,
          pendingRequests,
          todayVisitsCount: todayVisits.length,
          todayVisits,
        },
      },
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Error fetching dashboard data", 500));
  }
};

// Manager Dashboard
const getManagersDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Run independent queries in parallel
    const [
      salesAggregate,
      productSales,
      productNames,
      pharmacies,
      salesByCustomer,
      requests,
      pendingRequests,
      plans,
    ] = await Promise.all([
      // Total untaxed sales (Directly from DB)
      prisma.sales.aggregate({ _sum: { untaxedTotal: true } }),

      // Product performance (Total qty sold per product)
      prisma.sales.groupBy({
        by: ["productId"],
        _sum: { qtyOrdered: true, untaxedTotal: true },
      }),

      // Product names for mapping (Could be optimized with a join if needed)
      prisma.products.findMany({
        select: { id: true, name: true },
      }),

      // Regional Mapping
      prisma.pharmacy.findMany({ select: { name: true, region: true } }),

      // Customer Mapping
      prisma.sales.groupBy({
        by: ["customer"],
        _sum: { untaxedTotal: true },
      }),

      // Requests (Limit this if you don't need literally every single one)
      prisma.request.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.request.count({ where: { status: "PENDING" } }),

      // Monthly Plans
      prisma.plan.findMany({
        where: { startDate: { gte: startOfMonth, lt: endOfMonth } },
      }),
    ]);

    // 1. Map Sales by Region (Logic remains in JS as it's a cross-table string link)
    const regionMap = Object.fromEntries(
      pharmacies.map((p) => [p.name, p.region]),
    );
    const salesByRegion = salesByCustomer.reduce((acc, sale) => {
      const region = regionMap[sale.customer] || "Unknown";
      acc[region] = (acc[region] || 0) + (sale._sum.untaxedTotal || 0);
      return acc;
    }, {});

    // 2. Format Product Performance
    const productPerformance = Object.fromEntries(
      productSales.map((p) => [
        productNames.find((n) => n.id === p.productId).name,
        p._sum.untaxedTotal,
      ]),
    );

    res.status(200).json({
      status: "success",
      data: {
        totalSales: salesAggregate._sum.untaxedTotal || 0,
        salesByRegion,
        productPerformance,
        requestsCount: requests.length,
        requests,
        pendingRequestsCount: pendingRequests,
        plansCount: plans.length,
        plans,
      },
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Error fetching manager dashboard data", 500));
  }
};

export { getRepsDashboard, getManagersDashboard };
