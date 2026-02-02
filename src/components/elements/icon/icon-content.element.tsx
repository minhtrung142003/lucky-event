import { Icon, SxProps, Theme, Typography } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { getLimitLineCss } from '../../../common/utils/other/get-limit-line-css.utils';
import { StackRowAlignCenter } from '../../styles/stack.style';

export interface IconContentElementProps {
  icon?: string;
  content: string | number;
  size?: 'large' | 'small' | 'medium';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | any;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  sx?: SxProps<Theme>;
  sxIcon?: SxProps<Theme>;
  fill?: 0 | 1;
  applyCssOnClick?: boolean;
  id?: string;
}

export const IconContentElement: React.FC<IconContentElementProps> = ({
  icon,
  content,
  size,
  color = 'inherit',
  onClick,
  sx = {},
  sxIcon = {},
  fill = 0,
  applyCssOnClick,
  id,
}) => {
  if (onClick || applyCssOnClick)
    sx = {
      ...sx,
      cursor: 'pointer',
    };

  return (
    <StackRowAlignCenter onClick={onClick} sx={{ gap: STYLE.GAP_ICON_CONTENT_BY_SIZE[size || 'medium'], ...sx }} id={id}>
      {icon && (
        <Icon
          color={color}
          sx={{
            fontVariationSettings: `'FILL' ${fill}, 'wght' 100, 'GRAD' 200, 'opsz' 24`,
            fontSize: STYLE.FONT_SIZE_ICON[size || 'medium'],
            ...sxIcon,
          }}
          component={'span'}
          className="material-symbols-rounded"
        >
          {icon}
        </Icon>
      )}
      <Typography color={color} variant={size ? STYLE.VARIANT_BY_SIZE[size] : 'body1'} sx={{ ...getLimitLineCss(1) }}>
        {content}
      </Typography>
    </StackRowAlignCenter>
  );
};
