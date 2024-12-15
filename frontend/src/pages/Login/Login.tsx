import React, { useState } from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/LoginForm/LoginForm.component';
import { Card } from '../../components/common/Card/Card.component';
import { Snackbar, SnackbarProps } from '../../components/common/Snackbar/Snackbar.component';
import { LoginFormData } from '../../components/LoginForm/LoginForm.type';
import { authApi } from '../../config/Api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    severity: "success"
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data);
      localStorage.setItem('token', response.token);
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Login failed',
        severity: 'error',
      });
    }
  };

  return (
    <Container component="main" maxWidth={false} disableGutters className="min-h-screen">
      <Box className="min-h-screen flex items-center justify-center p-4">
        <Card title="Sign In" maxWidth={400}>
          <LoginForm onSubmit={handleLogin} />
          <Typography align="center" variant="body2">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/signup')}
              sx={{ textDecoration: 'none' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Card>
      </Box>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Container>
  );
};