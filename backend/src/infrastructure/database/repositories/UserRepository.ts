import { Pool } from "pg";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) return null;
    return this.toDomain(result.rows[0]);
  }

  async create(user: User): Promise<User> {
    const result = await this.pool.query(
      `INSERT INTO users (id, email, name, password_hash, is_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user.id, user.email, user.name, user.passwordHash, user.isVerified, user.createdAt, user.updatedAt]
    );
    return this.toDomain(result.rows[0]);
  }

  async update(user: User): Promise<User> {
    const result = await this.pool.query(
      `UPDATE users SET email = $1, name = $2, password_hash = $3, is_verified = $4, updated_at = $5
       WHERE id = $6 RETURNING *`,
      [user.email, user.name, user.passwordHash, user.isVerified, user.updatedAt, user.id]
    );
    if (result.rows.length === 0) throw new Error("User not found");
    return this.toDomain(result.rows[0]);
  }

  private toDomain(row: Record<string, unknown>): User {
    return User.create({
      id: row.id as string,
      email: row.email as string,
      name: row.name as string,
      passwordHash: row.password_hash as string,
      isVerified: row.is_verified as boolean,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}
