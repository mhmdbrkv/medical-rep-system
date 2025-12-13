import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

// Create user
const createUser = async (req, res, next) => {
  const { name, email, password, phone, role, dateOfBirth, supervisorId } =
    req.body;

  // find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    return next(new ApiError(`User with email: ${email} already exists`, 400));
  }

  // validate role
  const isRoleValid = ["MEDICAL_REP", "SUPERVISOR", "MANAGER"].includes(role);
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

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      supervisorId: supervisorId || req.user?.id,
      dateOfBirth: new Date(dateOfBirth),
    },
  });

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
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

// Get user details
const getUserDetails = async (req, res, next) => {
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
    return next(new ApiError("User not found", 404));
  }

  let yearsOfExperience = 0;
  if (user?.createdAt) {
    yearsOfExperience =
      new Date().getFullYear() - new Date(user.createdAt).getFullYear();
  }

  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: {
      yearsOfExperience,
      lastLogin: user?.lastLogin,
      joinDate: user?.createdAt,
      reportsTo: user?.supervisor,
      user,
    },
  });
};

// Update one user by id
const updateOneUserById = async (req, res, next) => {
  const { id } = req.params;

  const exists = await prisma.user.findUnique({
    where: { id },
  });
  if (!exists) {
    return next(new ApiError("User not found", 404));
  }

  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });

  let userData = { ...user };
  delete userData.password;

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: userData,
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

const addNewDoctor = async (req, res, next) => {
  const {
    name,
    email,
    phone,
    avgPatientsPerDay,
    dateOfBirth,
    specialty,
    LicenseNumber,
    latitude,
    longitude,
  } = req.body;

  // find doctor by email
  const doctor = await prisma.doctor.findFirst({
    where: { email },
  });
  if (doctor) {
    return next(
      new ApiError(`doctor with email: ${email} already exists`, 400)
    );
  }

  // Add doctor
  const newDoctor = await prisma.doctor.create({
    data: {
      name,
      email,
      phone,
      avgPatientsPerDay,
      dateOfBirth: new Date(dateOfBirth),
      specialty,
      LicenseNumber,
      latitude,
      longitude,
    },
  });

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newDoctor,
  });
};

export {
  createUser,
  getAllUsers,
  getUserDetails,
  updateOneUserById,
  deleteOneUserById,
  addNewDoctor,
};
