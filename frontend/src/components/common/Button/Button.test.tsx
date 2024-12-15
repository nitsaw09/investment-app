import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './Button.component';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('custom-class');
  });
});