import express from "express";
import cors from "cors";
import { env } from "./infrastructure/config/env";
import { errorHandler } from "./presentation/middleware/errorHandler";
import authRoutes from "./presentation/routes/authRoutes";
import healthRoutes from "./presentation/routes/healthRoutes";

const app = express();

// Core middleware
app.use(cors({ origin: env.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

// Error handling
app.use(errorHandler);

export default app;
