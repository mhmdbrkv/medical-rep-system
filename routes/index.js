import authRoutes from "./auth.route.js";
import repRoutes from "./rep.route.js";
import managerRoutes from "./manager.route.js";
import doctorRoutes from "./doctor.route.js";

export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/reps", repRoutes);
  app.use("/api/managers", managerRoutes);
  app.use("/api/doctors", doctorRoutes);
};
