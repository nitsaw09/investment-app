import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return (
      <MuiTextField
        ref={ref}
        variant="outlined"
        fullWidth
        margin="normal"
        {...props}
      />
    );
  }
);