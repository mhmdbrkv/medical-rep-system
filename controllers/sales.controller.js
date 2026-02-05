import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const addSale = async (req, res, next) => {
  try {
    for (const sale of req.body) {
      sale.orderDate = new Date(sale.orderDate);
    }

    const sale = await prisma.sales.createMany({
      data: req.body,
    });

    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data: sale,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to create sale", 500));
  }
};

const getAllSales = async (req, res, next) => {
  try {
    const sales = await prisma.sales.findMany({});
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      results: sales.length,
      data: sales,
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch sales", 500));
  }
};

export { addSale, getAllSales };
