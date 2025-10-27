import bcrypt from "bcrypt";
import ApiError from "../utils/apiError.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { generateAccessToken } from "../utils/jwtToken.js";

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  // find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 404));
  }

  // generate JWT
  const accessToken = generateAccessToken(user.id);

  // update lastLogin
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date().toISOString() },
  });

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: user,
    token: accessToken,
  });
};

export { login };
