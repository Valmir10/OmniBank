import app from "./app";
import { env } from "./infrastructure/config/env";

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`🏦 OmniBank API running on port ${PORT}`);
  console.log(`📡 Environment: ${env.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
