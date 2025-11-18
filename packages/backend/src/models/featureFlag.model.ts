import { db } from '../db/database.js';
import type { FeatureFlag } from '../types/models.js';

export const featureFlagModel = {
  findAll(): FeatureFlag[] {
    return db
      .prepare(
        `
      SELECT id, name, key, enabled, description, rollout_percentage as rolloutPercentage,
             created_at as createdAt, updated_at as updatedAt
      FROM feature_flags
    `
      )
      .all() as FeatureFlag[];
  },

  findByKey(key: string): FeatureFlag | undefined {
    return db
      .prepare(
        `
      SELECT id, name, key, enabled, description, rollout_percentage as rolloutPercentage,
             created_at as createdAt, updated_at as updatedAt
      FROM feature_flags WHERE key = ?
    `
      )
      .get(key) as FeatureFlag | undefined;
  },

  isEnabled(key: string, userId?: number): boolean {
    const flag = this.findByKey(key);
    if (!flag) return false;
    if (!flag.enabled) return false;

    // If rollout is 100%, everyone gets it
    if (flag.rolloutPercentage >= 100) return true;

    // If no userId provided for partial rollout, return false
    if (!userId) return false;

    // Simple deterministic rollout based on user ID
    const hash = userId % 100;
    return hash < flag.rolloutPercentage;
  },

  update(
    key: string,
    data: { enabled?: boolean; rolloutPercentage?: number }
  ): FeatureFlag | undefined {
    const updates: string[] = [];
    const params: Record<string, number | string> = { key };

    if (data.enabled !== undefined) {
      updates.push('enabled = @enabled');
      params.enabled = data.enabled ? 1 : 0;
    }
    if (data.rolloutPercentage !== undefined) {
      updates.push('rollout_percentage = @rolloutPercentage');
      params.rolloutPercentage = data.rolloutPercentage;
    }

    if (updates.length === 0) {
      return this.findByKey(key);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    db.prepare(`UPDATE feature_flags SET ${updates.join(', ')} WHERE key = @key`).run(params);

    return this.findByKey(key);
  },
};
