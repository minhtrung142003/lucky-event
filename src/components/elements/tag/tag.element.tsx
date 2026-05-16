import { Typography, useTheme } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { OPACITY } from '../../../common/constant/opacity.constant';
import { getLimitLineCss } from '../../../common/utils/other/get-limit-line-css.utils';

export interface TagElementProps {
  type: 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'primary';
  content: string;
  width?: number;
}

export const TagElement: React.FC<TagElementProps> = ({ type, content, width }) => {
  const { palette } = useTheme();

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return palette.success.main;
      case 'error':
        return palette.error.main;
      case 'warning':
        return palette.warning.main;
      case 'info':
        return palette.info.main;
      case 'secondary':
        return palette.secondary.main;
      case 'primary':
      default:
        return palette.primary.main;
    }
  };

  const typeColor = getTypeColor();

  return (
    <Typography
      variant="caption"
      sx={{
        padding: `calc(${STYLE.PADDING_GAP_ITEM_SMALL} - 4px) ${STYLE.PADDING_GAP_ITEM_SMALL}`,
        backgroundColor: `${typeColor}15`,
        backdropFilter: 'blur(8px)',
        border: `1.5px solid ${typeColor}60`,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT_TAG,
        color: typeColor,
        width,
        textAlign: 'center',
        boxShadow: `0 0 12px ${typeColor}25, inset 0 0 8px ${typeColor}10`,
        fontWeight: 600,
        transition: 'all 0.3s ease',
        ...getLimitLineCss(1),
        '&:hover': {
          backgroundColor: `${typeColor}25`,
          boxShadow: `0 0 20px ${typeColor}40, inset 0 0 12px ${typeColor}15`,
        },
      }}
    >
      {content}
    </Typography>
  );
};
