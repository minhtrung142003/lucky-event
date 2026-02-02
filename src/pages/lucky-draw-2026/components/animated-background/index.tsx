import React from 'react';
import { SwayingBranches } from './SwayingBranches';
import { FloatingMist } from './FloatingMist';
import { Clouds } from './Clouds';
import { SnowParticles } from './SnowParticles';
import { Swallow } from './Swallow';
import { TetBinhNgo } from './TetBinhNgo';
import lightRightSrc from '../../../../assets/images/figma/light-right.png';
import { light } from '@mui/material/styles/createPalette';

interface AnimatedBackgroundProps {
  showMist?: boolean;
  showSnow?: boolean;
  showClouds?: boolean;
  showBranches?: boolean;
  showSwallow?: boolean;
  showTetBinhNgo?: boolean;
  showLights?: boolean;
  lightsOpacity?: number;
  
  maiBranchSrc?: string;
  daoBranchSrc?: string;

  snowOpacity?: number;
  layoutScale?: number;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  showBranches = true,
  showMist = true,
  showSnow = true,
  showClouds = true,
  showSwallow = true,
  showTetBinhNgo = true,
  showLights = true,
  lightsOpacity = 1,
  
  maiBranchSrc,
  daoBranchSrc,
  snowOpacity = 0.8,
  layoutScale = 1,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Clouds */}
      {showClouds && <Clouds isVisible zIndex={2} />}

      {/* Snow Particles */}
      {showSnow && (
        <SnowParticles isVisible count={35} opacity={snowOpacity} zIndex={6} />
      )}

      {/* Swaying Branches */}
      {showBranches && (
        <SwayingBranches
          maiBranchSrc={maiBranchSrc}
          daoBranchSrc={daoBranchSrc}
          isVisible
          zIndex={3}
        />
      )}

      {/* Stage Lights */}
      {showLights && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              zIndex: 2,
              pointerEvents: 'none',
              opacity: lightsOpacity,
            }}
          >
            <img src={lightRightSrc} alt="" style={{ height: '100%', display: 'block' }} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              zIndex: 2,
              pointerEvents: 'none',
              opacity: lightsOpacity,
            }}
          >
            <img src={lightRightSrc} alt="" style={{ height: '100%', width: 'auto', display: 'block', transform: 'scaleX(-1)' }} />
          </div>
        </>
      )}

      {/* Tết Bính Ngọ */}
      {showTetBinhNgo && <TetBinhNgo isVisible zIndex={4} />}

      {/* Floating Clouds */}
      {showMist && (
        <FloatingMist
          cloudOpacity={0.35}
          cloudCount={4}
          cloudSpeed={1}
          zIndex={3}
          layoutScale={layoutScale}
        />
      )}

      {/* Swallow */}
      {showSwallow && <Swallow isVisible zIndex={1} />}
    </div>
  );
};

export default AnimatedBackground;
export { SwayingBranches } from './SwayingBranches';
export { FloatingMist } from './FloatingMist';
export { Clouds } from './Clouds';
export { SnowParticles } from './SnowParticles';
export { Fireworks } from './Fireworks';
export { FlowerFrame } from './FlowerFrame';
export { Swallow } from './Swallow';
export { TetBinhNgo } from './TetBinhNgo';
