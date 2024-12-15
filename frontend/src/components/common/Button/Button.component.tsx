import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <MuiButton
      variant="contained"
      fullWidth
      sx={{
        mt: 2,
        mb: 2,
        py: 1.5,
        textTransform: 'none',
        fontSize: '1rem',
      }}
      {...props}
    />
  );
};