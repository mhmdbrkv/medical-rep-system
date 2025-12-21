import authRoutes from "./auth.route.js";
import profileRoutes from "./profile.route.js";
import repRoutes from "./rep.route.js";
import supervisorRoutes from "./supervisor.route.js";
import managerRoutes from "./manager.route.js";
import doctorRoutes from "./doctor.route.js";
import visitRoutes from "./visit.route.js";
import requestRoutes from "./request.route.js";
import planRoutes from "./plan.route.js";

export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/profiles", profileRoutes);
  app.use("/api/reps", repRoutes);
  app.use("/api/supervisors", supervisorRoutes);
  app.use("/api/managers", managerRoutes);
  app.use("/api/doctors", doctorRoutes);
  app.use("/api/visits", visitRoutes);
  app.use("/api/requests", requestRoutes);
  app.use("/api/plans", planRoutes);
};
