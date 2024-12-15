import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '../../components/common/TextField/TextField.component';
import { Button } from '../../components/common/Button/Button.component';
import { Box, Typography } from '@mui/material';
import { SignupFormData, signupSchema } from './SignupForm.schema';

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void;
}

const getPasswordStrength = (password: string): { label: string; color: string } => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 10;

  const strength =
    isLongEnough && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
      ? 'Strong'
      : (isLongEnough && (hasUppercase || hasLowercase) && (hasNumber || hasSpecialChar))
      ? 'Medium'
      : 'Weak';

  const color = strength === 'Strong' ? 'green' : strength === 'Medium' ? 'orange' : 'red';
  return { label: strength, color };
};

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');
  const passwordStrength = getPasswordStrength(password);

  const handleFormSubmit = (data: SignupFormData) => {
    onSubmit(data);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(handleFormSubmit)} 
      noValidate
    >
      <TextField
        label="Full Name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isSubmitting}
      />
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
      {password && (
        <Typography
          sx={{ float: "inline-end" }}
          color={passwordStrength.color}
          variant="body2"
        >
          Strength: {passwordStrength.label}
        </Typography>
      )}
      <TextField
        label="Confirm Password"
        type="password"
        {...register('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </Button>
    </Box>
  );
};