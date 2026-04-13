import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { env } from "./infrastructure/config/env";
import { errorHandler } from "./presentation/middleware/errorHandler";
import { createAuthRouter } from "./presentation/routes/authRoutes";
import healthRoutes from "./presentation/routes/healthRoutes";
import { createDependencies } from "./infrastructure/config/dependencies";

export function createApp(pool: Pool) {
  const app = express();
  const deps = createDependencies(pool);

  // Core middleware
  app.use(cors({ origin: env.cors.origin, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/health", healthRoutes);
  app.use("/api/auth", createAuthRouter(deps.authController));

  // Error handling
  app.use(errorHandler);

  return app;
}
