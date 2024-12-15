import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header.component';
import { vi } from 'vitest';
import type { Mock } from 'vitest';

const mockNavigate: Mock = vi.fn();

// Mock react-router-dom with proper exports
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Material UI components
vi.mock('@mui/material', () => ({
  AppBar: ({ children }: { children: React.ReactNode }) => <div role="banner">{children}</div>,
  Toolbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  IconButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  Menu: ({ children, open, onClose }: { children: React.ReactNode; open: boolean; onClose?: () => void }) => (
    open ? <div role="menu" onClick={onClose}>{children}</div> : null
  ),
  MenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div role="menuitem" onClick={onClick}>{children}</div>
  ),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  User: () => <span>UserIcon</span>,
  LogOut: () => <span>LogOutIcon</span>,
  Key: () => <span>KeyIcon</span>,
  DollarSign: () => <span>DollarSign</span>,
}));

// Mock ChangePasswordModal
vi.mock('../ChangePasswordModal/ChangePasswordModal.component', () => ({
  ChangePasswordModal: ({ open, onClose }: { open: boolean; onClose: () => void }) => 
    open ? <div data-testid="change-password-modal" onClick={onClose}>Change Password Modal</div> : null,
}));

// Mock MetaMaskWalletButton
vi.mock('../MetamaskWalletButton/MetamaskWalletButton.component', () => ({
  MetaMaskWalletButton: () => <div data-testid="metamask-button">Connect Metamask</div>,
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderHeader = () => {
    return render(<Header />);
  };

  it('renders the header with title', () => {
    renderHeader();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows metamask wallet button', () => {
    renderHeader();
    expect(screen.getByTestId('metamask-button')).toBeInTheDocument();
  });

  it('opens user menu when clicking user icon', async () => {
    renderHeader();
    
    const userButton = screen.getByText('UserIcon').closest('button');
    expect(userButton).toBeInTheDocument();
    fireEvent.click(userButton!);
    
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('handles logout correctly', async () => {
    // Setup initial localStorage state
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('walletAddress', 'test-wallet');
    localStorage.setItem('networkChainId', 'test-chain');
    
    renderHeader();
    
    const userButton = screen.getByText('UserIcon').closest('button');
    fireEvent.click(userButton!);
    
    const logoutButton = screen.getByText('Logout').closest('[role="menuitem"]');
    fireEvent.click(logoutButton!);
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('walletAddress')).toBeNull();
    expect(localStorage.getItem('networkChainId')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('opens and closes change password modal', async () => {
    renderHeader();
    const userButton = screen.getByText('UserIcon').closest('button');
    fireEvent.click(userButton!);
    
    const changePasswordOption = screen.getByText('Change Password').closest('[role="menuitem"]');
    fireEvent.click(changePasswordOption!);
    
    await waitFor(() => {
      expect(screen.getByTestId('change-password-modal')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId('change-password-modal'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('change-password-modal')).not.toBeInTheDocument();
    });
  });

  it('navigates to portfolio when clicking portfolio option', async () => {
    renderHeader();
    
    const userButton = screen.getByText('UserIcon').closest('button');
    fireEvent.click(userButton!);
    
    const portfolioOption = screen.getByText('Portfolio').closest('[role="menuitem"]');
    fireEvent.click(portfolioOption!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/portfolio');
  });
});