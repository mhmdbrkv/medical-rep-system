import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const getRepDetails = async (req, res, next) => {
  try {
    const rep = await prisma.user.findUnique({
      where: {
        id: req.params.repId,
        supervisorId: req.user.id,
        role: "MEDICAL_REP",
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: rep,
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError(`Get Rep Details Error: ${err}`));
  }
};

const getSupervisorTeam = async (req, res, next) => {
  try {
    const team = await prisma.user.findMany({
      where: { supervisorId: req.user.id },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: {
        results: team.length,
        data: team,
      },
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError(`Get Supervisor Team Error: ${err}`));
  }
};

const getTeamRequests = async (req, res, next) => {
  try {
    const reps = await prisma.user.findMany({
      where: { supervisorId: req.user.id },
      select: { id: true, requests: true },
    });

    if (reps.length === 0) {
      res.status(200).json({
        status: "success",
        message: "No requests found",
      });
    }

    const data = await prisma.request.findMany({
      where: { userId: { in: reps.map((rep) => rep.id) } },
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

export { getSupervisorTeam, getRepDetails, getTeamRequests };
