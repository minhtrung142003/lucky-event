import { STYLE } from '../../common/constant';
import { Stack, Typography, useTheme } from '@mui/material';
import React, { Fragment } from 'react';
import { IconElement } from '../elements/icon/icon.element';
import { LinkElement } from '../elements/link/link.element';
import { StackRowAlignCenter } from '../styles/stack.style';

export interface NoteComponentProps {
  content: string;
  contentHref?: string;
  href?: string;
  type?: 'info' | 'recommend' | 'warning' | 'error';
}

export const NoteComponent: React.FC<NoteComponentProps> = ({ content, contentHref, href, type = 'info' }) => {
  const { palette } = useTheme();

  const tempData = {
    info: {
      icon: 'error',
      title: 'Info',
      color: palette.success.dark,
    },
    recommend: {
      icon: 'gpp_maybe',
      title: 'Recommend',
      color: palette.info.dark,
    },
    warning: {
      icon: 'report',
      title: 'Warning',
      color: palette.warning.dark,
    },
    error: {
      icon: 'emergency_home',
      title: 'Error',
      color: palette.error.dark,
    },
  };

  return (
    <Stack
      sx={{
        gap: 1,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
        borderColor: tempData[type].color,
        borderStyle: 'solid',
        borderWidth: '1px 1px 1px 3px',
        padding: 1.5,
      }}
    >
      <StackRowAlignCenter sx={{ gap: STYLE.PADDING_GAP_ITEM_SMALL }}>
        <IconElement icon={tempData[type].icon} sx={{ color: tempData[type].color }} />

        <Typography sx={{ color: tempData[type].color }} variant="body2">
          {tempData[type].title}
        </Typography>
      </StackRowAlignCenter>

      <Typography sx={{ color: tempData[type].color }}>
        {content}
        {href && contentHref && (
          <Fragment>
            &nbsp;
            <LinkElement href={href}>{contentHref}</LinkElement>
          </Fragment>
        )}
      </Typography>
    </Stack>
  );
};
