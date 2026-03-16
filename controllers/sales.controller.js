import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";
import xlsx from "xlsx";
import fs from "fs/promises";

const addSale = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError("Please upload a file", 400));
    }

    const existingSales = await prisma.sales.findFirst({
      where: {
        sheetName: `${req.body.sheetName}`.trim(),
      },
    });

    if (existingSales) {
      return next(
        new ApiError("Sales already exist with the same sheet name", 400),
      );
    }

    const workbook = xlsx.readFile(req.file.path, { cellDates: true });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData = xlsx.utils.sheet_to_json(sheet);

    // Optional: normalize keys
    const data = rawData.map((row) => ({
      sheetName: `${req.body.sheetName}`.trim(),
      customer: row["Customer"],
      order: row["Order"],
      orderDate: row["Order Date"],
      productVariant: row["Product Variant"],
      qtyOrdered: row["Qty Ordered"],
      untaxedTotal: row["Untaxed Total"],
    }));

    // mapping productVariant to productId
    const products = await prisma.products.findMany({
      select: { id: true, name: true, internalRef: true },
    });

    let dataWithProductIds = data.map((sale) => {
      const product = products.find(
        (p) =>
          `[${p.internalRef}] ${p.name}`.trim() === sale.productVariant?.trim(),
      );
      return {
        sheetName: sale.sheetName,
        customer: sale.customer,
        order: sale.order,
        orderDate: sale.orderDate,
        qtyOrdered: sale.qtyOrdered,
        untaxedTotal: sale.untaxedTotal,
        productId: product ? product.id : null,
      };
    });

    dataWithProductIds.pop();

    const sale = await prisma.sales.createMany({
      data: dataWithProductIds,
    });

    // Optional: delete the uploaded file after processing
    await fs.unlink(req.file.path).catch((err) => {
      console.error("Failed to delete file:", err);
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
    const { date, sheetName } = req.query;

    // 1. Always initialize the where clause with common filters
    let whereClause = {};

    if (sheetName) {
      whereClause.sheetName = sheetName;
    }

    // 2. Add date range only if date is provided
    if (date) {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return next(new ApiError("Invalid date format provided", 400));
      }

      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      // Add to existing whereClause instead of overwriting it
      whereClause.orderDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const sales = await prisma.sales.findMany({
      where: whereClause,
      include: { product: true },
      // Good practice: always sort sales by date
      orderBy: { orderDate: "desc" },
    });

    res.status(200).json({
      status: "success",
      length: sales.length,
      data: { sales },
    });
  } catch (error) {
    console.error("Sales Fetch Error:", error);
    next(new ApiError("Error fetching sales data", 500));
  }
};

// get rep sales in dashboard
const getRepsSales = async (req, res, next) => {
  try {
    const { date, sheetName } = req.query;

    // Build the where clause conditionally
    let whereClause = {};

    if (sheetName) {
      whereClause.sheetName = sheetName;
    }

    if (date) {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return next(new ApiError("Invalid date format provided", 400));
      }

      // Match the full day by using a range instead of exact equality
      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      whereClause = {
        orderDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        sheetName,
      };
    }

    // 1. Get Rep and SubRegion
    const rep = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { subRegion: true },
    });

    if (!rep) return res.status(404).json({ message: "Rep not found" });

    const userSubRegion = rep.subRegion?.name;

    const pharmacyNames = await prisma.pharmacy.findMany({
      where: { subRegion: userSubRegion },
      select: { name: true },
    });

    const namesArray = pharmacyNames.map((p) => p.name);

    const sales = await prisma.sales.findMany({
      where: {
        ...whereClause,
        customer: { in: namesArray },
      },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      status: "success",
      length: sales.length,
      data: {
        sales,
      },
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Error fetching sales dashboard data", 500));
  }
};

const getRepsSalesByRepId = async (req, res, next) => {
  try {
    const { repId } = req.params;
    const { date, sheetName } = req.query;

    // Build the where clause conditionally
    let whereClause = {};

    if (sheetName) {
      whereClause.sheetName = sheetName;
    }

    if (date) {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        return next(new ApiError("Invalid date format provided", 400));
      }

      // Match the full day by using a range instead of exact equality
      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      whereClause = {
        orderDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        sheetName,
      };
    }

    // 1. Get Rep and SubRegion
    const rep = await prisma.user.findUnique({
      where: { id: repId },
      include: { subRegion: true },
    });

    if (!rep) return res.status(404).json({ message: "Rep not found" });

    const userSubRegion = rep.subRegion?.name;

    const pharmacyNames = await prisma.pharmacy.findMany({
      where: { subRegion: userSubRegion },
      select: { name: true },
    });

    const namesArray = pharmacyNames.map((p) => p.name);

    const sales = await prisma.sales.findMany({
      where: {
        ...whereClause,
        customer: { in: namesArray },
      },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      status: "success",
      length: sales.length,
      data: {
        sales,
      },
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Error fetching sales dashboard data", 500));
  }
};

export { addSale, getAllSales, getRepsSales, getRepsSalesByRepId };
