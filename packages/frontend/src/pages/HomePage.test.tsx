import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  it('should render main heading', () => {
    renderHomePage();
    expect(screen.getByText('Master Test Automation')).toBeInTheDocument();
  });

  it('should display correct total challenges count', () => {
    renderHomePage();
    expect(screen.getByText(/63 hands-on challenges/i)).toBeInTheDocument();
  });

  it('should render Start Learning button', () => {
    renderHomePage();
    const button = screen.getByText('Start Learning');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute('href', '/challenges');
  });

  it('should render GitHub link', () => {
    renderHomePage();
    const githubLink = screen.getByText('View on GitHub').closest('a');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('should display all three feature cards', () => {
    renderHomePage();
    expect(screen.getByText('63 Challenges')).toBeInTheDocument();
    expect(screen.getByText('Real Applications')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
  });

  it('should display correct difficulty level counts', () => {
    renderHomePage();
    const challengeCounts = screen.getAllByText(/\d+ challenges/);
    expect(challengeCounts.length).toBeGreaterThanOrEqual(3);
    // Just verify the counts exist, don't try to get specific ones (duplicates exist)
    const allText = challengeCounts.map((el) => el.textContent).join(' ');
    expect(allText).toContain('20 challenges');
    expect(allText).toContain('23 challenges');
  });

  it('should display learning path section', () => {
    renderHomePage();
    expect(screen.getByText('Learning Path')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Senior')).toBeInTheDocument();
  });

  it('should have link to API docs', () => {
    renderHomePage();
    const apiDocsLink = screen.getByText('View API Docs →').closest('a');
    expect(apiDocsLink).toHaveAttribute('href', '/api-docs');
  });
});
