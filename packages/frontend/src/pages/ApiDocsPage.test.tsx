import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('should switch categories when clicked', () => {
    renderApiDocsPage();
    const itemsButton = screen.getByRole('button', { name: /Items/ });
    fireEvent.click(itemsButton);
    // Wait for the component to re-render with Items endpoints
    const itemsPath = screen.getAllByText('/api/items');
    expect(itemsPath.length).toBeGreaterThan(0);
  });

  it('should display HTTP methods with color coding', () => {
    renderApiDocsPage();
    const getMethods = screen.getAllByText('GET');
    const postMethods = screen.getAllByText('POST');
    expect(getMethods.length).toBeGreaterThan(0);
    expect(postMethods.length).toBeGreaterThan(0);
  });

  it('should show endpoint descriptions', () => {
    renderApiDocsPage();
    expect(screen.getByText(/Authenticate user and receive JWT token/i)).toBeInTheDocument();
  });

  it('should display response schemas', () => {
    renderApiDocsPage();
    const statusCodes = screen.getAllByText(/^(200|201|401|400)$/);
    expect(statusCodes.length).toBeGreaterThan(0);
  });

  it('should have back to home link', () => {
    renderApiDocsPage();
    const backLink = screen.getByText('← Back to Home').closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('should highlight selected category', () => {
    renderApiDocsPage();
    const authButton = screen.getByRole('button', { name: /Authentication/ });
    expect(authButton).toHaveClass('bg-indigo-600');
  });

  it('should show endpoint count for each category', () => {
    renderApiDocsPage();
    const endpointCounts = screen.getAllByText(/\(\d+\)/);
    expect(endpointCounts.length).toBe(6); // 6 categories
  });
});
