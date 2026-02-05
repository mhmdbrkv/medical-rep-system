import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const addPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await prisma.pharmacy.createMany({ data: req.body });
    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data: pharmacy,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to create pharmacy", 500));
  }
};

const getAllPharmacies = async (req, res, next) => {
  try {
    const pharmacies = await prisma.pharmacy.findMany({});
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      results: pharmacies.length,
      data: pharmacies,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch pharmacies", 500));
  }
};

export { addPharmacy, getAllPharmacies };
