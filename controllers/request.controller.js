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
      leaveType,
      productIds,
      doctorIds,
      budget,
    } = req.body;

    // Validate common required fields
    if (!title || !subject || !type) {
      return next(new ApiError("Title, subject, and type are required", 400));
    }

    let leaveDaysCount = null;
    let resolvedProductIds = [];
    let resolvedDoctorIds = [];

    if (type === "LEAVE") {
      if (!leaveStartDate || !leaveEndDate || !leaveType) {
        return next(
          new ApiError(
            "Leave start date, end date, and type are required",
            400,
          ),
        );
      }

      const start = new Date(leaveStartDate);
      const end = new Date(leaveEndDate);

      // Fix 1: use > instead of >= to allow same-day leave
      if (start > end) {
        return next(
          new ApiError("Leave start date cannot be after end date", 400),
        );
      }

      // Fix 2: +1 must be outside Math.ceil(), not inside
      leaveDaysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    } else if (type === "EXPENSE" || type === "MARKETING") {
      if (
        !budget ||
        !productIds ||
        !Array.isArray(productIds) ||
        productIds.length === 0
      ) {
        return next(
          new ApiError("Budget and at least one product ID are required", 400),
        );
      }
      resolvedProductIds = productIds;
    } else if (type === "SAMPLE") {
      if (!doctorIds || !Array.isArray(doctorIds) || doctorIds.length === 0) {
        return next(new ApiError("At least one doctor ID is required", 400));
      }
      resolvedDoctorIds = doctorIds;
    } else {
      return next(new ApiError(`Invalid request type: ${type}`, 400));
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
        leaveDaysCount,
        leaveType: type === "LEAVE" ? leaveType : null,
        budget: type === "EXPENSE" || type === "MARKETING" ? budget : null,
        // Fix 3: only connect relevant relations per type
        products: { connect: resolvedProductIds.map((id) => ({ id })) },
        doctors: { connect: resolvedDoctorIds.map((id) => ({ id })) },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data,
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
