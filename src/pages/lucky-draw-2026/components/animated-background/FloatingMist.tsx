import React, { useId } from 'react';

interface FloatingMistProps {
  cloudOpacity?: number;
  cloudCount?: number;
  cloudSpeed?: number;
  zIndex?: number;
  layoutScale?: number;
}

// Generate unique keyframes for each mist layer
const generateMistKeyframes = (id: string, count: number) => {
  let keyframes = '';
  for (let i = 0; i < count; i++) {
    keyframes += `
      @keyframes mistFloat-${id}-${i} {
        0% { transform: translate3d(-150%, 0, 0); }
        100% { transform: translate3d(300%, 0, 0); }
      }
    `;
  }
  return keyframes;
};

export const FloatingMist: React.FC<FloatingMistProps> = ({ 
  cloudOpacity = 0.35,
  cloudCount = 3,
  cloudSpeed = 1,
  zIndex = 3,
  layoutScale = 1,
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const actualCount = Math.max(0, Math.min(20, cloudCount));
  
  // GPU-optimized styles
  const gpuLayerStyles: React.CSSProperties = {
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    perspective: 1000,
  };

  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{generateMistKeyframes(uniqueId, actualCount)}</style>
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex,
        }}
      >
        {Array.from({ length: actualCount }).map((_, i) => {
          const layerIndex = i % 4;
          const isNear = layerIndex > 1;
          const speedFactor = Math.max(0.1, cloudSpeed) * (isNear ? 1.25 : 0.75);
          const blur = isNear ? 18 : 14;
          const opacityFactor = cloudOpacity * (isNear ? 0.7 : 1);
          const scaleFactor = (isNear ? 3.2 : 2.7) * layoutScale;
          const baseLeft = -30 + (i * 18) % 60;
          const baseBottom = 5 + layerIndex * 5 + (i % 3) * 2;
          const duration = (30 + (cloudCount - i) * 3) / Math.sqrt(speedFactor);
          const delay = i * 3;

          return (
            <svg
              key={i}
              width={800 * scaleFactor}
              height={1000 * scaleFactor}
              viewBox="0 0 600 200"
              style={{
                position: 'absolute',
                left: `${baseLeft}%`,
                bottom: `${baseBottom}%`,
                opacity: opacityFactor,
                filter: `blur(${blur * layoutScale}px)`,
                zIndex: layerIndex,
                // CSS animation instead of Framer Motion
                animation: `mistFloat-${uniqueId}-${i} ${duration}s linear ${delay}s infinite`,
                // GPU layer isolation for multi-display sync
                transform: 'translate3d(-150%, 0, 0)',
                ...gpuLayerStyles,
              }}
            >
              <path
                d="M70 140c0-22 18-40 40-40 8 0 15 2 21 6 6-20 25-36 48-36 21 0 39 12 46 30 4-1 8-2 12-2 20 0 36 16 36 36h-203z"
                fill={`rgba(255,255,255,${Math.min(0.6, cloudOpacity * 2)})`}
              />
              <path
                d="M260 150c0-18 15-33 33-33 6 0 12 2 17 5 5-16 20-28 38-28 17 0 32 10 37 24 3-1 7-2 10-2 16 0 29 13 29 29H260z"
                fill={`rgba(255,255,255,${Math.min(0.5, cloudOpacity * 1.5)})`}
              />
            </svg>
          );
        })}
      </div>
    </>
  );
};

export default FloatingMist;
