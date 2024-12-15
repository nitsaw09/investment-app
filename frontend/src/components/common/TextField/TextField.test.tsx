import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextField } from './TextField.component';
import { describe, it, expect } from 'vitest';

describe('TextField', () => {
  it('renders with label', () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<TextField placeholder="Enter email" />);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });
});