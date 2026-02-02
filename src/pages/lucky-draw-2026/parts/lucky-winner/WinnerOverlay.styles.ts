import React from 'react';
import { SPECIAL_SEQUENCE } from '../../components/animated-background/Fireworks';
import { LUCKY_DRAW_2026_DESIGN_WIDTH, LUCKY_DRAW_2026_DESIGN_HEIGHT, TRANSITION_TIMING } from '../../lucky-draw-2026.constants';
import { SpecialPhase } from './WinnerOverlay.hooks';

// ============================================================================
// Static Styles
// ============================================================================

export const OVERLAY_BASE_STYLE: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
};

export const LOGO_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 20,
};

export const LOGO_IMG_STYLE: React.CSSProperties = {
  width: 180,
  height: 'auto',
  objectFit: 'contain',
};

// ============================================================================
// Dynamic Style Generators
// ============================================================================

export const getDarkOverlayStyle = (specialPhase: SpecialPhase): React.CSSProperties => ({
  ...OVERLAY_BASE_STYLE,
  zIndex: 899,
  backgroundColor: 'black',
  opacity: (specialPhase === 'darkening' || specialPhase === 'rockets_flying') ? 0.85 : 0,
  transition: specialPhase === 'darkening'
    ? `opacity ${SPECIAL_SEQUENCE.DARK_FADE_IN}ms ease-in`
    : 'opacity 0.3s ease-out',
});

export const getFlashOverlayStyle = (specialPhase: SpecialPhase): React.CSSProperties => ({
  ...OVERLAY_BASE_STYLE,
  zIndex: 901,
  background: 'radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgba(250, 223, 74, 0.77) 40%, rgba(255, 187, 28, 0.6) 70%)',
  opacity: specialPhase === 'flash' ? 1 : 0,
  transition: specialPhase === 'flash'
    ? 'opacity 0.8s ease-in'
    : `opacity ${SPECIAL_SEQUENCE.BRIGHT_REVEAL}ms ease-out`,
});

export const getMainOverlayStyle = (showContent: boolean, isVisible: boolean): React.CSSProperties => ({
  ...OVERLAY_BASE_STYLE,
  zIndex: 900,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  opacity: showContent ? 1 : 0,
  visibility: isVisible ? 'visible' : 'hidden',
  transition: 'opacity 0.5s ease-out',
});

export const getContentContainerStyle = (scale: number): React.CSSProperties => ({
  width: LUCKY_DRAW_2026_DESIGN_WIDTH,
  height: LUCKY_DRAW_2026_DESIGN_HEIGHT,
  transform: `scale(${scale})`,
  transformOrigin: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 10,
});

export const getContentStyle = (showContent: boolean, isSpecialPrize: boolean): React.CSSProperties => {
  const mainDelay = TRANSITION_TIMING.FADE_IN_BG / 1000;
  const easing = 'cubic-bezier(0.25, 1, 0.5, 1)';

  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: showContent ? 1 : 0,
    transform: showContent ? 'scale(1)' : 'scale(0.6)',
    transition: isSpecialPrize
      ? `opacity 0.8s ${easing}, transform 0.8s ${easing}`
      : `opacity 0.6s ${easing} ${mainDelay}s, transform 0.6s ${easing} ${mainDelay}s`,
  };
};

export const getLogoStyle = (showContent: boolean): React.CSSProperties => ({
  ...LOGO_CONTAINER_STYLE,
  opacity: showContent ? 1 : 0,
  transition: 'opacity 0.5s ease-out',
});
