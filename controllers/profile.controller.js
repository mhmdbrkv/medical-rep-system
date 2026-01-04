import { prisma } from "../config/db.js";

// Profile Controllers
const getProfile = async (req, res) => {
  const data = await prisma.user.findUnique({
    where: { id: req.user.id },
  });
  let user = { ...data };
  delete user.password;

  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    data: user,
  });
};

const updateProfile = async (req, res) => {
  if (req.body?.password) {
    delete req.body.password; // Prevent password updates through this route
  }

  const data = await prisma.user.update({
    where: { id: req.user.id },
    data: req.body,
  });
  res.status(200).json({
    status: "success",
    message: "Data updated successfully",
    data: data,
  });
};

export { getProfile, updateProfile };
