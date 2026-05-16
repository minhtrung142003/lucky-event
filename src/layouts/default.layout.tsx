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
        backgroundAttachment: 'fixed',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.05) 0%, rgba(192, 0, 255, 0.03) 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Stack sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>{children}</Stack>
    </Stack>
  );
};
