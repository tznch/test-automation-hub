import * as crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return key === derivedKey.toString('hex');
}

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
