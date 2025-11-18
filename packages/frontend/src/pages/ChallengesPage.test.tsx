import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChallengesPage from './ChallengesPage';

vi.mock('../context/ChallengeContext', () => ({
  useChallenge: () => ({
    currentChallenge: null,
    setCurrentChallenge: vi.fn(),
    startChallenge: vi.fn(),
  }),
}));

describe('ChallengesPage', () => {
  const renderChallengesPage = () => {
    return render(
      <BrowserRouter>
        <ChallengesPage />
      </BrowserRouter>
    );
  };

  it('should render page title', () => {
    renderChallengesPage();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
  });

  it('should display total challenges count', () => {
    renderChallengesPage();
    expect(screen.getByText(/63 challenges to practice/i)).toBeInTheDocument();
  });

  it('should render all stat cards', () => {
    renderChallengesPage();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Senior')).toBeInTheDocument();
  });

  it('should display correct counts in stat cards', () => {
    renderChallengesPage();
    const cards = screen.getAllByRole('button');
    expect(cards[0]).toHaveTextContent('63');
    expect(cards[1]).toHaveTextContent('20');
    expect(cards[2]).toHaveTextContent('23');
    expect(cards[3]).toHaveTextContent('20');
  });

  it('should show all challenges by default', () => {
    renderChallengesPage();
    const challengeLinks = screen.getAllByRole('link');
    expect(challengeLinks.length).toBe(63);
  });

  it('should filter to beginner challenges when clicked', () => {
    renderChallengesPage();
    const beginnerButton = screen.getByText('Beginner').closest('button')!;
    fireEvent.click(beginnerButton);
    const challengeLinks = screen.getAllByRole('link');
    expect(challengeLinks.length).toBe(20);
  });

  it('should filter to intermediate challenges when clicked', () => {
    renderChallengesPage();
    const intermediateButton = screen.getByText('Intermediate').closest('button')!;
    fireEvent.click(intermediateButton);
    const challengeLinks = screen.getAllByRole('link');
    expect(challengeLinks.length).toBe(23);
  });

  it('should filter to senior challenges when clicked', () => {
    renderChallengesPage();
    const seniorButton = screen.getByText('Senior').closest('button')!;
    fireEvent.click(seniorButton);
    const challengeLinks = screen.getAllByRole('link');
    expect(challengeLinks.length).toBe(20);
  });

  it('should highlight active filter button', () => {
    renderChallengesPage();
    const beginnerButton = screen.getByText('Beginner').closest('button')!;
    fireEvent.click(beginnerButton);
    expect(beginnerButton).toHaveClass('bg-green-600');
  });

  it('should display challenge cards with required info', () => {
    renderChallengesPage();
    const firstChallenge = screen.getAllByRole('link')[0];
    expect(firstChallenge).toHaveTextContent(/~/); // estimated time
  });
});
