import React, { useEffect, useState } from 'react';
import flowerLeftSrc from '../../../../assets/images/figma/flower-left.png';
import flowerRightSrc from '../../../../assets/images/figma/flower-right.png';

// CSS Keyframes for breathing/scale animation
const flowerKeyframes = `
  @keyframes flowerBreathLeft {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(0, 0, 0) scale(1.05); }
  }
  
  @keyframes flowerBreathRight {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(0, 0, 0) scale(1.05); }
  }
`;

interface FlowerFrameProps {
  isVisible?: boolean;
  zIndex?: number;
  duration?: number;
}

export const FlowerFrame: React.FC<FlowerFrameProps> = ({
  isVisible = true,
  zIndex = 100,
  duration = 0.8,
}) => {
  const [mounted, setMounted] = useState(false);

  // Check for reduced motion preference
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Trigger animation on mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const showState = isVisible && mounted;
  const transitionDuration = reduceMotion ? 0 : duration;

  // GPU-optimized styles
  const gpuLayerStyles: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    perspective: 1000,
  };

  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{flowerKeyframes}</style>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex, pointerEvents: 'none' }}>
        {/* Left Flower - slides in from left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: 'auto',
            zIndex,
            pointerEvents: 'none',
            transform: showState
              ? 'translate3d(0, 0, 0)'
              : 'translate3d(-100%, 0, 0)',
            transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1)`,
            ...gpuLayerStyles,
          }}
        >
          <img
            src={flowerLeftSrc}
            alt=""
            style={{
              height: '100%',
              width: 'auto',
              display: 'block',
              animation: showState && !reduceMotion ? 'flowerBreathLeft 11s ease-in-out infinite' : 'none',
              transformOrigin: 'left center',
              ...gpuLayerStyles,
            }}
          />
        </div>

        {/* Right Flower - slides in from right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: 'auto',
            zIndex,
            pointerEvents: 'none',
            transform: showState
              ? 'translate3d(0, 0, 0)'
              : 'translate3d(100%, 0, 0)',
            transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1)`,
            ...gpuLayerStyles,
          }}
        >
          <img
            src={flowerRightSrc}
            alt=""
            style={{
              height: '100%',
              width: 'auto',
              display: 'block',
              animation: showState && !reduceMotion ? 'flowerBreathRight 12s ease-in-out infinite' : 'none',
              transformOrigin: 'right center',
              ...gpuLayerStyles,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default FlowerFrame;
