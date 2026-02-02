import { Typography, TypographyProps, useTheme } from '@mui/material';
import React from 'react';

export interface TypographyGoldComponentProps extends TypographyProps {
  content: any;
}

export const TypographyGoldComponent: React.FC<TypographyGoldComponentProps> = ({ content, sx, ...rest }) => {
  const { palette } = useTheme();

  return (
    <Typography
      {...rest}
      sx={{
        textAlign: 'center',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        letterSpacing: '1px',
        WebkitTextStroke: '5px transparent',
        position: 'relative',
        display: 'inline-block',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'repeating-linear-gradient(105deg, #ffb338 0%, #3e2904 5%, #ffb338 12%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          filter: 'drop-shadow(5px 15px 15px black)',
          transform: 'scaleY(1.05)',
          transformOrigin: 'top',
          zIndex: 1,
        },
        '&::after': {
          content: `"${content}"`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'repeating-linear-gradient(5deg, #ffb338 0%, #77571d 23%, #ffb338 31%)',
          WebkitBackgroundClip: 'text',
          color: palette.text.primary,
          zIndex: 2,
        },
        ...sx,
      }}
    >
      {content}
    </Typography>
  );
};
