import { Box, Button, Container, Stack, Typography, styled } from '@mui/material';
import React, { ReactNode, useCallback } from 'react';

export interface ControlLayoutProps {
  children?: ReactNode;
}

// Dark, premium gradient background
const LayoutRoot = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`, // Slate 900 to Slate 800
  color: '#f8fafc', // Slate 50
  position: 'relative',
  overflowX: 'hidden',
  // Optional: subtle mesh gradient or noise could go here
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 25%), radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.08) 0%, transparent 25%)`,
    pointerEvents: 'none',
  },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  paddingBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}));

const OpenShowButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
  color: '#fff',
  fontWeight: 700,
  padding: '10px 24px',
  borderRadius: 12,
  textTransform: 'none',
  fontSize: '0.95rem',
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669, #0891b2)',
    transform: 'scale(1.02)',
  },
}));

export const ControlLayout: React.FC<ControlLayoutProps> = ({ children }) => {
  const handleOpenShowPage = useCallback(() => {
    // Mở ShowPage2026 trong tab mới
    window.open('/lucky-draw-2026', '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <LayoutRoot>
      <StyledContainer maxWidth="xl">
        <Header>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', width: 'fit-content' }}>
              SEVAGO YEP Lucky Event 2026
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
              Designer by Sevatech
            </Typography>
          </Box>
          <OpenShowButton
            onClick={handleOpenShowPage}
            startIcon={<span style={{ fontSize: '1.2rem' }}>🎬</span>}
          >
            Mở Show Page
          </OpenShowButton>
        </Header>
        {children}
      </StyledContainer>
    </LayoutRoot>
  );
};

