import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { BudgetController } from "../controllers/BudgetController";

export function createBudgetRouter(controller: BudgetController): Router {
  const router = Router();

  router.get("/", authMiddleware, controller.getAll);
  router.post("/", authMiddleware, controller.create);
  router.patch("/:id", authMiddleware, controller.updateLimit);

  return router;
}
