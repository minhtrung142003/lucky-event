import React, { useEffect, useState, useId } from 'react';
import rightCloudDefault from '../../../../assets/images/figma/rightCloud.png';
import leftCloudDefault from '../../../../assets/images/figma/leftCloud.png';
import middleCloudDefault from '../../../../assets/images/figma/middleCloud.png';

interface CloudsProps {
  leftSrc?: string;
  rightSrc?: string;
  middleSrc?: string;
  isVisible?: boolean;
  opacity?: number;
  scale?: number;
  zIndex?: number;
  width?: string | number;
  height?: string | number;
  travel?: number | string;
  duration?: number;
  delay?: number;
}

// CSS Keyframes for floating animations - using pure CSS for better GPU performance
const cloudKeyframes = `
  @keyframes floatLeft {
    0%, 100% { transform: translate3d(0, 0, 0); }
    25% { transform: translate3d(0, -10px, 0); }
    50% { transform: translate3d(0, 0, 0); }
    75% { transform: translate3d(0, -7px, 0); }
  }
  
  @keyframes floatRight {
    0%, 100% { transform: translate3d(0, 0, 0); }
    25% { transform: translate3d(0, -10px, 0); }
    50% { transform: translate3d(0, 0, 0); }
    75% { transform: translate3d(0, -8px, 0); }
  }
  
  @keyframes floatMiddle {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    25% { transform: translate3d(0, 8px, 0) scale(1.03); }
    50% { transform: translate3d(0, 0, 0) scale(1); }
    75% { transform: translate3d(0, 5px, 0) scale(1.02); }
  }
`;

export const Clouds: React.FC<CloudsProps> = ({
  leftSrc = leftCloudDefault,
  rightSrc = rightCloudDefault,
  middleSrc = middleCloudDefault,
  isVisible = true,
  opacity = 1,
  scale = 1,
  zIndex = 2,
  width = '100%',
  height = '100%',
  travel = '50%',
  duration = 2.4,
  delay = 0,
}) => {
  const uniqueId = useId();
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

  // Delayed mount for entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  // Handle travel distance
  let leftHiddenX: string;
  let rightHiddenX: string;

  if (typeof travel === 'string') {
    leftHiddenX = travel.startsWith('-') ? travel : `-${travel}`;
    rightHiddenX = travel.startsWith('-') ? travel.substring(1) : travel;
  } else {
    leftHiddenX = `${-Math.abs(travel)}px`;
    rightHiddenX = `${Math.abs(travel)}px`;
  }

  const showState = isVisible && mounted;
  const transitionDuration = reduceMotion ? 0 : duration;

  // Common styles for GPU-accelerated rendering (fixes Mac multi-display flickering)
  const gpuLayerStyles: React.CSSProperties = {
    willChange: 'auto', // Let browser decide, avoid constant layer promotion
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    perspective: 1000,
    WebkitFontSmoothing: 'antialiased',
  };

  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{cloudKeyframes}</style>

      {/* Left Cloud */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          width,
          height,
          pointerEvents: 'none',
          zIndex: zIndex,
          transformOrigin: 'left center',
          transform: showState ? `translate3d(0, 0, 0) scale(${scale})` : `translate3d(${leftHiddenX}, 0, 0) scale(${scale})`,
          opacity: showState ? opacity : 0,
          transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${transitionDuration}s ease-out`,
          ...gpuLayerStyles,
        }}
      >
        <img
          src={leftSrc}
          alt="Left Cloud"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            animation: showState && !reduceMotion ? 'floatLeft 11s ease-in-out infinite' : 'none',
            ...gpuLayerStyles,
          }}
        />
      </div>

      {/* Right Cloud */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 0,
          width,
          height,
          pointerEvents: 'none',
          zIndex: zIndex,
          transformOrigin: 'right center',
          transform: showState ? `translate3d(0, 0, 0) scale(${scale})` : `translate3d(${rightHiddenX}, 0, 0) scale(${scale})`,
          opacity: showState ? opacity : 0,
          transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${transitionDuration}s ease-out`,
          ...gpuLayerStyles,
        }}
      >
        <img
          src={rightSrc}
          alt="Right Cloud"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            animation: showState && !reduceMotion ? 'floatRight 10s ease-in-out 2s infinite' : 'none',
            ...gpuLayerStyles,
          }}
        />
      </div>

      {/* Middle Cloud - scales up/down and moves down/back */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          width,
          height,
          pointerEvents: 'none',
          zIndex: zIndex + 1,
          transformOrigin: 'center top',
          transform: showState ? `translate3d(0, 0, 0) scale(${scale})` : `translate3d(0, 100%, 0) scale(${scale})`,
          opacity: showState ? opacity : 0,
          transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${transitionDuration}s ease-out`,
          ...gpuLayerStyles,
        }}
      >
        <img
          src={middleSrc}
          alt="Middle Cloud"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transformOrigin: 'center top',
            animation: showState && !reduceMotion ? 'floatMiddle 10s ease-in-out 1.5s infinite' : 'none',
            ...gpuLayerStyles,
          }}
        />
      </div>
    </>
  );
};

export default Clouds;
