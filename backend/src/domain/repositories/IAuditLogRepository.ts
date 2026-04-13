import { AuditLog } from "../entities/AuditLog";

export interface IAuditLogRepository {
  create(log: AuditLog): Promise<AuditLog>;
  findByUserId(userId: string): Promise<AuditLog[]>;
  findByTransactionHash(hash: string): Promise<AuditLog | null>;
}
