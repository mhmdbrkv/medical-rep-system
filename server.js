import express from "express";
import morgan from "morgan";
// import cors from "cors";
import compression from "compression";
import helmet from "helmet";

import ApiError from "./utils/apiError.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import mountRoutes from "./routes/index.js";
import { PORT, CLIENT_URL, NODE_ENV } from "./config/index.js";

const app = express();

// Configure CORS with specific options
// const corsOptions = {
//   origin: CLIENT_URL, // Allow a single origin
//   credentials: true, // Allow cookies and HTTP authentication
// };

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${NODE_ENV}`);
}

//middlewares
app.use(helmet());
// app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: "20kb" })); // allows you to parse the body of the request
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Medical Rep CRM API",
  });
});
// Mount Routes
mountRoutes(app);

app.use((req, res, next) => {
  next(new ApiError("Route not found", 404));
});

// Global Error Handling Inside Express
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.name, err.message);
  process.exit(1);
});

// Handling Rejections Outside Express
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection at:", err.name, err.message);
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});
