import { db } from '../db/database.js';
import type { File } from '../types/models.js';

export const fileModel = {
  findAll(uploadedBy?: number): File[] {
    if (uploadedBy) {
      return db
        .prepare(
          `
        SELECT id, filename, original_name as originalName, mimetype, size, path,
               uploaded_by as uploadedBy, created_at as createdAt
        FROM files
        WHERE uploaded_by = ?
        ORDER BY created_at DESC
      `
        )
        .all(uploadedBy) as File[];
    }

    return db
      .prepare(
        `
      SELECT id, filename, original_name as originalName, mimetype, size, path,
             uploaded_by as uploadedBy, created_at as createdAt
      FROM files
      ORDER BY created_at DESC
    `
      )
      .all() as File[];
  },

  findById(id: number): File | undefined {
    return db
      .prepare(
        `
      SELECT id, filename, original_name as originalName, mimetype, size, path,
             uploaded_by as uploadedBy, created_at as createdAt
      FROM files
      WHERE id = ?
    `
      )
      .get(id) as File | undefined;
  },

  findByFilename(filename: string): File | undefined {
    return db
      .prepare(
        `
      SELECT id, filename, original_name as originalName, mimetype, size, path,
             uploaded_by as uploadedBy, created_at as createdAt
      FROM files
      WHERE filename = ?
    `
      )
      .get(filename) as File | undefined;
  },

  create(data: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    uploadedBy?: number;
  }): File {
    const stmt = db.prepare(`
      INSERT INTO files (filename, original_name, mimetype, size, path, uploaded_by)
      VALUES (@filename, @originalName, @mimetype, @size, @path, @uploadedBy)
    `);

    const info = stmt.run({
      filename: data.filename,
      originalName: data.originalName,
      mimetype: data.mimetype,
      size: data.size,
      path: data.path,
      uploadedBy: data.uploadedBy || null,
    });

    return this.findById(Number(info.lastInsertRowid))!;
  },

  delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM files WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  },

  deleteByFilename(filename: string): boolean {
    const stmt = db.prepare('DELETE FROM files WHERE filename = ?');
    const info = stmt.run(filename);
    return info.changes > 0;
  },
};
