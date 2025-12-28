import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const addHospital = async (req, res, next) => {
  try {
    const hospital = await prisma.hospital.create({ data: req.body });
    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data: hospital,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to create hospital", 500));
  }
};

const getAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        doctors: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      results: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch hospitals", 500));
  }
};

export { addHospital, getAllHospitals };
