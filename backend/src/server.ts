import { createApp } from "./app";
import { env } from "./infrastructure/config/env";
import { getPool } from "./infrastructure/database/connection";

const PORT = env.port;
const pool = getPool();

const app = createApp(pool);

app.listen(PORT, () => {
  console.log(`OmniBank API running on port ${PORT}`);
  console.log(`Environment: ${env.nodeEnv}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
