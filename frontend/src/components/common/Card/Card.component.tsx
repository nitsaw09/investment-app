import React from 'react';
import { Card as MuiCard, CardContent, Typography } from '@mui/material';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  maxWidth?: number
}

export const Card: React.FC<CardProps> = ({ title, children, maxWidth }) => {
  return (
    <MuiCard sx={{ maxWidth, width: '100%', boxShadow: 3, marginBottom: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </MuiCard>
  );
};