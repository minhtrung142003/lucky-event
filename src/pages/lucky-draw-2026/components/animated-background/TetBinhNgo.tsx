import React, { useEffect, useState } from 'react';
import tetBinhNgoSrc from '../../../../assets/images/figma/tet-binh-ngo.png';

interface TetBinhNgoProps {
  isVisible?: boolean;
  zIndex?: number;
  width?: string;
  maxWidth?: string;
  duration?: number;
}

export const TetBinhNgo: React.FC<TetBinhNgoProps> = ({
  isVisible = true,
  zIndex = 4,
  width = '20%',
  maxWidth = '500px',
  duration = 1.5,
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
    // Small delay to ensure CSS transition works
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
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex,
        pointerEvents: 'none',
        width,
        maxWidth,
        transform: showState
          ? 'translate3d(0, 0, 0) scale(1)'
          : 'translate3d(0, 0, 0) scale(0.8)',
        opacity: showState ? 1 : 0,
        transition: `transform ${transitionDuration}s ease-out, opacity ${transitionDuration}s ease-out`,
        ...gpuLayerStyles,
      }}
    >
      <img
        src={tetBinhNgoSrc}
        alt=""
        style={{
          width: '70%',
          display: 'block',
          ...gpuLayerStyles,
        }}
      />
    </div>
  );
};

export default TetBinhNgo;
