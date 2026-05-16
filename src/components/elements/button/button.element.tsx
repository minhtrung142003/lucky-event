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

  const baseStyles = {
    fontWeight: 500,
    minWidth: 120,
    borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
    textTransform: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
  };

  const getSx = () => {
    let styles: any = baseStyles;

    if (variant === 'contained') {
      styles = {
        ...baseStyles,
        background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.secondary.main} 100%)`,
        boxShadow: `0 0 20px ${palette.primary.main}40, 0 0 40px ${palette.secondary.main}20`,
        border: 'none',
        color: palette.primary.contrastText,
        '&:hover': {
          boxShadow: `0 0 30px ${palette.primary.main}60, 0 0 60px ${palette.secondary.main}30, inset 0 0 20px ${palette.primary.main}20`,
          transform: 'translateY(-2px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      };
    } else if (variant === 'outlined') {
      styles = {
        ...baseStyles,
        border: `2px solid ${palette.primary.main}`,
        color: palette.primary.main,
        backgroundColor: `${palette.background.paper}80`,
        backdropFilter: 'blur(10px)',
        boxShadow: `inset 0 0 15px ${palette.primary.main}15, 0 0 15px ${palette.primary.main}25`,
        '&:hover': {
          backgroundColor: `${palette.primary.main}15`,
          boxShadow: `inset 0 0 20px ${palette.primary.main}25, 0 0 25px ${palette.primary.main}40`,
          transform: 'translateY(-2px)',
        },
      };
    }

    return sx ? { ...styles, ...sx } : styles;
  };

  return (
    <Button
      {...rest}
      variant={variant}
      startIcon={startIcon && <IconElement icon={startIcon} sx={{ cursor: 'pointer' }} />}
      endIcon={endIcon && <IconElement icon={endIcon} sx={{ cursor: 'pointer' }} />}
      sx={getSx()}
    >
      {loading ? <LoadingComponent color={palette.primary.contrastText} size="small" sx={{ minHeight: '24.5px' }} /> : content}
    </Button>
  );
};
