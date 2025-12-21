import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

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

export { addCommentsToCoachingReport };
