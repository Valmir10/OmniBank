import express from "express";
import cors from "cors";
import { Pool } from "pg";
import { env } from "./infrastructure/config/env";
import { errorHandler } from "./presentation/middleware/errorHandler";
import { createAuthRouter } from "./presentation/routes/authRoutes";
import { createDashboardRouter } from "./presentation/routes/dashboardRoutes";
import { createBudgetRouter } from "./presentation/routes/budgetRoutes";
import { createTransactionRouter } from "./presentation/routes/transactionRoutes";
import healthRoutes from "./presentation/routes/healthRoutes";
import { createDependencies } from "./infrastructure/config/dependencies";
import { SocketServer } from "./infrastructure/websocket/SocketServer";

export function createApp(pool: Pool, socketServer: SocketServer | null = null) {
  const app = express();
  const deps = createDependencies(pool, socketServer);

  // Core middleware
  app.use(cors({ origin: env.cors.origin, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/health", healthRoutes);
  app.use("/api/auth", createAuthRouter(deps.authController));
  app.use("/api/dashboard", createDashboardRouter(deps.dashboardController));
  app.use("/api/budgets", createBudgetRouter(deps.budgetController));
  app.use("/api/transactions", createTransactionRouter(deps.transactionController));

  // Error handling
  app.use(errorHandler);

  return app;
}
