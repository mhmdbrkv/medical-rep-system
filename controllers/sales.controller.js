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
