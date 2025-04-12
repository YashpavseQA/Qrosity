import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string;
  changeValue?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  sx?: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  changeValue, 
  changeDirection = 'neutral',
  sx = {}
}) => {
  // Determine color based on direction
  const getChangeColor = () => {
    switch (changeDirection) {
      case 'up':
        return 'success.main';
      case 'down':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  // Determine arrow symbol based on direction
  const getChangeSymbol = () => {
    switch (changeDirection) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '';
    }
  };

  // Determine background color based on direction
  const getChipColor = () => {
    switch (changeDirection) {
      case 'up':
        return { bgcolor: 'rgba(84, 214, 44, 0.16)', color: 'success.main' };
      case 'down':
        return { bgcolor: 'rgba(255, 72, 66, 0.16)', color: 'error.main' };
      default:
        return { bgcolor: 'rgba(145, 158, 171, 0.16)', color: 'text.secondary' };
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        height: '100%',
        ...sx
      }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        {changeValue && (
          <Chip
            size="small"
            label={`${getChangeSymbol()} ${changeValue}`}
            sx={{
              ...getChipColor(),
              height: '24px',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              borderRadius: '10px'
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default StatsCard;
