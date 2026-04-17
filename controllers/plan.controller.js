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
    objectives,
    targetVisits,
    doctorsWithDates,
  } = req.body;

  const doctorIds = doctorsWithDates.map((d) => d.doctorId);

  const doctorsInDB = await prisma.doctor.findMany({
    where: { id: { in: doctorIds } },
    select: {
      id: true,
      nameAR: true,
      nameEN: true,
      accountName: true,
      subRegion: true,
    },
  });

  let doctors = doctorsInDB.map((doctor) => ({
    ...doctor,
    visitDate: doctorsWithDates.find((d) => d.doctorId === doctor.id)
      ? doctorsWithDates.find((d) => d.doctorId === doctor.id).visitDate
      : null,
  }));

  const data = await prisma.plan.create({
    data: {
      title,
      type,
      status,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      doctors: doctors,
      objectives,
      createdBy: { connect: { id: req.user.id } },
      targetDoctors: doctorsWithDates.length,
      targetVisits,
    },
  });
  res.status(201).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getMyPlans = async (req, res) => {
  const data = await prisma.plan.findMany({
    where: { createdBy: { id: req.user.id } },
    include: {
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  data.forEach((plan) => {
    plan.doctors = plan.doctors.map((doctor) => {
      const doctorDate = plan.doctorsWithDates.find(
        (d) => d.doctorId === doctor.id,
      );

      return {
        ...doctor,
        visitDate: doctorDate ? doctorDate.visitDate : null,
      };
    });
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

const getAllPlans = async (req, res) => {
  const data = await prisma.plan.findMany({
    include: {
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

const getOnePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.plan.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    });

    data.doctors = data.doctors.map((doctor) => {
      const doctorDate = data.doctorsWithDates.find(
        (d) => d.doctorId === doctor.id,
      );

      return {
        ...doctor,
        visitDate: doctorDate ? doctorDate.visitDate : null,
      };
    });

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
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
      where: {
        OR: [
          { createdBy: { id: req.user.id } },
          { in: teamIds.map((team) => team.id) },
        ],
        status: "PENDING",
      },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    let myPlans = plans.filter((plan) => plan.createdById === req.user.id);
    let repPlans = plans.filter((plan) => teamIds.includes(plan.createdById));
    let teamMembers = repPlans.map((plan) => [...new Set(plan.createdBy.name)]);

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: {
        teamMembers: teamMembers.length,
        pendingPlans: repPlans.length,
        repPlans,
        myPlans,
      },
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch requests", 500));
  }
};

const updateOnePlan = async (req, res, next) => {
  const { id } = req.params;

  const data = await prisma.plan.update({
    where: { id },
    data: req.body,
  });
  res
    .status(200)
    .json({ status: "success", message: "Plan updated successfully", data });
};

export {
  createPlan,
  getAllPlans,
  getMyPlans,
  getOnePlan,
  getPlansMGMT,
  updateOnePlan,
};
