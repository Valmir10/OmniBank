import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../config/jwt";

export class SocketServer {
  private io: Server;
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }
      try {
        const payload = verifyToken(token);
        socket.data.userId = payload.userId;
        next();
      } catch {
        next(new Error("Invalid token"));
      }
    });

    this.io.on("connection", (socket: Socket) => {
      const userId = socket.data.userId as string;
      this.addUserSocket(userId, socket.id);

      socket.join(`user:${userId}`);

      socket.on("disconnect", () => {
        this.removeUserSocket(userId, socket.id);
      });
    });
  }

  emitBudgetAlert(userId: string, alert: {
    budgetId: string;
    category: string;
    limitAmount: number;
    currentSpent: number;
    exceeded: boolean;
    message: string;
  }): void {
    this.io.to(`user:${userId}`).emit("budget:alert", alert);
  }

  emitTransactionCreated(userId: string, transaction: {
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
  }): void {
    this.io.to(`user:${userId}`).emit("transaction:created", transaction);
  }

  getIO(): Server {
    return this.io;
  }

  private addUserSocket(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  private removeUserSocket(userId: string, socketId: string): void {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) this.userSockets.delete(userId);
    }
  }
}
