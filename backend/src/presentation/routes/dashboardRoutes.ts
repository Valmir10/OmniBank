import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { DashboardController } from "../controllers/DashboardController";

export function createDashboardRouter(controller: DashboardController): Router {
  const router = Router();

  router.get("/", authMiddleware, controller.getDashboard);

  return router;
}
