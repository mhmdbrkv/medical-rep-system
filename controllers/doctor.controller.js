import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

// Add new doctor
const addNewDoctor = async (req, res, next) => {
  const {
    name,
    email,
    phone,
    hospital,
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
      hospital,
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

// Get all doctors
const getAllDoctors = async (req, res) => {
  const doctors = await prisma.doctor.findMany({ include: { hospital: true } });
  res.status(200).json({
    status: "success",
    message: "Doctors fetched successfully",
    data: {
      results: doctors.length,
      doctors,
    },
  });
};

// Get One Doctor by id
const getOneDoctor = async (req, res, next) => {
  const { id } = req.params;

  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { hospital: true },
  });

  if (!doctor) {
    return next(new ApiError("Doctor not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Doctor fetched successfully",
    data: doctor,
  });
};

// Update one doctor by id
const updateDoctor = async (req, res, next) => {
  const { id } = req.params;

  const exists = await prisma.doctor.findUnique({
    where: { id },
    include: { hospital: true },
  });
  if (!exists) {
    return next(new ApiError("Doctor not found", 404));
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    message: "Doctor updated successfully",
    data: doctor,
  });
};

// Delete one doctor by id
const deleteDoctor = async (req, res, next) => {
  const { id } = req.params;

  const exists = await prisma.doctor.findUnique({
    where: { id },
  });
  if (!exists) {
    return next(new ApiError("Doctor not found", 404));
  }
  await prisma.doctor.delete({
    where: { id },
  });
  res
    .status(200)
    .json({ status: "success", message: "Doctor deleted successfully" });
};

export {
  addNewDoctor,
  getAllDoctors,
  getOneDoctor,
  updateDoctor,
  deleteDoctor,
};
