import authRoutes from "./auth.route.js";
import managerRoutes from "./manager.route.js";

export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/manager", managerRoutes);
};
