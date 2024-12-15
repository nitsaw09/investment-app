import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangePasswordModal } from './ChangePasswordModal.component';
import { authApi } from '../../config/Api';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock the API and external dependencies
vi.mock('../../config/Api', () => ({
  authApi: {
    changePassword: vi.fn(),
  },
}));

// Mock the zod resolver to avoid actual validation
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({
    values: {},
    errors: {},
  }),
}));

describe('ChangePasswordModal', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when open is true', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Change Password' })).toBeInTheDocument();
    expect(screen.getByLabelText('Old Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  it('does not render the modal when open is false', () => {
    render(<ChangePasswordModal {...defaultProps} open={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('submits the form with correct values', async () => {
    const mockChangePassword = vi.fn().mockResolvedValue({});
    vi.mocked(authApi.changePassword).mockImplementation(mockChangePassword);

    render(<ChangePasswordModal {...defaultProps} />);

    const oldPasswordInput = screen.getByLabelText('Old Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmNewPasswordInput = screen.getByLabelText('Confirm New Password')

    await userEvent.type(oldPasswordInput, 'oldPass123');
    await userEvent.type(newPasswordInput, 'newPass123');
    await userEvent.type(confirmNewPasswordInput, 'newPass123');

    const submitButton = screen.getByRole('button', { name: /change password/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledTimes(1);
    });
  });

  it('shows success message and closes modal on successful password change', async () => {
    const mockChangePassword = vi.fn().mockResolvedValue({});
    vi.mocked(authApi.changePassword).mockImplementation(mockChangePassword);

    render(<ChangePasswordModal {...defaultProps} />);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /change password/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password changed successful!')).toBeInTheDocument();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shows error message when password change fails', async () => {
    const errorMessage = 'Invalid old password';
    const mockChangePassword = vi.fn().mockRejectedValue({
      response: { data: { message: errorMessage } },
    });
    vi.mocked(authApi.changePassword).mockImplementation(mockChangePassword);

    render(<ChangePasswordModal {...defaultProps} />);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /change password/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('shows generic error message when API error has no specific message', async () => {
    const mockChangePassword = vi.fn().mockRejectedValue({});
    vi.mocked(authApi.changePassword).mockImplementation(mockChangePassword);

    render(<ChangePasswordModal {...defaultProps} />);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /change password/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const mockChangePassword = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    vi.mocked(authApi.changePassword).mockImplementation(mockChangePassword);

    render(<ChangePasswordModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /change password/i });
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /changing/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });
  });

  it('resets form on successful submission', async () => {
    const mockChangePassword = vi.fn().mockResolvedValue({});
    vi.mocked(authApi.changePassword).mockImplementation(mockChangePassword);

    render(<ChangePasswordModal {...defaultProps} />);

    // Fill in the form
    const oldPasswordInput = screen.getByLabelText('Old Password');
    await userEvent.type(oldPasswordInput, 'oldPass123');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /change password/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(oldPasswordInput).toHaveValue('');
    });
  });
});