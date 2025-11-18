import { db } from '../db/database.js';
import type { User } from '../types/models.js';

export const userModel = {
  findById(id: number): User | undefined {
    return db
      .prepare(
        `
      SELECT id, username, email, password, role, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE id = ?
    `
      )
      .get(id) as User | undefined;
  },

  findByEmail(email: string): User | undefined {
    return db
      .prepare(
        `
      SELECT id, username, email, password, role, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE email = ?
    `
      )
      .get(email) as User | undefined;
  },

  findByUsername(username: string): User | undefined {
    return db
      .prepare(
        `
      SELECT id, username, email, password, role, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE username = ?
    `
      )
      .get(username) as User | undefined;
  },

  findAll(): User[] {
    return db
      .prepare(
        `
      SELECT id, username, email, password, role, created_at as createdAt, updated_at as updatedAt
      FROM users
    `
      )
      .all() as User[];
  },

  create(data: { username: string; email: string; password: string; role?: string }): User {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password, role)
      VALUES (@username, @email, @password, @role)
    `);

    const result = stmt.run({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'user',
    });

    return this.findById(Number(result.lastInsertRowid))!;
  },

  update(
    id: number,
    data: Partial<Pick<User, 'username' | 'email' | 'password' | 'role'>>
  ): User | undefined {
    const updates: string[] = [];
    const params: any = { id };

    if (data.username) {
      updates.push('username = @username');
      params.username = data.username;
    }
    if (data.email) {
      updates.push('email = @email');
      params.email = data.email;
    }
    if (data.password) {
      updates.push('password = @password');
      params.password = data.password;
    }
    if (data.role) {
      updates.push('role = @role');
      params.role = data.role;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = @id`).run(params);

    return this.findById(id);
  },

  delete(id: number): boolean {
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
