import React, { useMemo, useId } from 'react';

interface SnowParticlesProps {
  /** Number of particles per layer */
  count?: number;
  /** Show/hide particles */
  isVisible?: boolean;
  /** Base z-index (3 layers will use zIndex, zIndex+5, zIndex+10) */
  zIndex?: number;
  /** Overall opacity */
  opacity?: number;
}

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

const generateParticles = (
  count: number, 
  sizeRange: [number, number], 
  opacityRange: [number, number],
  durationRange: [number, number] = [40, 80]
): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    duration: durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
    delay: Math.random() * -20,
    drift: (Math.random() - 0.5) * 30,
    opacity: opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]),
  }));
};

// Generate CSS keyframes for snow particles
const generateSnowKeyframes = (uniqueId: string, particles: Particle[], layerId: string) => {
  return particles.map((p, i) => `
    @keyframes snowFall-${uniqueId}-${layerId}-${i} {
      0% { 
        transform: translate3d(0, 0, 0); 
      }
      25% { 
        transform: translate3d(${p.drift}px, 27.5vh, 0); 
      }
      50% { 
        transform: translate3d(0, 55vh, 0); 
      }
      75% { 
        transform: translate3d(${-p.drift * 0.5}px, 82.5vh, 0); 
      }
      100% { 
        transform: translate3d(0, 110vh, 0); 
      }
    }
  `).join('\n');
};

// GPU-optimized styles
const gpuLayerStyles: React.CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

const SnowLayer: React.FC<{
  particles: Particle[];
  zIndex: number;
  blur?: number;
  uniqueId: string;
  layerId: string;
}> = ({ particles, zIndex, blur = 0, uniqueId, layerId }) => {
  return (
    <>
      {/* Inject keyframes for this layer */}
      <style>{generateSnowKeyframes(uniqueId, particles, layerId)}</style>
      
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          transform: 'translateZ(0)',
          ...gpuLayerStyles,
        }}
      >
        {particles.map((p, i) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: '-10px',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#fff',
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size / 2}px rgba(255, 255, 255, 0.5)`,
              // CSS animation
              animation: `snowFall-${uniqueId}-${layerId}-${i} ${p.duration}s linear ${p.delay}s infinite`,
              ...gpuLayerStyles,
            }}
          />
        ))}
      </div>
    </>
  );
};

export const SnowParticles: React.FC<SnowParticlesProps> = ({
  count = 30,
  isVisible = true,
  opacity = 1,
}) => {
  const uniqueId = useId().replace(/:/g, '');
  
  // Layer 1: Background - small, slow (far away - 3D effect)
  const backParticles = useMemo(
    () => generateParticles(Math.floor(count * 0.8), [2, 4], [0.2 * opacity, 0.4 * opacity], [72, 100]),
    [count, opacity]
  );

  // Layer 2: Middle - medium size, medium speed
  const midParticles = useMemo(
    () => generateParticles(count, [3, 6], [0.4 * opacity, 0.7 * opacity], [48, 72]),
    [count, opacity]
  );

  // Layer 3: Foreground - large, normal speed (close to camera)
  const frontParticles = useMemo(
    () => generateParticles(Math.floor(count * 0.5), [5, 10], [0.5 * opacity, 0.9 * opacity], [32, 48]),
    [count, opacity]
  );

  if (!isVisible) return null;

  return (
    <>
      {/* Layer 1: Far background */}
      <SnowLayer particles={backParticles} zIndex={0} uniqueId={uniqueId} layerId="back" />
      
      {/* Layer 2: Middle */}
      <SnowLayer particles={midParticles} zIndex={0} uniqueId={uniqueId} layerId="mid" />
      
      {/* Layer 3: Near foreground (all behind branches z:2) */}
      <SnowLayer particles={frontParticles} zIndex={1} blur={1} uniqueId={uniqueId} layerId="front" />
    </>
  );
};

export default SnowParticles;
