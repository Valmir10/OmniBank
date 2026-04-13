import http from "http";
import { createApp } from "./app";
import { env } from "./infrastructure/config/env";
import { getPool } from "./infrastructure/database/connection";
import { SocketServer } from "./infrastructure/websocket/SocketServer";

const PORT = env.port;
const pool = getPool();

const server = http.createServer();
const socketServer = new SocketServer(server);
const app = createApp(pool, socketServer);

server.on("request", app);

server.listen(PORT, () => {
  console.log(`OmniBank API running on port ${PORT}`);
  console.log(`Environment: ${env.nodeEnv}`);
  console.log(`WebSocket: enabled`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
