import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateToken } from '../../utils/auth.js';

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testpassword';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testpassword';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword';
      const wrongPassword = 'wrongpassword';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a random token', () => {
      const token = generateToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // Default length 32 * 2 for hex
    });

    it('should generate token with custom length', () => {
      const token = generateToken(16);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(32); // 16 * 2 for hex
    });
  });
});
