import { z } from 'zod';

export const changePasswordSchema = z.object({
  oldPassword: z.string()
    .min(1, 'Old password is required')
    .min(6, 'Password must be at least 6 characters'),
  newPassword: z.string()
    .min(1, 'New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: z.string()
    .min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;