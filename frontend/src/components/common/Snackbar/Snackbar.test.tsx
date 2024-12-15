import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Snackbar } from './Snackbar.component';
import { vi } from 'vitest';

describe('Snackbar Component', () => {
  const defaultProps = {
    open: true,
    message: 'Test Message',
  };

  it('renders the message when open', () => {
    render(<Snackbar {...defaultProps} />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<Snackbar {...defaultProps} open={false} />);
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Snackbar {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('renders with default severity when none provided', () => {
    render(<Snackbar {...defaultProps} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('MuiAlert-standardSuccess');
  });

  it('renders with correct positioning', () => {
    render(<Snackbar {...defaultProps} />);
    const snackbar = screen.getByRole('presentation');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopRight');
  });

  it('renders long messages correctly', () => {
    const longMessage = 'This is a very long message that should still be displayed correctly in the snackbar component when it appears on the screen';
    render(<Snackbar {...defaultProps} message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
  
  it('has correct autoHideDuration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Snackbar {...defaultProps} onClose={onClose} />);
    
    vi.advanceTimersByTime(5999);
    expect(onClose).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
});