import React, { useEffect, useState } from 'react';
import lanternSrc from '../../../../assets/images/figma/lantern.png';

interface SwayingBranchesProps {
  scale?: number;
  /** Optional custom mai branch image URL */
  maiBranchSrc?: string;
  /** Optional custom dao branch image URL */
  daoBranchSrc?: string;
  /** Wind speed multiplier (1 = normal, 0 = static, 10 = storm) */
  windSpeed?: number;
  /** Gravity multiplier for motion speed */
  gravity?: number;
  /** Show branches (both) */
  isVisible?: boolean;
  /** Travel distance/percentage for hidden state */
  travel?: number | string;
  /** Animation duration */
  duration?: number;
  /** Mai branch scale */
  maiScale?: number;
  /** Dao branch scale */
  daoScale?: number;
  /** Mai branch opacity */
  maiOpacity?: number;
  /** Dao branch opacity */
  daoOpacity?: number;
  /** Mai branch tint color */
  maiColor?: string;
  /** Dao branch tint color */
  daoColor?: string;
  /** Layer z-index */
  zIndex?: number;
}

// CSS Keyframes generator for wind sway animation
const generateSwayKeyframes = (rotation: number, name: string) => `
  @keyframes ${name} {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(${rotation * 0.3}deg); }
    40% { transform: rotate(${-rotation * 0.5}deg); }
    60% { transform: rotate(${rotation * 0.7}deg); }
    80% { transform: rotate(${-rotation * 0.2}deg); }
  }
`;

// CSS Keyframes for lantern swing
const generateLanternKeyframes = (rotation: number, name: string) => `
  @keyframes ${name} {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    20% { transform: rotate(${rotation * 0.8}deg) translateY(${3 * rotation / 5}px); }
    40% { transform: rotate(${-rotation * 0.6}deg) translateY(0); }
    60% { transform: rotate(${rotation * 0.4}deg) translateY(${2 * rotation / 5}px); }
    80% { transform: rotate(${-rotation * 0.2}deg) translateY(0); }
  }
`;

// GPU-optimized styles
const gpuLayerStyles: React.CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  perspective: 1000,
};

/**
 * Cành mai (trái) và cành đào (phải) lay động trong gió
 */
export const SwayingBranches: React.FC<SwayingBranchesProps> = ({
  maiBranchSrc,
  daoBranchSrc,
  windSpeed = 1,
  gravity = 1,
  isVisible = true,
  travel = '200%',
  duration = 2.4,
  maiOpacity = 1,
  daoOpacity = 1,
  maiColor = '',
  daoColor = '',
  zIndex = 2,
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

  // Hardcoded Lantern Settings
  const showLanterns = true;
  const lanternOpacity = 1;
  const lanternSwingIntensity = 1;

  const speedFactor = Math.max(0.1, windSpeed) * Math.max(0.1, gravity);
  const durationMai = 4.5 / Math.sqrt(speedFactor);
  const rotationMai = 3 * speedFactor;
  const durationDao = 5.2 / Math.sqrt(speedFactor);
  const rotationDao = 2.5 * speedFactor;
  
  // Lantern Swing Parameters
  const lanternRotation = 14 * speedFactor * lanternSwingIntensity;
  const lanternDuration = 20 / Math.sqrt(speedFactor);

  // Calculate hiddenX for Left (Mai) and Right (Dao)
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

  if (!maiBranchSrc && !daoBranchSrc) {
    return null;
  }

  // Generate all keyframes
  const keyframes = `
    ${generateSwayKeyframes(rotationMai, 'swayMai')}
    ${generateSwayKeyframes(rotationDao, 'swayDao')}
    ${generateLanternKeyframes(lanternRotation, 'swingLanternLeft')}
    ${generateLanternKeyframes(-lanternRotation, 'swingLanternRight')}
  `;

  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{keyframes}</style>
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex,
          transform: 'translateZ(0)',
          ...gpuLayerStyles,
        }}
      >
        {maiBranchSrc && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: 'auto',
              transformOrigin: 'left 30%',
              opacity: maiOpacity,
              ...gpuLayerStyles,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: showState
                  ? 'translate3d(0, 0, 0)'
                  : `translate3d(${leftHiddenX}, 0, 0)`,
                transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1)`,
                ...gpuLayerStyles,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  transformOrigin: 'left 30%',
                  animation: showState && !reduceMotion ? `swayMai ${durationMai}s ease-in-out infinite` : 'none',
                  ...gpuLayerStyles,
                }}
              >
                <div style={{ position: 'relative', height: '100%', width: 'auto' }}>
                  <img
                    src={maiBranchSrc}
                    alt=""
                    style={{
                      height: '100%',
                      width: 'auto',
                      filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                      display: 'block',
                    }}
                  />
                  {maiColor && maiColor !== '#FFFFFF' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: maiColor,
                        mixBlendMode: 'color',
                        opacity: 0.45,
                      }}
                    />
                  )}

                  {/* Lanterns attached to Mai Branch */}
                  {showLanterns && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10%',
                        left: 0,
                        width: '80%',
                        transformOrigin: 'top center',
                        zIndex: -1,
                        animation: showState && !reduceMotion ? `swingLanternLeft ${lanternDuration * 0.8}s ease-in-out 0.7s infinite` : 'none',
                        ...gpuLayerStyles,
                      }}
                    >
                      <img src={lanternSrc} alt="" style={{ width: '100%', height: 'auto', opacity: lanternOpacity }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {daoBranchSrc && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: 'auto',
              transformOrigin: 'right 20%',
              opacity: daoOpacity,
              ...gpuLayerStyles,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: showState
                  ? 'translate3d(0, 0, 0)'
                  : `translate3d(${rightHiddenX}, 0, 0)`,
                transition: `transform ${transitionDuration}s cubic-bezier(0.25, 1, 0.5, 1)`,
                ...gpuLayerStyles,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  transformOrigin: 'right 20%',
                  animation: showState && !reduceMotion ? `swayDao ${durationDao}s ease-in-out 0.8s infinite` : 'none',
                  ...gpuLayerStyles,
                }}
              >
                <div style={{ position: 'relative', height: '100%', width: 'auto' }}>
                  <img
                    src={daoBranchSrc}
                    alt=""
                    style={{
                      height: '100%',
                      width: 'auto',
                      filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                      display: 'block',
                    }}
                  />
                  {daoColor && daoColor !== '#FFFFFF' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: daoColor,
                        mixBlendMode: 'color',
                        opacity: 0.45,
                      }}
                    />
                  )}
                </div>
                {/* Lanterns attached to Dao Branch (Mirrored) */}
                {showLanterns && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '13%',
                      right: 0,
                      width: '70%',
                      transformOrigin: 'top center',
                      zIndex: -1,
                      animation: showState && !reduceMotion ? `swingLanternRight ${lanternDuration * 0.8}s ease-in-out 1.1s infinite` : 'none',
                      ...gpuLayerStyles,
                    }}
                  >
                    <img
                      src={lanternSrc}
                      alt=""
                      style={{
                        width: '100%',
                        height: 'auto',
                        opacity: lanternOpacity,
                        transform: 'scaleX(-1)', // Flip horizontally
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SwayingBranches;
