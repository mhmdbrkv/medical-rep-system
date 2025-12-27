import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const addCoachingReport = async (req, res, next) => {
  try {
    const {
      repId,
      doctorId,
      visitDate,
      visitDuration,
      visitLocation,
      performanceRating,
      visitPros,
      visitCons,
      recommendations,
      actionItems,
      notes,
    } = req.body;

    const data = await prisma.coachingReport.create({
      data: {
        repId,
        doctorId,
        createdById: req.user.id,
        visitDate: new Date(visitDate),
        visitDuration,
        visitLocation,
        performanceRating,
        visitPros,
        visitCons,
        recommendations,
        actionItems,
        notes,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to create coaching report", 500));
  }
};

const responseToCoachingReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, accept } = req.body;

    const exists = await prisma.coachingReport.findUnique({
      where: { id },
    });
    if (!exists) {
      return next(new ApiError("Coaching report not found", 404));
    }

    if (
      exists.repId !== req.user.id ||
      exists.createdById !== req.user.supervisorId
    ) {
      return next(
        new ApiError("Forbidden, you can only access your own data", 403)
      );
    }

    let data = {};
    if (comment) {
      data = await prisma.coachingReport.update({
        where: { id, repId: req.user.id, createdById: req.user.supervisorId },
        data: {
          repComment: comment,
        },
      });
    } else if (accept) {
      data = await prisma.coachingReport.update({
        where: { id, repId: req.user.id, createdById: req.user.supervisorId },
        data: {
          repAccepted: true,
        },
      });
    }

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

const getMyCoachingReport = async (req, res, next) => {
  try {
    const data = await prisma.coachingReport.findMany({
      where: {
        createdById: req.user.id,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch coaching report", 500));
  }
};

const getAllCoachingReport = async (req, res, next) => {
  try {
    const data = await prisma.coachingReport.findMany({});
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch coaching report", 500));
  }
};

const getRepCoachingReport = async (req, res, next) => {
  try {
    const data = await prisma.coachingReport.findMany({
      where: {
        repId: req.user.id,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch coaching report", 500));
  }
};

export {
  addCoachingReport,
  responseToCoachingReport,
  getMyCoachingReport,
  getAllCoachingReport,
  getRepCoachingReport,
};
