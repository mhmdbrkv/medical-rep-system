import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

// Requests Controllers
const getMyRequests = async (req, res, next) => {
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
    const {
      title,
      subject,
      description,
      type,
      urgency,
      leaveStartDate,
      leaveEndDate,
    } = req.body;

    let leaveDaysCount = 0;

    if (type === "LEAVE") {
      if (!leaveStartDate || !leaveEndDate) {
        return next(
          new ApiError("Leave start and end dates are required", 400),
        );
      }

      if (new Date(leaveStartDate) >= new Date(leaveEndDate)) {
        return next(
          new ApiError("Leave start date cannot be after end date", 400),
        );
      }

      leaveDaysCount = Math.ceil(
        (new Date(leaveEndDate) - new Date(leaveStartDate)) /
          (1000 * 60 * 60 * 24) +
          1,
      );
    }

    const data = await prisma.request.create({
      data: {
        title,
        description,
        subject,
        type,
        urgency,
        userId: req.user.id,
        leaveStartDate: type === "LEAVE" ? new Date(leaveStartDate) : null,
        leaveEndDate: type === "LEAVE" ? new Date(leaveEndDate) : null,
        leaveDaysCount: type === "LEAVE" ? leaveDaysCount : null,
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

    if (status === "APPROVED" && data.type === "LEAVE") {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          leaveDaysCountTotal: {
            increment: data.leaveDaysCount || 0,
          },
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
    next(new ApiError("Failed to update request", 500));
  }
};

export { getMyRequests, createRequest, updateRequest };
