import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

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
  if (["MANAGER", "SUPERVISOR"].includes(role) && supervisorId) {
    return next(
      new ApiError(
        "Supervisor ID is not allowed for supervisors and managers",
        400
      )
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
      supervisorId,
      managerId: req.user.id,
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
      results: users.length,
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
      isActive: true,
      regions: {
        select: {
          id: true,
          name: true,
          country: true,
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
      manager: {
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

  if (req.body?.newPassword) {
    if (await bcrypt.compare(req?.body?.newPassword, exists?.password)) {
      return next(
        new ApiError(
          "New password cannot be the same as the current password",
          400
        )
      );
    }

    const hashedPassword = await bcrypt.hash(req.body?.newPassword, 10);
    req.body.password = hashedPassword;
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

const getManagerTeam = async (req, res, next) => {
  let filter = { isActive: true };
  try {
    if (
      req.query?.role &&
      ["MEDICAL_REP", "SUPERVISOR"].includes(req.query?.role)
    ) {
      filter = { role: req.query?.role };
    }
    const team = await prisma.user.findMany({
      where: { managerId: req.user.id, ...filter },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    let supervisorsCount = 0;
    let repsCount = 0;
    team.forEach((user) => {
      if (user.role === "SUPERVISOR") {
        supervisorsCount += 1;
      } else if (user.role === "MEDICAL_REP") {
        repsCount += 1;
      }
    });

    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: {
        totalMembers: team.length,
        supervisorsCount,
        repsCount,
        data: team,
      },
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError(`Get Manager Team Error: ${err}`));
  }
};

const getTeamRequests = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { managerId: req.user.id },
      select: { id: true, requests: true },
    });

    if (users.length === 0) {
      res.status(200).json({
        status: "success",
        message: "No requests found",
      });
    }

    const data = await prisma.request.findMany({
      where: { userId: { in: users.map((rep) => rep.id) } },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: {
        results: data.length,
        data,
      },
    });
  } catch (error) {
    console.error(error);
    next(new ApiError("Failed to fetch requests", 500));
  }
};

export {
  createUser,
  getAllUsers,
  getUserDetails,
  updateOneUserById,
  deleteOneUserById,
  getManagerTeam,
  getTeamRequests,
};
