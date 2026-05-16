import { Box, useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { runConfetti } from '../../common/utils/confetti.utils';

export interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ active, duration = 7000 }) => {
  const { palette } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (!active || !canvasRef.current) return;

    cleanupRef.current = runConfetti(canvasRef.current, {
      duration,
      colors: [palette.primary.main, palette.secondary.main, '#ffb338', '#ff6b9d', '#f1ee99', '#ffffff'],
    });

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [active, duration, palette.primary.main, palette.secondary.main]);

  if (!active) return null;

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
