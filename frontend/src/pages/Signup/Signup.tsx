import React, { useState } from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from '../../components/SignupForm/SignupForm.component';
import { Card } from '../../components/common/Card/Card.component';
import { Snackbar, SnackbarProps } from '../../components/common/Snackbar/Snackbar.component';
import { SignupFormData } from '../../components/SignupForm/SignupForm.type';
import { authApi } from '../../config/Api';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSignup = async (data: SignupFormData) => {
    try {
      const response = await authApi.signup(data);
      localStorage.setItem('token', response.token);
      setSnackbar({
        open: true,
        message: 'Account created successfully!',
        severity: 'success',
      });
      //setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Signup failed',
        severity: 'error',
      });
    }
  };

  return (
    <Container component="main" maxWidth={false} disableGutters className="min-h-screen">
      <Box className="min-h-screen flex items-center justify-center p-4">
        <Card title="Create Account" maxWidth={400}>
          <SignupForm onSubmit={handleSignup} />
          <Typography align="center" variant="body2">
            Already have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ textDecoration: 'none' }}
            >
              Sign In
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