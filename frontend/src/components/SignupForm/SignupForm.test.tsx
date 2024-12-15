import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SignupForm } from './SignupForm.component';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('SignupForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders signup form fields', () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates name length', async () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, 'a');
    await userEvent.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates password match', async () => {
    render(<SignupForm onSubmit={mockOnSubmit} />);
    
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    await userEvent.type(passwordInput, 'Password123!');
    await userEvent.type(confirmPasswordInput, 'Password456!');
    await userEvent.tab();
    
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const expectedData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };

    render(<SignupForm onSubmit={mockOnSubmit} />);

    await userEvent.type(screen.getByLabelText(/full name/i), expectedData.name);
    await userEvent.type(screen.getByLabelText(/email address/i), expectedData.email);
    await userEvent.type(screen.getByLabelText(/^password/i), expectedData.password);
    await userEvent.type(screen.getByLabelText(/confirm password/i), expectedData.confirmPassword);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expectedData);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});