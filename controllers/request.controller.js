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

export { getMyRequests, createRequest, updateRequest };
