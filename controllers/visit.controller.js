import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

// Visits and Visit Reports Controllers
const scheduleVisit = async (req, res) => {
  const { samples, date, time, doctorId, notes } = req.body;
  const userId = req.user.id;

  const data = await prisma.visit.create({
    data: {
      samples,
      date: new Date(date),
      time,
      doctorId,
      notes,
      userId,
    },
  });
  res.status(201).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getVisits = async (req, res) => {
  const data = await prisma.visit.findMany({
    where: { userId: req.user.id },
    include: {
      doctor: { select: { id: true, nameAR: true, nameEN: true } },
      createdBy: { select: { id: true, name: true } },
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
};

const addVisitReports = async (req, res) => {
  const {
    visitId,
    duration,
    rating,
    doctorFeedback,
    visitPurpose,
    notes,
    samplesProvided,
  } = req.body;

  const data = await prisma.visitReport.create({
    data: {
      visitId,
      userId: req.user.id,
      duration,
      rating,
      doctorFeedback,
      visitPurpose,
      notes,
      samplesProvided,
    },
  });

  await prisma.visit.update({
    where: { id: visitId },
    data: { status: "COMPLETED" },
  });

  res.status(200).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getAllVisitReports = async (req, res) => {
  const data = await prisma.visitReport.findMany({
    where: { userId: req.user.id },
    include: {
      visit: {
        select: {
          id: true,
          date: true,
          doctor: { select: { id: true, nameAR: true, nameEN: true } },
        },
      },
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
};

export { scheduleVisit, getVisits, addVisitReports, getAllVisitReports };
