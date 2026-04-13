import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { ExchangeController } from "../controllers/ExchangeController";

export function createExchangeRouter(controller: ExchangeController): Router {
  const router = Router();

  router.get("/prices", controller.getPrices);
  router.post("/swap", authMiddleware, controller.exchange);

  return router;
}
