import { prisma } from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const createForecast = async (req, res, next) => {
  const { periodType, periodDate, productForecasts, notes } = req.body;

  try {
    const forecast = await prisma.forecast.create({
      data: {
        periodType,
        periodDate: new Date(periodDate),
        productForecasts,
        notes,
        repId: req.user.id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Data created successfully",
      data: forecast,
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError(`Create Forecast Error: ${err}`));
  }
};

const getForecasts = async (req, res, next) => {
  try {
    const forecasts = await prisma.forecast.findMany({
      where: { repId: req.user.id },
      include: { rep: { select: { id: true, name: true, email: true } } },
    });
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: forecasts,
    });
  } catch (err) {
    console.error(err);
    return next(new ApiError(`Get Forecasts Error: ${err}`));
  }
};

export { createForecast, getForecasts };
