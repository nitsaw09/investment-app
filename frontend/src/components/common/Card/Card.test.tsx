import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from './Card.component';

describe('Card Component', () => {
  it('renders the title correctly', () => {
    render(
      <Card title="Test Title">
        <div>Test Content</div>
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Card title="Test Title">
        <div>Test Child Content</div>
      </Card>
    );
    
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('applies custom maxWidth when provided', () => {
    const { container } = render(
      <Card title="Test Title" maxWidth={500}>
        <div>Content</div>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ maxWidth: '500px' });
  });

  it('renders without maxWidth when not provided', () => {
    const { container } = render(
      <Card title="Test Title">
        <div>Content</div>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveStyle({ maxWidth: expect.any(String) });
  });

  it('maintains full width styling', () => {
    const { container } = render(
      <Card title="Test Title">
        <div>Content</div>
      </Card>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ width: '100%' });
  });

  it('renders title as h1 with correct typography variant', () => {
    render(
      <Card title="Test Title">
        <div>Content</div>
      </Card>
    );
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
  });

  it('renders multiple children correctly', () => {
    render(
      <Card title="Test Title">
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </Card>
    );
    
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });
});