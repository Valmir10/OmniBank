import { Request, Response, NextFunction } from "express";
import { IAuditLogRepository } from "../../domain/repositories/IAuditLogRepository";

export class AuditLogController {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }
      const logs = await this.auditLogRepository.findByUserId(req.user.userId);
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };

  getByHash = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) { res.status(401).json({ error: "Not authenticated" }); return; }
      const log = await this.auditLogRepository.findByTransactionHash(req.params.hash as string);
      if (!log) {
        res.status(404).json({ error: "Audit log not found" });
        return;
      }
      res.status(200).json(log);
    } catch (error) {
      next(error);
    }
  };
}
