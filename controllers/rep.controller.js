import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

// Profile Controllers
const getProfile = async (req, res) => {
  const data = await prisma.user.findUnique({
    where: { id: req.user.id },
  });
  let user = { ...data };
  delete user.password;

  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    data: user,
  });
};

const updateProfile = async (req, res) => {
  const data = await prisma.user.update({
    where: { id: req.user.id },
    data: req.body,
  });
  res.status(200).json({
    status: "success",
    message: "Data updated successfully",
    data: data,
  });
};

// Plans Controllers
const createPlan = async (req, res) => {
  const { name, type, status, startDate, endDate, doctors, objectives } =
    req.body;

  const data = await prisma.plan.create({
    data: {
      name,
      type,
      status,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      doctors: { connect: doctors.map((id) => ({ id })) },
      objectives,
      createdBy: { connect: { id: req.user.id } },
    },
  });
  res.status(201).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getAllPlans = async (req, res) => {
  const data = await prisma.plan.findMany({
    where: { createdBy: { id: req.user.id } },
    include: {
      doctors: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
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

const getOnePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.plan.findUnique({
      where: { id },
      include: {
        doctors: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    next(new ApiError("Plan not found", 404));
  }
};

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

const getVisits = async (req, res) => {
  const data = await prisma.visit.findMany({
    where: { userId: req.user.id },
    include: {
      doctor: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
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

  res.status(200).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getAllVisitReports = async (req, res) => {
  const data = await prisma.visitReport.findMany({
    where: { userId: req.user.id },
    include: {
      visit: {
        select: {
          id: true,
          date: true,
          doctor: { select: { id: true, name: true } },
        },
      },
    },
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

// Requests Controllers
const getAllRequests = async (req, res, next) => {
  try {
    const data = await prisma.request.findMany({
      where: { userId: req.user.id },
      include: {
        user: { select: { id: true, name: true } },
      },
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
    console.error(error);
    next(new ApiError("Failed to fetch requests", 500));
  }
};

const createRequest = async (req, res, next) => {
  try {
    const { title, subject, description, type, urgency } = req.body;
    const data = await prisma.request.create({
      data: {
        title,
        description,
        subject,
        type,
        urgency,
        userId: req.user.id,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to create request", 500));
  }
};

const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;
    let responseDate = response ? new Date() : undefined;

    const data = await prisma.request.update({
      where: { id },
      data: {
        status,
        response,
        responseDate,
        handledAt: new Date(),
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to update request", 500));
  }
};

// Coaching Reports Controllers
const addCommentsToCoachingReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const data = await prisma.coachingReport.update({
      where: { id, userId: req.user.id },
      data: {
        comment,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to update coaching report", 500));
  }
};

export {
  getProfile,
  updateProfile,
  createPlan,
  getAllPlans,
  getOnePlan,
  scheduleVisit,
  getVisits,
  addVisitReports,
  getAllVisitReports,
  getAllRequests,
  createRequest,
  updateRequest,
  addCommentsToCoachingReport,
};
