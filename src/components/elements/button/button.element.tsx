import { Button, ButtonProps, useTheme } from '@mui/material';
import { STYLE } from '../../../common/constant';
import React from 'react';
import { LoadingComponent } from '../../loading/loading.component';
import { IconElement } from '../icon/icon.element';

export interface ButtonElementProps extends ButtonProps {
  content?: string;
  loading?: boolean;
  startIcon?: string;
  endIcon?: string;
}

export const ButtonElement: React.FC<ButtonElementProps> = ({ content, loading = false, startIcon, endIcon, variant = 'contained', sx, ...rest }) => {
  const { palette } = useTheme();

  return (
    <Button
      {...rest}
      variant={variant}
      startIcon={startIcon && <IconElement icon={startIcon} sx={{ cursor: 'pointer' }} />}
      endIcon={endIcon && <IconElement icon={endIcon} sx={{ cursor: 'pointer' }} />}
      sx={{
        fontWeight: 500,
        minWidth: 120,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        textTransform: 'none',
        ...sx,
      }}
    >
      {loading ? <LoadingComponent color={palette.primary.contrastText} size="small" sx={{ minHeight: '24.5px' }} /> : content}
    </Button>
  );
};
