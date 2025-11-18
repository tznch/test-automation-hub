// Challenge type definitions and interfaces

export type ChallengeLevel = 'beginner' | 'intermediate' | 'senior';
export type ChallengeStatus = 'not-started' | 'in-progress' | 'completed';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  level: ChallengeLevel;
  category: string;
  objectives: string[];
  hints: string[];
  componentPath: string;
  apiEndpoints?: string[];
  estimatedTime: number; // in minutes
  order: number;
}

export interface ChallengeProgress {
  challengeId: string;
  status: ChallengeStatus;
  startedAt?: string;
  completedAt?: string;
  attempts: number;
}

export interface ChallengeRegistry {
  beginner: Challenge[];
  intermediate: Challenge[];
  senior: Challenge[];
}
