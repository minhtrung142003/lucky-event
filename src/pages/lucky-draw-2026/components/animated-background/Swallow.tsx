import React, { useEffect, useState } from 'react';
import swallowSrc from '../../../../assets/images/figma/swallow.png';

// CSS Keyframes for swallow floating animation
const swallowKeyframes = `
  @keyframes swallowFloat {
    0%, 100% { transform: translate3d(0, 0, 0); }
    25% { transform: translate3d(50px, -28px, 0); }
    50% { transform: translate3d(0, 0, 0); }
    75% { transform: translate3d(25px, -14px, 0); }
  }
`;

interface SwallowProps {
  isVisible?: boolean;
  zIndex?: number;
  duration?: number;
}

export const Swallow: React.FC<SwallowProps> = ({
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
      <style>{swallowKeyframes}</style>
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex,
          pointerEvents: 'none',
          transform: showState
            ? 'translate3d(0, 0, 0)'
            : 'translate3d(-20%, 20%, 0)',
          opacity: showState ? 1 : 0,
          transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${transitionDuration}s ease-out`,
          ...gpuLayerStyles,
        }}
      >
        <div
          style={{
            animation: showState && !reduceMotion ? 'swallowFloat 15s ease-in-out infinite' : 'none',
            ...gpuLayerStyles,
          }}
        >
          <img
            src={swallowSrc}
            alt="swallows"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Swallow;
