import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";
import { ApiFeatures, paginationResults } from "../utils/apiFeatures.js";

// Visits and Visit Reports Controllers
const scheduleVisit = async (req, res, next) => {
  try {
    const {
      samples,
      date,
      time,
      doctorId,
      notes,
      visitType,
      medicalRepId,
      supervisorId,
    } = req.body;

    const targetUserId =
      req.user.role === "MANAGER" && medicalRepId ? medicalRepId : req.user.id;

    if (req.user.role === "MANAGER" && medicalRepId) {
      const rep = await prisma.user.findUnique({
        where: { id: medicalRepId },
        select: { id: true, managerId: true, supervisorId: true },
      });

      if (!rep || rep.managerId !== req.user.id) {
        return next(new ApiError("Selected rep is not under your management", 400));
      }

      if (supervisorId && rep.supervisorId !== supervisorId) {
        return next(new ApiError("Selected supervisor does not match the rep", 400));
      }
    }

    const data = await prisma.visit.create({
      data: {
        samples: Array.isArray(samples) ? samples : [],
        date: new Date(date),
        time,
        doctorId,
        notes,
        userId: targetUserId,
        visitType: visitType ? String(visitType).toUpperCase() : "ROUTINE",
      },
    });

    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to schedule visit", 500));
  }
};

const getVisits = async (req, res, next) => {
  try {
    let { paginate } = req.query;
    let dateFilter = undefined;
    if (req.query.date) {
      const clientDate = new Date(req.query.date);

      // 1. Check for Invalid Date
      if (isNaN(clientDate.getTime())) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid date format provided.",
        });
      }

      // 2. Safely calculate month start/end using UTC to avoid server timezone bugs
      // We use `Date.UTC` to get the Exact 1st of the required month in UTC
      const startOfTheMonth = new Date(
        Date.UTC(clientDate.getUTCFullYear(), clientDate.getUTCMonth(), 1),
      );

      // The 1st day of the NEXT month. We'll use `lt` (less than) in Prisma for this.
      const endOfTheMonth = new Date(
        Date.UTC(clientDate.getUTCFullYear(), clientDate.getUTCMonth() + 1, 1),
      );

      dateFilter = { gte: startOfTheMonth, lt: endOfTheMonth };
    }

    if (paginate === "false") {
      const data = await prisma.visit.findMany({
        where: {
          userId: req.user.id,
          ...(dateFilter && { date: dateFilter }),
        },
        include: {
          doctor: {
            select: { id: true, nameAR: true, nameEN: true, accountName: true },
          },
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        status: "success",
        message: "Data fetched successfully",
        results: data.length,
        pagination: null,
        data: data,
      });
    }

    // Instantiate the ApiFeatures class and apply features
    const apiFeatures = new ApiFeatures(req.query);
    const { queryObj, pagination } = apiFeatures.applyFeatures(req.query);

    const whereClause = {
      ...queryObj.where,
      userId: req.user.id,
      ...(dateFilter && { date: dateFilter }),
    };

    // Get total count of documents for accurate pagination calculations
    const totalDocuments = await prisma.visit.count({
      where: whereClause,
    });

    const data = await prisma.visit.findMany({
      where: whereClause,
      include: {
        doctor: {
          select: { id: true, nameAR: true, nameEN: true, accountName: true },
        },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: queryObj.orderBy || { createdAt: "desc" },
      take: queryObj.take, // Apply limit
      skip: queryObj.skip, // Apply pagination skip
    });

    const paginationData = paginationResults(pagination, totalDocuments);

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      results: totalDocuments,
      pagination: paginationData,
      data: data,
    });
  } catch (error) {
    // Route the error to your global error middleware
    console.error(error);
    next(error);
  }
};

const getAllVisits = async (req, res, next) => {
  try {
    let { paginate } = req.query;
    let whereClause = {};
    const clientDate = req.query.date ? new Date(req.query.date) : null;
    const { createdById } = req.query || null;

    if (clientDate && isNaN(clientDate.getTime())) {
      throw new ApiError("Invalid date format provided", 400);
    }

    if (createdById) {
      whereClause.userId = createdById;
      delete whereClause.createdById;
    }

    if (clientDate) {
      const startOfToday = new Date(clientDate);
      const endOfToday = new Date(clientDate);

      startOfToday.setUTCHours(0, 0, 0, 0);
      endOfToday.setUTCHours(23, 59, 59, 999);

      whereClause.date = {
        gte: startOfToday,
        lte: endOfToday,
      };
    }

    if (paginate === "false") {
      const data = await prisma.visit.findMany({
        where: whereClause,
        include: {
          doctor: {
            select: { id: true, nameAR: true, nameEN: true, accountName: true },
          },
          createdBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        status: "success",
        message: "Data fetched successfully",
        results: data.length,
        pagination: null,
        data: data,
      });
    }

    // Instantiate the ApiFeatures class and apply features
    const apiFeatures = new ApiFeatures(req.query);
    const { queryObj, pagination } = apiFeatures.applyFeatures(req.query);
    whereClause = {
      ...queryObj.where,
    };

    // Get total count of documents for accurate pagination calculations
    const totalDocuments = await prisma.visit.count({ where: whereClause });

    const data = await prisma.visit.findMany({
      where: whereClause,
      include: {
        doctor: {
          select: { id: true, nameAR: true, nameEN: true, accountName: true },
        },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: queryObj.orderBy || { createdAt: "desc" },
      take: queryObj.take, // Apply limit
      skip: queryObj.skip, // Apply pagination skip
    });

    const paginationData = paginationResults(pagination, totalDocuments);

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      results: totalDocuments,
      pagination: paginationData,
      data: data,
    });
  } catch (error) {
    // Route the error to your global error middleware
    console.error(error);
    next(error);
  }
};

const addVisitReports = async (req, res) => {
  const {
    visitId,
    duration,
    rating,
    doctorFeedback,
    visitPurpose,
    notes,
    samplesProvided,
  } = req.body;

  const data = await prisma.visitReport.create({
    data: {
      visitId,
      userId: req.user.id,
      duration,
      rating,
      doctorFeedback,
      visitPurpose,
      notes,
      samplesProvided,
    },
  });

  await prisma.visit.update({
    where: { id: visitId },
    data: { status: "COMPLETED" },
  });

  res.status(200).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getMyVisitReports = async (req, res, next) => {
  try {
    let { paginate } = req.query;

    if (paginate === "false") {
      const data = await prisma.visitReport.findMany({
        where: { userId: req.user.id },
        include: {
          visit: {
            select: {
              id: true,
              date: true,
              doctor: {
                select: {
                  id: true,
                  nameAR: true,
                  nameEN: true,
                  accountName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        status: "success",
        message: "Data fetched successfully",
        results: data.length,
        pagination: null,
        data: data,
      });
    }

    // Instantiate the ApiFeatures class and apply features
    const apiFeatures = new ApiFeatures(req.query);
    const { queryObj, pagination } = apiFeatures.applyFeatures(req.query);
    const whereClause = {
      ...queryObj.where,
      userId: req.user.id,
    };

    // Get total count of documents for accurate pagination calculations
    const totalDocuments = await prisma.visitReport.count({
      where: whereClause,
    });

    const data = await prisma.visitReport.findMany({
      where: whereClause,
      include: {
        visit: {
          select: {
            id: true,
            date: true,
            doctor: {
              select: {
                id: true,
                nameAR: true,
                nameEN: true,
                accountName: true,
              },
            },
          },
        },
      },
      orderBy: queryObj.orderBy || { createdAt: "desc" },
      take: queryObj.take, // Apply limit
      skip: queryObj.skip, // Apply pagination skip
    });
    const paginationData = paginationResults(pagination, totalDocuments);

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      results: totalDocuments,
      pagination: paginationData,
      data: data,
    });
  } catch (error) {
    // Route the error to your global error middleware
    console.error(error);
    next(error);
  }
};

const getAllVisitReports = async (req, res) => {
  try {
    let { paginate } = req.query;

    if (paginate === "false") {
      const data = await prisma.visitReport.findMany({
        include: {
          visit: {
            select: {
              id: true,
              date: true,
              doctor: {
                select: {
                  id: true,
                  nameAR: true,
                  nameEN: true,
                  accountName: true,
                },
              },
              createdBy: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        status: "success",
        message: "Data fetched successfully",
        results: data.length,
        pagination: null,
        data: data,
      });
    }

    // Instantiate the ApiFeatures class and apply features
    const apiFeatures = new ApiFeatures(req.query);
    const { queryObj, pagination } = apiFeatures.applyFeatures(req.query);
    const whereClause = {
      ...queryObj.where,
    };

    // filter by rep id
    if (req.query.createdById) {
      whereClause.userId = req.query.createdById;
      delete whereClause.createdById;
    }

    // Get total count of documents for accurate pagination calculations
    const totalDocuments = await prisma.visitReport.count({
      where: whereClause,
    });

    const data = await prisma.visitReport.findMany({
      where: whereClause,
      include: {
        visit: {
          select: {
            id: true,
            date: true,
            doctor: {
              select: {
                id: true,
                nameAR: true,
                nameEN: true,
                accountName: true,
              },
            },
            createdBy: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: queryObj.orderBy || { createdAt: "desc" },
      take: queryObj.take, // Apply limit
      skip: queryObj.skip, // Apply pagination skip
    });

    const paginationData = paginationResults(pagination, totalDocuments);

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      results: totalDocuments,
      pagination: paginationData,
      data: data,
    });
  } catch (error) {
    // Route the error to your global error middleware
    console.error(error);
    next(error);
  }
};

const updateVisit = async (req, res, next) => {
  const { id } = req.params;

  const data = await prisma.visit.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    message: "Data updated successfully",
    data: data,
  });
};

export {
  scheduleVisit,
  getVisits,
  addVisitReports,
  getMyVisitReports,
  getAllVisitReports,
  updateVisit,
  getAllVisits,
};
