import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const addAppraisal = async (req, res, next) => {
  const {
    repId,
    period,
    salesPerformance,
    customerRelationships,
    productKnowledge,
    complianceAndRegulations,
    teamworkAndCollaboration,
    feedbackComments,
  } = req.body;

  try {
    const appraisal = await prisma.appraisal.create({
      data: {
        repId,
        managerId: req.user.id,
        period,
        salesPerformance,
        customerRelationships,
        productKnowledge,
        complianceAndRegulations,
        teamworkAndCollaboration,
        feedbackComments,
      },
    });

    res.status(201).json({
      success: true,
      message: "Appraisal added successfully",
      data: appraisal,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to add appraisal", 500));
  }
};
const getAppraisals = async (req, res, next) => {
  try {
    const appraisals = await prisma.appraisal.findMany({
      include: {
        rep: true,
        manager: true,
      },
    });
    res.status(200).json({
      success: true,
      data: appraisals,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch appraisals", 500));
  }
};

export { addAppraisal, getAppraisals };
