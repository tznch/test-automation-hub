import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ChallengeProvider, useChallenge } from './ChallengeContext';

describe('ChallengeContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ChallengeProvider>{children}</ChallengeProvider>
  );

  it('should provide default context values', () => {
    const { result } = renderHook(() => useChallenge(), { wrapper });
    expect(result.current.currentChallenge).toBeNull();
    expect(typeof result.current.setCurrentChallenge).toBe('function');
    expect(typeof result.current.startChallenge).toBe('function');
  });

  it('should update current challenge', () => {
    const { result } = renderHook(() => useChallenge(), { wrapper });

    const mockChallenge = {
      id: 'test-challenge',
      title: 'Test',
      description: 'Test challenge',
      level: 'beginner' as const,
      category: 'Test',
      objectives: [],
      hints: [],
      componentPath: './test',
      estimatedTime: 10,
      order: 1,
    };

    act(() => {
      result.current.setCurrentChallenge(mockChallenge);
    });

    expect(result.current.currentChallenge).toBe(mockChallenge);
  });

  it('should clear challenge', () => {
    const { result } = renderHook(() => useChallenge(), { wrapper });

    const mockChallenge = {
      id: 'test-challenge',
      title: 'Test',
      description: 'Test challenge',
      level: 'beginner' as const,
      category: 'Test',
      objectives: [],
      hints: [],
      componentPath: './test',
      estimatedTime: 10,
      order: 1,
    };

    act(() => {
      result.current.setCurrentChallenge(mockChallenge);
    });
    expect(result.current.currentChallenge).toBe(mockChallenge);

    act(() => {
      result.current.setCurrentChallenge(null);
    });
    expect(result.current.currentChallenge).toBeNull();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useChallenge());
    }).toThrow('useChallenge must be used within a ChallengeProvider');
  });
});
