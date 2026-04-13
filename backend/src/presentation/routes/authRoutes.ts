import { Router } from "express";
import { validate, registerSchema, loginSchema } from "../middleware/validation";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthController } from "../controllers/AuthController";

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post("/register", validate(registerSchema), controller.register);
  router.post("/login", validate(loginSchema), controller.login);
  router.post("/verify", authMiddleware, controller.verify);
  router.get("/me", authMiddleware, controller.me);

  return router;
}
