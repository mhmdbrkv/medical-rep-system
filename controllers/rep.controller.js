import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

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

export { createPlan, getAllPlans, getOnePlan, addCommentsToCoachingReport };
