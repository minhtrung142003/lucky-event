import { Stack } from '@mui/material';
import React, { ReactNode } from 'react';
import { STYLE } from '../common/constant';
import background from '../assets/images/background.png';

export interface DefaultLayoutProps {
  children?: ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <Stack
      sx={{
        padding: STYLE.PADDING_GAP_LAYOUT,
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{children}</Stack>
    </Stack>
  );
};
