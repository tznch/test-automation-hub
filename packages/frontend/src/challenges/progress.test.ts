import { describe, it, expect, beforeEach } from 'vitest';
import {
  getChallengeProgress,
  getAllProgress,
  resetAllProgress,
  markChallengeCompleted,
  markChallengeStarted,
} from './progress';

describe('Challenge Progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getChallengeProgress', () => {
    it('should return not-started status for new challenge', () => {
      const progress = getChallengeProgress('test-challenge');
      expect(progress.status).toBe('not-started');
      expect(progress.completedAt).toBeUndefined();
    });

    it('should return saved progress', () => {
      markChallengeCompleted('test-challenge');
      const progress = getChallengeProgress('test-challenge');
      expect(progress.status).toBe('completed');
      expect(progress.completedAt).toBeDefined();
    });
  });

  describe('updateChallengeProgress', () => {
    it('should save progress to localStorage', () => {
      markChallengeStarted('test-challenge');
      const saved = JSON.parse(localStorage.getItem('playwright-hub-progress') || '{}');
      expect(saved['test-challenge'].status).toBe('in-progress');
    });

    it('should update existing progress', () => {
      markChallengeStarted('test-challenge');
      markChallengeCompleted('test-challenge');
      const progress = getChallengeProgress('test-challenge');
      expect(progress.status).toBe('completed');
    });

    it('should set completedAt timestamp for completed status', () => {
      const before = Date.now();
      markChallengeCompleted('test-challenge');
      const progress = getChallengeProgress('test-challenge');
      const after = Date.now();

      expect(progress.completedAt).toBeDefined();
      const timestamp = new Date(progress.completedAt!).getTime();
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('getAllProgress', () => {
    it('should return empty object when no progress', () => {
      const progress = getAllProgress();
      expect(progress).toEqual({});
    });

    it('should return all saved progress', () => {
      markChallengeCompleted('challenge-1');
      markChallengeStarted('challenge-2');
      const progress = getAllProgress();
      expect(Object.keys(progress)).toHaveLength(2);
      expect(progress['challenge-1'].status).toBe('completed');
      expect(progress['challenge-2'].status).toBe('in-progress');
    });
  });

  describe('resetAllProgress', () => {
    it('should clear all progress', () => {
      markChallengeCompleted('challenge-1');
      markChallengeStarted('challenge-2');
      resetAllProgress();
      const progress = getAllProgress();
      expect(progress).toEqual({});
    });

    it('should remove localStorage item', () => {
      markChallengeCompleted('test-challenge');
      resetAllProgress();
      expect(localStorage.getItem('playwright-hub-progress')).toBeNull();
    });
  });
});
