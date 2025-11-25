import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db.js";

import { generateAccessToken } from "../utils/jwtToken.js";

// Create user
const createUser = async (req, res, next) => {
  const { name, email, password, phone, role, supervisorId } = req.body;

  // find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    return next(new ApiError(`User with email: ${email} already exists`, 400));
  }

  // validate role
  const isRoleValid = ["MEDICAL_REP", "SUPERVISOR"].includes(role);
  if (!isRoleValid) {
    return next(new ApiError("Invalid role", 400));
  }

  // validate supervisorId
  if (role === "MEDICAL_REP" && !supervisorId) {
    return next(new ApiError("Supervisor ID is required", 400));
  }

  // validate that supervisorId is not provided for supervisors
  if (role === "SUPERVISOR" && supervisorId) {
    return next(
      new ApiError("Supervisor ID is not allowed for supervisors", 400)
    );
  }

  // create new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      role,
      supervisorId,
    },
  });

  // geerate jwt
  const accessToken = generateAccessToken(newUser.id);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
    token: accessToken,
  });
};

// Get all users
const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      supervisorId: true,
      regions: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    data: {
      count: users.length,
      users,
    },
  });
};

// Get rep details
const getUserDetails = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      supervisorId: true,
      createdAt: true,
      lastLogin: true,
      sales: {
        select: {
          id: true,
          totalPrice: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      supervisor: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  let totalSales = 0;
  user?.sales?.forEach((sale) => (totalSales += +sale?.amount));

  let yearsOfExperience = 0;
  if (user?.createdAt) {
    yearsOfExperience =
      new Date().getFullYear() - new Date(user.createdAt).getFullYear();
  }

  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: {
      totalSales,
      yearsOfExperience,
      lastLogin: user?.lastLogin,
      joinDate: user?.createdAt,
      reportsTo: user?.supervisor,
      user,
    },
  });
};

// Update one user by id
const updateOneUserById = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user,
  });
};

// Delete one user by id
const deleteOneUserById = async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id },
  });

  res
    .status(200)
    .json({ status: "success", message: "User deleted successfully" });
};

export {
  createUser,
  getAllUsers,
  getUserDetails,
  updateOneUserById,
  deleteOneUserById,
};
