import { prisma } from "../config/db.js";

import { getOne, updateOne } from "./HandlerFactory.js";

const getProfile = getOne("user");

const updateProfile = updateOne("user");

const createPlan = async (req, res) => {
  const { name, type, status, startDate, endDate, doctors, objectives } =
    req.body;

  const data = await prisma.plan.create({
    data: {
      name,
      type,
      status,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      doctors: { connect: doctors.map((id) => ({ id })) },
      objectives,
      createdBy: { connect: { id: req.user.id } },
    },
  });
  res.status(201).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

const getAllPlans = async (req, res) => {
  const data = await prisma.plan.findMany({
    where: { createdBy: { id: req.user.id } },
    include: {
      doctors: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    results: data.length,
    data: data,
  });
};

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
      doctor: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    results: data.length,
    data: data,
  });
};

const addVisitReports = async (req, res) => {
  const {
    visitId,
    duration,
    rating,
    discussedTopics,
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
      discussedTopics,
      doctorFeedback,
      visitPurpose,
      notes,
      samplesProvided,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Data created successfully",
    data: data,
  });
};

export {
  getProfile,
  updateProfile,
  createPlan,
  getAllPlans,
  scheduleVisit,
  getVisits,
  addVisitReports,
};
