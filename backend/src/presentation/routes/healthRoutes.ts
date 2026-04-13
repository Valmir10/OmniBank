import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "healthy",
    service: "OmniBank API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
