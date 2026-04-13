import { Router } from "express";
import { validate, registerSchema, loginSchema } from "../middleware/validation";

const router = Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), async (_req, res, next) => {
  try {
    // Use case injection will be set up when wiring dependencies
    res.status(201).json({ message: "Registration endpoint ready" });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", validate(loginSchema), async (_req, res, next) => {
  try {
    res.status(200).json({ message: "Login endpoint ready" });
  } catch (error) {
    next(error);
  }
});

export default router;
