import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuditLogController } from "../controllers/AuditLogController";

export function createAuditLogRouter(controller: AuditLogController): Router {
  const router = Router();

  router.get("/", authMiddleware, controller.getAll);
  router.get("/:hash", authMiddleware, controller.getByHash);

  return router;
}
