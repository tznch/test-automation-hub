import type { ChallengeProgress, ChallengeStatus } from './types';

const STORAGE_KEY = 'playwright-hub-progress';

export function getChallengeProgress(challengeId: string): ChallengeProgress {
  const allProgress = getAllProgress();
  return (
    allProgress[challengeId] || {
      challengeId,
      status: 'not-started',
      attempts: 0,
    }
  );
}

export function getAllProgress(): Record<string, ChallengeProgress> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function updateChallengeProgress(
  challengeId: string,
  updates: Partial<ChallengeProgress>
): void {
  const allProgress = getAllProgress();
  const current = allProgress[challengeId] || {
    challengeId,
    status: 'not-started' as ChallengeStatus,
    attempts: 0,
  };

  allProgress[challengeId] = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

export function markChallengeStarted(challengeId: string): void {
  const current = getChallengeProgress(challengeId);

  if (current.status === 'not-started') {
    updateChallengeProgress(challengeId, {
      status: 'in-progress',
      startedAt: new Date().toISOString(),
      attempts: current.attempts + 1,
    });
  } else {
    updateChallengeProgress(challengeId, {
      attempts: current.attempts + 1,
    });
  }
}

export function markChallengeCompleted(challengeId: string): void {
  updateChallengeProgress(challengeId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  });
}

export function resetChallengeProgress(challengeId: string): void {
  const allProgress = getAllProgress();
  delete allProgress[challengeId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

export function resetAllProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getProgressStats() {
  const allProgress = getAllProgress();
  const progressArray = Object.values(allProgress);

  return {
    total: progressArray.length,
    notStarted: progressArray.filter((p) => p.status === 'not-started').length,
    inProgress: progressArray.filter((p) => p.status === 'in-progress').length,
    completed: progressArray.filter((p) => p.status === 'completed').length,
  };
}
