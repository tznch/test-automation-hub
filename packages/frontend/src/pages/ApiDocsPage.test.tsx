import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ApiDocsPage from './ApiDocsPage';

describe('ApiDocsPage', () => {
  const renderApiDocsPage = () => {
    return render(
      <BrowserRouter>
        <ApiDocsPage />
      </BrowserRouter>
    );
  };

  it('should render page title', () => {
    renderApiDocsPage();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
  });

  it('should display base URL', () => {
    renderApiDocsPage();
    expect(screen.getByText('http://localhost:3000')).toBeInTheDocument();
  });

  it('should render all API categories', () => {
    renderApiDocsPage();
    expect(screen.getByText(/Authentication/)).toBeInTheDocument();
    expect(screen.getByText(/Items/)).toBeInTheDocument();
    expect(screen.getByText(/Users/)).toBeInTheDocument();
    expect(screen.getByText(/Orders/)).toBeInTheDocument();
    expect(screen.getByText(/Files/)).toBeInTheDocument();
    expect(screen.getByText(/Feature Flags/)).toBeInTheDocument();
  });

  it('should display Authentication endpoints by default', () => {
    renderApiDocsPage();
    expect(screen.getByText('/api/auth/login')).toBeInTheDocument();
    expect(screen.getByText('/api/auth/register')).toBeInTheDocument();
    expect(screen.getByText('/api/auth/me')).toBeInTheDocument();
  });

  it('should display HTTP methods with color coding', () => {
    renderApiDocsPage();
    const getMethods = screen.getAllByText('GET');
    const postMethods = screen.getAllByText('POST');
    expect(getMethods.length).toBeGreaterThan(0);
    expect(postMethods.length).toBeGreaterThan(0);
  });

  it('should have back to home link', () => {
    renderApiDocsPage();
    const backLink = screen.getByText('← Back to Home').closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });
});
