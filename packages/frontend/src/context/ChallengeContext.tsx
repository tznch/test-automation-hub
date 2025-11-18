import { createContext, useContext, useState, ReactNode } from 'react';
import type { Challenge } from '../challenges/types';
import { markChallengeStarted } from '../challenges/progress';

interface ChallengeContextType {
  currentChallenge: Challenge | null;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  startChallenge: (challenge: Challenge) => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    markChallengeStarted(challenge.id);
  };

  return (
    <ChallengeContext.Provider
      value={{
        currentChallenge,
        setCurrentChallenge,
        startChallenge,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenge() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
}
