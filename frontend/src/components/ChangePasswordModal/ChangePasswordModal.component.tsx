import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '../common/TextField/TextField.component';
import { Button } from '../common/Button/Button.component';
import { ChangePasswordData, changePasswordSchema } from './ChangePasswordModal.schema';
import { authApi } from '../../config/Api';
import { Snackbar, SnackbarProps } from '../common/Snackbar/Snackbar.component';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: '',
    severity: "success"
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      await authApi.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword
      });
      setSnackbar({
        open: true,
        message: 'Password changed successful!',
        severity: 'success',
      });
      reset();
      onClose();
    } catch (error: any) {
      console.error('Error changing password:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Something went wrong!',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} sx={{ p:4 }}>
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="Old Password"
              type="password"
              {...register('oldPassword')}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="New Password"
              type="password"
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              {...register('confirmNewPassword')}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword?.message}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={onClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Changing...' : 'Change Password'}
              </Button>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </>
  );
};