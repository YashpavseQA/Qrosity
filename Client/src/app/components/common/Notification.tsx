/**
 * Reusable notification component using Snackbar and Alert
 */
import React from 'react';
import { Snackbar, Alert, AlertColor, Typography } from '@mui/material';

interface NotificationProps {
  open: boolean;
  message: string;
  title?: string;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  title,
  severity,
  onClose,
  autoHideDuration = 5000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: '100%' }}
        variant="filled"
        elevation={6}
      >
        {title && (
          <Typography variant="subtitle2" fontWeight="bold">
            {title}
          </Typography>
        )}
        <Typography variant="body2">
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default Notification;
