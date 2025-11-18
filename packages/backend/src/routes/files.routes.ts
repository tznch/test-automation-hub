import type { FastifyInstance } from 'fastify';
import { pipeline } from 'stream/promises';
import { createWriteStream, createReadStream } from 'fs';
import { unlink, mkdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';
import { fileModel } from '../models/file.model.js';
import { authenticate } from '../middleware/auth.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Ensure upload directory exists
await mkdir(UPLOAD_DIR, { recursive: true });

export default async function fileRoutes(fastify: FastifyInstance) {
  // Upload file(s) - supports multiple files, no auth required for challenge
  fastify.post('/upload', async (request, reply) => {
    try {
      const files = await request.saveRequestFiles({
        limits: {
          fileSize: MAX_FILE_SIZE,
        },
      });

      if (!files || files.length === 0) {
        return reply.code(400).send({ error: 'No files uploaded' });
      }

      const uploadedFiles = [];

      for (const data of files) {
        // Generate unique filename
        const ext = extname(data.filename);
        const filename = `${randomBytes(16).toString('hex')}${ext}`;
        const filepath = join(UPLOAD_DIR, filename);

        try {
          // Save file to disk
          await pipeline(data.file, createWriteStream(filepath));

          // Get file size
          const stats = await stat(filepath);

          // Save metadata to database
          const file = fileModel.create({
            filename,
            originalName: data.filename,
            mimetype: data.mimetype,
            size: stats.size,
            path: filepath,
            uploadedBy: (request.user as any)?.id || null,
          });

          uploadedFiles.push(file);
        } catch (error) {
          // Clean up file if save fails
          try {
            await unlink(filepath);
          } catch {}
          throw error;
        }
      }

      return reply.code(201).send({
        files: uploadedFiles,
        message: 'Files uploaded successfully',
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Upload failed' });
    }
  });

  // List files
  fastify.get<{
    Querystring: { userId?: string };
  }>('/files', { preHandler: authenticate }, async (request, reply) => {
    const user = request.user as any;
    const isAdmin = user.role === 'admin' || user.role === 'moderator';

    // Parse userId from query
    let uploadedBy: number | undefined;
    if (request.query.userId) {
      uploadedBy = parseInt(request.query.userId, 10);
      // Non-admins can only see their own files
      if (!isAdmin && uploadedBy !== user.id) {
        uploadedBy = user.id;
      }
    } else if (!isAdmin) {
      // Non-admins can only see their own files
      uploadedBy = user.id;
    }

    const files = fileModel.findAll(uploadedBy);

    return reply.send({
      files,
      count: files.length,
    });
  });

  // Get file metadata by ID
  fastify.get<{
    Params: { id: string };
  }>('/files/:id', { preHandler: authenticate }, async (request, reply) => {
    const file = fileModel.findById(parseInt(request.params.id, 10));

    if (!file) {
      return reply.code(404).send({ error: 'File not found' });
    }

    const user = request.user as any;
    const isAdmin = user.role === 'admin' || user.role === 'moderator';

    // Check access permissions
    if (!isAdmin && file.uploadedBy !== user.id) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    return reply.send(file);
  });

  // Download file
  fastify.get<{
    Params: { id: string };
  }>('/files/:id/download', { preHandler: authenticate }, async (request, reply) => {
    const file = fileModel.findById(parseInt(request.params.id, 10));

    if (!file) {
      return reply.code(404).send({ error: 'File not found' });
    }

    const user = request.user as any;
    const isAdmin = user.role === 'admin' || user.role === 'moderator';

    // Check access permissions
    if (!isAdmin && file.uploadedBy !== user.id) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    try {
      const stream = createReadStream(file.path);

      return reply
        .header('Content-Type', file.mimetype)
        .header('Content-Disposition', `attachment; filename="${file.originalName}"`)
        .send(stream);
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to read file' });
    }
  });

  // Delete file
  fastify.delete<{
    Params: { id: string };
  }>('/files/:id', { preHandler: authenticate }, async (request, reply) => {
    const file = fileModel.findById(parseInt(request.params.id, 10));

    if (!file) {
      return reply.code(404).send({ error: 'File not found' });
    }

    const user = request.user as any;
    const isAdmin = user.role === 'admin' || user.role === 'moderator';

    // Check access permissions
    if (!isAdmin && file.uploadedBy !== user.id) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    try {
      // Delete from filesystem
      await unlink(file.path);

      // Delete from database
      fileModel.delete(file.id);

      return reply.send({ message: 'File deleted successfully' });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to delete file' });
    }
  });
}
