import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

// Plans Controllers
const createPlan = async (req, res, next) => {
  const {
    title,
    type,
    status,
    description,
    startDate,
    endDate,
    doctors,
    objectives,
    targetDoctors,
    targetVisits,
  } = req.body;

  let repId = null;

  if (req.user?.role === "MEDICAL_REP") {
    repId = req.user.id;
  } else {
    if (!req.body.repId) return next(new ApiError("Rep id is required", 400));
    repId = req.body.repId;
  }

  const data = await prisma.plan.create({
    data: {
      title,
      type,
      status,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      doctors: { connect: doctors.map((id) => ({ id })) },
      objectives,
      createdBy: { connect: { id: req.user.id } },
      rep: { connect: { id: repId } },
      targetDoctors,
      targetVisits,
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

const getPlansMGMT = async (req, res, next) => {
  try {
    const teamIds = await prisma.user.findMany({
      where: { supervisorId: req.user.id },
      select: { id: true },
    });

    const plans = await prisma.plan.findMany({
      where: { repId: { in: teamIds.map((team) => team.id) } },

      include: {
        doctors: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        rep: { select: { id: true, name: true } },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch requests", 500));
  }
};

export { createPlan, getAllPlans, getOnePlan, getPlansMGMT };
