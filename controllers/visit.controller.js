import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

// Visits and Visit Reports Controllers
const scheduleVisit = async (req, res) => {
  const { samples, date, time, doctorId, notes } = req.body;
  const userId = req.user.id;

  const data = await prisma.visit.create({
    data: {
      samples,
      date: new Date(date),
      time,
      doctorId,
      notes,
      userId,
    },
  });
  res.status(201).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getVisits = async (req, res, next) => {
  try {
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

    const data = await prisma.visit.findMany({
      where: {
        userId: req.user.id,
        date: dateFilter, // Pass the safely computed bounds or undefined
      },
      include: {
        doctor: {
          select: { id: true, nameAR: true, nameEN: true, accountName: true },
        },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      // Optional: Best practice to paginate!
      // take: 50,
    });

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: {
        results: data.length,
        data,
      },
    });
  } catch (error) {
    // Route the error to your global error middleware
    next(error);
  }
};

const getAllVisits = async (req, res) => {
  const clientDate = req.query.date ? new Date(req.query.date) : null;
  const { repId } = req.query || null;
  let where = {};

  if (clientDate && isNaN(clientDate.getTime())) {
    throw new ApiError("Invalid date format provided", 400);
  }

  if (repId) {
    where.userId = repId;
  }

  if (clientDate) {
    where.date = {
      gte: clientDate,
      lte: clientDate,
    };
  }

  const startOfToday = new Date(clientDate);
  const endOfToday = new Date(clientDate);

  startOfToday.setUTCHours(0, 0, 0, 0);
  endOfToday.setUTCHours(23, 59, 59, 999);

  const data = await prisma.visit.findMany({
    where,
    include: {
      doctor: {
        select: { id: true, nameAR: true, nameEN: true, accountName: true },
      },
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    data: {
      results: data.length,
      data,
    },
  });
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

const getMyVisitReports = async (req, res) => {
  const data = await prisma.visitReport.findMany({
    where: { userId: req.user.id },
    include: {
      visit: {
        select: {
          id: true,
          date: true,
          doctor: {
            select: { id: true, nameAR: true, nameEN: true, accountName: true },
          },
          createdBy: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    data: {
      results: data.length,
      data,
    },
  });
};

const getAllVisitReports = async (req, res) => {
  // filter by rep id
  const { repId } = req.query || null;
  let where = {};
  if (repId) {
    where.userId = repId;
  }

  const data = await prisma.visitReport.findMany({
    where,
    include: {
      visit: {
        select: {
          id: true,
          date: true,
          doctor: {
            select: { id: true, nameAR: true, nameEN: true, accountName: true },
          },
          createdBy: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    data: {
      results: data.length,
      data,
    },
  });
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
