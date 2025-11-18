import { describe, it, expect } from 'vitest';
import { getAllChallenges, getChallengeById, getChallengesByLevel } from './registry';

describe('Challenge Registry', () => {
  describe('getAllChallenges', () => {
    it('should return all challenges', () => {
      const challenges = getAllChallenges();
      expect(challenges).toHaveLength(63);
    });

    it('should return challenges with required properties', () => {
      const challenges = getAllChallenges();
      challenges.forEach((challenge) => {
        expect(challenge).toHaveProperty('id');
        expect(challenge).toHaveProperty('title');
        expect(challenge).toHaveProperty('description');
        expect(challenge).toHaveProperty('level');
        expect(challenge).toHaveProperty('category');
        expect(challenge).toHaveProperty('order');
        expect(challenge).toHaveProperty('componentPath');
        expect(challenge).toHaveProperty('estimatedTime');
      });
    });

    it('should have unique challenge IDs', () => {
      const challenges = getAllChallenges();
      const ids = challenges.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getChallengeById', () => {
    it('should return challenge by ID', () => {
      const challenge = getChallengeById('beginner-01-login-form');
      expect(challenge).toBeDefined();
      expect(challenge?.id).toBe('beginner-01-login-form');
    });

    it('should return undefined for non-existent ID', () => {
      const challenge = getChallengeById('non-existent-id');
      expect(challenge).toBeUndefined();
    });
  });

  describe('getChallengesByLevel', () => {
    it('should return 20 beginner challenges', () => {
      const challenges = getChallengesByLevel('beginner');
      expect(challenges).toHaveLength(20);
      challenges.forEach((c) => expect(c.level).toBe('beginner'));
    });

    it('should return 23 intermediate challenges', () => {
      const challenges = getChallengesByLevel('intermediate');
      expect(challenges).toHaveLength(23);
      challenges.forEach((c) => expect(c.level).toBe('intermediate'));
    });

    it('should return 20 senior challenges', () => {
      const challenges = getChallengesByLevel('senior');
      expect(challenges).toHaveLength(20);
      challenges.forEach((c) => expect(c.level).toBe('senior'));
    });

    it('should return challenges in correct order', () => {
      const challenges = getChallengesByLevel('beginner');
      for (let i = 1; i < challenges.length; i++) {
        expect(challenges[i].order).toBeGreaterThan(challenges[i - 1].order);
      }
    });
  });

  describe('Category filtering', () => {
    it('should have challenges with category property', () => {
      const challenges = getAllChallenges();
      challenges.forEach((c) => {
        expect(c.category).toBeDefined();
        expect(typeof c.category).toBe('string');
      });
    });

    it('should have API Testing challenges', () => {
      const apiChallenges = getAllChallenges().filter((c) => c.category === 'API Testing');
      expect(apiChallenges.length).toBe(6);
    });

    it('should have challenges with different categories', () => {
      const challenges = getAllChallenges();
      const categories = new Set(challenges.map((c) => c.category));
      // Just verify we have multiple categories
      expect(categories.size).toBeGreaterThan(5);
      expect(categories.has('API Testing')).toBe(true);
    });
  });
});
