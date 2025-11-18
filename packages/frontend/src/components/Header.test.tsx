import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it('should render application title', () => {
    renderHeader();
    expect(screen.getByText('Test Automation Hub')).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    renderHeader();
    expect(screen.getByText('Master test automation with hands-on challenges')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderHeader();
    expect(screen.getByText('All Challenges')).toBeInTheDocument();
    expect(screen.getByText('API Docs')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('should have correct link to challenges page', () => {
    renderHeader();
    const challengesLink = screen.getByText('All Challenges').closest('a');
    expect(challengesLink).toHaveAttribute('href', '/challenges');
  });

  it('should have correct link to API docs', () => {
    renderHeader();
    const apiDocsLink = screen.getByText('API Docs').closest('a');
    expect(apiDocsLink).toHaveAttribute('href', '/api-docs');
  });

  it('should have external GitHub link', () => {
    renderHeader();
    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
