import type { FastifyRequest, FastifyReply } from 'fastify';
import Database from 'better-sqlite3';
import path from 'node:path';

interface RequestLogEntry {
  id?: number;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  userId: number | null;
  userAgent: string | null;
  ip: string;
}

let db: Database.Database;
let loggingEnabled = false;

export function initializeRequestLogger(dbPath?: string) {
  const actualDbPath = dbPath || path.join(process.cwd(), 'data', 'database.sqlite');
  db = new Database(actualDbPath);

  // Create request_logs table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS request_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      method TEXT NOT NULL,
      path TEXT NOT NULL,
      status_code INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      user_id INTEGER,
      user_agent TEXT,
      ip TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create index for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_request_logs_timestamp ON request_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_request_logs_user_id ON request_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_request_logs_path ON request_logs(path);
  `);

  loggingEnabled = true;
}

export function enableRequestLogging(enabled: boolean) {
  loggingEnabled = enabled;
}

export function logRequest(entry: RequestLogEntry) {
  if (!loggingEnabled || !db) return;

  try {
    const stmt = db.prepare(`
      INSERT INTO request_logs (timestamp, method, path, status_code, duration, user_id, user_agent, ip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      entry.timestamp,
      entry.method,
      entry.path,
      entry.statusCode,
      entry.duration,
      entry.userId,
      entry.userAgent,
      entry.ip
    );
  } catch (error) {
    console.error('Error logging request:', error);
  }
}

export function getRequestLogs(options: {
  limit?: number;
  offset?: number;
  userId?: number;
  method?: string;
  path?: string;
  minDuration?: number;
}) {
  if (!db) return [];

  const { limit = 100, offset = 0, userId, method, path: pathFilter, minDuration } = options;

  let query = 'SELECT * FROM request_logs WHERE 1=1';
  const params: unknown[] = [];

  if (userId) {
    query += ' AND user_id = ?';
    params.push(userId);
  }

  if (method) {
    query += ' AND method = ?';
    params.push(method);
  }

  if (pathFilter) {
    query += ' AND path LIKE ?';
    params.push(`%${pathFilter}%`);
  }

  if (minDuration) {
    query += ' AND duration >= ?';
    params.push(minDuration);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

export function clearRequestLogs() {
  if (!db) return;
  db.prepare('DELETE FROM request_logs').run();
}

export async function requestLoggerMiddleware(request: FastifyRequest, reply: FastifyReply) {
  if (!loggingEnabled) return;

  const startTime = Date.now();

  // Store original send method
  const originalSend = reply.send.bind(reply);

  // Override send to log before sending
  reply.send = function (payload: unknown) {
    const duration = Date.now() - startTime;
    const userId = (request.user as { id?: number })?.id || null;
    const userAgent = request.headers['user-agent'] || null;

    const logEntry: RequestLogEntry = {
      timestamp: new Date().toISOString(),
      method: request.method,
      path: request.url.split('?')[0], // Remove query params for cleaner logs
      statusCode: reply.statusCode,
      duration,
      userId,
      userAgent,
      ip: request.ip,
    };

    logRequest(logEntry);

    return originalSend(payload);
  };
}
