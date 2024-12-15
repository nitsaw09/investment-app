import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { User, LogOut, Key, DollarSign } from 'lucide-react';
import { ChangePasswordModal } from '../ChangePasswordModal/ChangePasswordModal.component';
import { useNavigate } from 'react-router-dom';
import { MetaMaskWalletButton } from '../MetamaskWalletButton/MetamaskWalletButton.component'; // Adjust the import path as necessary

export const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('networkChainId');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Typography>
          
          <MetaMaskWalletButton /> {/* Add the MetaMask wallet button here */}

          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <User  />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => {
              navigate('/portfolio')
            }}>
              <DollarSign size={18} style={{ marginRight: 8 }} />
              Portfolio
            </MenuItem>
            <MenuItem onClick={() => {
              setIsChangePasswordOpen(true);
              setAnchorEl(null);
            }}>
              <Key size={18} style={{ marginRight: 8 }} />
              Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogOut size={18} style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};