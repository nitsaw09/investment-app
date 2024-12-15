import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm.component';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock the zod resolver to simulate actual validation
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => (data: any) => {
    const errors: any = {};
    
    if (!data.email) {
      errors.email = { message: 'Email is required' };
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      errors.email = { message: 'Invalid email format' };
    }

    if (!data.password) {
      errors.password = { message: 'Password is required' };
    } else if (data.password.length < 6) {
      errors.password = { message: 'Password must be at least 6 characters' };
    }

    return {
      values: {},
      errors: Object.keys(errors).length ? errors : {},
    };
  },
}));

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders login form fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab(); // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(passwordInput, '12345');
    await userEvent.tab(); // Trigger blur event

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('disables form fields and shows loading state while submitting', async () => {
    const mockSlowSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<LoginForm onSubmit={mockSlowSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSlowSubmit).toHaveBeenCalledTimes(1);
    });
  });
});