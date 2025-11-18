import { db } from '../db/database.js';
import type { RefreshToken } from '../types/models.js';

export const refreshTokenModel = {
  create(userId: number, token: string, expiresAt: Date): RefreshToken {
    const stmt = db.prepare(`
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES (@userId, @token, @expiresAt)
    `);

    const result = stmt.run({
      userId,
      token,
      expiresAt: expiresAt.toISOString(),
    });

    return this.findById(Number(result.lastInsertRowid))!;
  },

  findById(id: number): RefreshToken | undefined {
    return db
      .prepare(
        `
      SELECT id, user_id as userId, token, expires_at as expiresAt, created_at as createdAt
      FROM refresh_tokens WHERE id = ?
    `
      )
      .get(id) as RefreshToken | undefined;
  },

  findByToken(token: string): RefreshToken | undefined {
    return db
      .prepare(
        `
      SELECT id, user_id as userId, token, expires_at as expiresAt, created_at as createdAt
      FROM refresh_tokens WHERE token = ?
    `
      )
      .get(token) as RefreshToken | undefined;
  },

  deleteByToken(token: string): boolean {
    const result = db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
    return result.changes > 0;
  },

  deleteByUserId(userId: number): void {
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
  },

  deleteExpired(): void {
    db.prepare('DELETE FROM refresh_tokens WHERE expires_at < datetime("now")').run();
  },

  isValid(token: string): boolean {
    const refreshToken = this.findByToken(token);
    if (!refreshToken) return false;

    const expiresAt = new Date(refreshToken.expiresAt);
    return expiresAt > new Date();
  },
};
