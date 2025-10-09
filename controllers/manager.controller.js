import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { generateAccessToken } from "../utils/jwtToken.js";

// Create user (MEDICAL_REP | SUPERVISOR)
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

export { createUser };
