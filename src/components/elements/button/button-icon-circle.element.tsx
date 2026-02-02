import { ButtonProps, IconButton, useTheme } from '@mui/material';
import React from 'react';
import { IconElement } from '../icon/icon.element';
import { OPACITY } from '../../../common/constant/opacity.constant';

export interface ButtonIconCircleElementProps extends ButtonProps {
  icon: string;
}

export const ButtonIconCircleElement: React.FC<ButtonIconCircleElementProps> = ({ icon, color, size = 'medium', sx, ...rest }) => {
  const { palette } = useTheme();

  if (!color) sx = { color: palette.text.primary, ...sx };

  return (
    <IconButton
      {...rest}
      sx={{
        ...sx,
        backgroundColor: palette.divider + OPACITY[50],
        '&:hover': {
          backgroundColor: palette.divider + OPACITY[80],
        },
      }}
    >
      <IconElement icon={icon} size={size} />
    </IconButton>
  );
};
