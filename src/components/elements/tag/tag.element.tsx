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

  return (
    <Typography
      variant="caption"
      sx={{
        padding: `calc(${STYLE.PADDING_GAP_ITEM_SMALL} - 4px) ${STYLE.PADDING_GAP_ITEM_SMALL}`,
        backgroundColor: `${palette[type].dark}${OPACITY[10]}`,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT_TAG,
        color: palette[type].main,
        width,
        textAlign: 'center',
        ...getLimitLineCss(1),
      }}
    >
      {content}
    </Typography>
  );
};
