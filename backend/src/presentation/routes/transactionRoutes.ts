import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { TransactionController } from "../controllers/TransactionController";

export function createTransactionRouter(controller: TransactionController): Router {
  const router = Router();

  router.post("/", authMiddleware, controller.create);

  return router;
}
