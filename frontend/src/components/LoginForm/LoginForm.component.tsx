import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '../../components/common/TextField/TextField.component';
import { Button } from '../../components/common/Button/Button.component';
import { Box } from '@mui/material';
import { LoginFormData, loginSchema } from './LoginForm.schema';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Email Address"
        type="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isSubmitting}
      />
      <TextField
        label="Password"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </Box>
  );
};