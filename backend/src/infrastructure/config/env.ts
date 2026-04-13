import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const env = {
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "omnibank",
    user: process.env.DB_USER || "valmirzogaj",
    password: process.env.DB_PASSWORD ?? "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "omnibank-dev-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};
