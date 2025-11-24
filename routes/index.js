import authRoutes from "./auth.route.js";
import repRoutes from "./rep.route.js";

export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/reps", repRoutes);
};
