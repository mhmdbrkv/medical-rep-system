import { prisma } from "../config/db.js";

const addProduct = async (req, res, next) => {
  const { name, internalRef, salesPrice } = req.body;

  const product = await prisma.products.create({
    data: { name, internalRef, salesPrice },
  });
  res.status(201).json({
    status: "success",
    message: "Data created successfully",
    data: product,
  });
};

const getAllProducts = async (req, res, next) => {
  const products = await prisma.products.findMany();
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    results: products.length,
    data: products,
  });
};

export { addProduct, getAllProducts };
