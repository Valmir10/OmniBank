import { Pool } from "pg";
import { AuditLog } from "../../../domain/entities/AuditLog";
import { IAuditLogRepository } from "../../../domain/repositories/IAuditLogRepository";

export class AuditLogRepository implements IAuditLogRepository {
  constructor(private pool: Pool) {}

  async create(log: AuditLog): Promise<AuditLog> {
    const result = await this.pool.query(
      `INSERT INTO audit_logs (id, user_id, action, details, transaction_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [log.id, log.userId, log.action, JSON.stringify(log.details), log.transactionHash, log.createdAt]
    );
    return this.toDomain(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    const result = await this.pool.query(
      "SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows.map((row) => this.toDomain(row));
  }

  async findByTransactionHash(hash: string): Promise<AuditLog | null> {
    const result = await this.pool.query(
      "SELECT * FROM audit_logs WHERE transaction_hash = $1",
      [hash]
    );
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  private toDomain(row: Record<string, unknown>): AuditLog {
    return AuditLog.create({
      id: row.id as string,
      userId: row.user_id as string,
      action: row.action as string,
      details: (typeof row.details === "string" ? JSON.parse(row.details) : row.details) as Record<string, unknown>,
      transactionHash: row.transaction_hash as string,
      createdAt: new Date(row.created_at as string),
    });
  }
}
