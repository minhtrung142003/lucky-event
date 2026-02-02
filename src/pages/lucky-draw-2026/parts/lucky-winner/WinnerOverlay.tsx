import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { PrizeWinner } from '../../../../context/lucky-draw.context';
import { useEffects } from '../../../../context/effects.context';
import { useConfetti } from '../../../../hooks/use-confetti.hook';
import { LuckyWinnerPart } from './lucky-winner.part';
import {
  LUCKY_DRAW_2026_DESIGN_WIDTH,
  LUCKY_DRAW_2026_DESIGN_HEIGHT,
  getScenarioConfig,
  TRANSITION_TIMING,
  ConfettiLevel,
} from '../../lucky-draw-2026.constants';
import Fireworks, { SPECIAL_SEQUENCE } from '../../components/animated-background/Fireworks';
import { ZoomProofConfettiCanvas } from '../../../../components/confetti/ZoomProofConfettiCanvas';
import urlRibbon from '../../../../assets/images/ruy băng size lớn.svg';
import logo from '../../../../assets/images/logo 1.png';
import urlBoxAvatar from '../../../../assets/images/winner-4.svg';

// ============================================================================
// Types
// ============================================================================

interface WinnerOverlayProps {
  winner: PrizeWinner | null;
  isVisible: boolean;
  scale: number;
}

// Special Prize Sequence Phases
type SpecialPhase = 'idle' | 'darkening' | 'rockets_flying' | 'explosion' | 'flash' | 'reveal' | 'confetti';

// ============================================================================
// Component
// ============================================================================

export const WinnerOverlay: React.FC<WinnerOverlayProps> = ({ winner, isVisible, scale }) => {
  const { state: effectsState } = useEffects();
  const { triggerByLevel, triggerByPrizeId } = useConfetti();

  // ============================================================================
  // Refs & State
  // ============================================================================

  const confettiInstanceRef = useRef<any>(null);
  const confettiBehindInstanceRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Special Prize Sequence State
  const [specialPhase, setSpecialPhase] = useState<SpecialPhase>('idle');
  const [showSpecialFireworks, setShowSpecialFireworks] = useState(false);
  const isSpecialPrize = winner?.prizeId === 'special';

  // ============================================================================
  // Memoized Values
  // ============================================================================

  const scenarioConfig = useMemo(() => {
    return getScenarioConfig(winner?.prizeId || 'first');
  }, [winner?.prizeId]);

  // const { banner, winnerBadge } = scenarioConfig;
  const mainDelay = TRANSITION_TIMING.FADE_IN_BG / 1000;

  // ============================================================================
  // Callbacks
  // ============================================================================

  const handleFrontInstanceReady = useCallback((instance: any) => {
    confettiInstanceRef.current = instance;
  }, []);

  const handleBehindInstanceReady = useCallback((instance: any) => {
    confettiBehindInstanceRef.current = instance;
  }, []);

  // ============================================================================
  // Effects
  // ============================================================================

  // SPECIAL PRIZE SEQUENCE - Epic Grand Finale!
  useEffect(() => {
    if (!isVisible || !isSpecialPrize || !winner) {
      setSpecialPhase('idle');
      setShowSpecialFireworks(false);
      return;
    }

    // Start the dramatic sequence
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Darkening (0ms) - Màn hình tối dần + rockets bắt đầu bay luôn
    setSpecialPhase('darkening');
    setShowSpecialFireworks(true); // Rockets bay ngay khi tối

    // Phase 2: Rockets Flying (tiếp tục bay trong khi màn hình tối)
    timers.push(
      setTimeout(() => {
        setSpecialPhase('rockets_flying');
      }, SPECIAL_SEQUENCE.DARK_FADE_IN)
    );

    // Phase 3: Explosion (after rockets reach target) - Nổ đùng!
    timers.push(
      setTimeout(() => {
        setSpecialPhase('explosion');
      }, SPECIAL_SEQUENCE.DARK_FADE_IN + SPECIAL_SEQUENCE.ROCKETS_FLIGHT)
    );

    // Phase 4: Flash (brief bright flash) - Flash sáng
    timers.push(
      setTimeout(
        () => {
          setSpecialPhase('flash');
        },
        SPECIAL_SEQUENCE.DARK_FADE_IN + SPECIAL_SEQUENCE.ROCKETS_FLIGHT + 100
      )
    );

    // Phase 5: Reveal (everything bright, winner appears) - Sáng rực, winner hiện lên
    timers.push(
      setTimeout(
        () => {
          setSpecialPhase('reveal');
          setIsMounted(true);
        },
        SPECIAL_SEQUENCE.DARK_FADE_IN + SPECIAL_SEQUENCE.ROCKETS_FLIGHT + SPECIAL_SEQUENCE.EXPLOSION_FLASH
      )
    );

    // Phase 6: Confetti (celebration!) - Pháo giấy bắn phấp phới
    timers.push(
      setTimeout(
        () => {
          setSpecialPhase('confetti');
          // Trigger epic confetti
          if (confettiInstanceRef.current) {
            triggerByLevel(4 as ConfettiLevel, confettiInstanceRef.current, scale);
          }
          if (confettiBehindInstanceRef.current) {
            triggerByLevel(4 as ConfettiLevel, confettiBehindInstanceRef.current, scale);
          }
        },
        SPECIAL_SEQUENCE.DARK_FADE_IN + SPECIAL_SEQUENCE.ROCKETS_FLIGHT + SPECIAL_SEQUENCE.EXPLOSION_FLASH + SPECIAL_SEQUENCE.WINNER_APPEAR
      )
    );

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [isVisible, isSpecialPrize, winner, triggerByLevel, scale]);

  // Mount/unmount animation trigger (for non-special prizes)
  useEffect(() => {
    if (isSpecialPrize) return; // Special prize has its own sequence

    if (isVisible) {
      const timer = requestAnimationFrame(() => setIsMounted(true));
      return () => cancelAnimationFrame(timer);
    } else {
      setIsMounted(false);
    }
  }, [isVisible, isSpecialPrize]);

  // Trigger confetti when winner appears (for non-special prizes)
  useEffect(() => {
    if (!isVisible || !winner || isSpecialPrize) return; // Skip for special prize

    const timer = setTimeout(() => {
      if (confettiInstanceRef.current) {
        triggerByPrizeId(winner?.prizeId as any, confettiInstanceRef.current, scale);
      }
      if (confettiBehindInstanceRef.current) {
        triggerByPrizeId(winner?.prizeId as any, confettiBehindInstanceRef.current, scale);
      }
    }, TRANSITION_TIMING.CONFETTI_DELAY);

    return () => clearTimeout(timer);
  }, [isVisible, winner, isSpecialPrize, scenarioConfig.confettiLevels, triggerByLevel, scale]);

  // External confetti trigger support
  useEffect(() => {
    if (!isVisible || effectsState.confettiLevel <= 0) return;

    const level = effectsState.confettiLevel as ConfettiLevel;
    if (confettiInstanceRef.current) {
      triggerByLevel(level, confettiInstanceRef.current, scale);
    }
    if (confettiBehindInstanceRef.current) {
      triggerByLevel(level, confettiBehindInstanceRef.current, scale);
    }
  }, [isVisible, effectsState.confettiTriggerId, effectsState.confettiLevel, triggerByLevel, scale]);

  if (!winner) return null;

  // ============================================================================
  // Computed Styles
  // ============================================================================

  // Special Prize: Different visibility logic based on sequence phase
  const isInRevealPhase = specialPhase === 'reveal' || specialPhase === 'confetti';
  const showContent = isSpecialPrize ? isVisible && isInRevealPhase : isVisible && isMounted;

  // Dark overlay for special prize sequence
  const darkOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 899,
    backgroundColor: 'black',
    opacity: specialPhase === 'darkening' || specialPhase === 'rockets_flying' ? 0.85 : 0,
    transition: specialPhase === 'darkening' ? `opacity ${SPECIAL_SEQUENCE.DARK_FADE_IN}ms ease-in` : 'opacity 0.3s ease-out',
    pointerEvents: 'none',
  };

  // Flash effect when rockets explode - golden-white glow, semi-transparent
  const flashOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 901,
    background: 'radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgba(250, 223, 74, 0.77) 40%, rgba(255, 187, 28, 0.6) 70%)',
    opacity: specialPhase === 'flash' ? 1 : 0,
    transition: specialPhase === 'flash' ? 'opacity 0.8s ease-in' : `opacity ${SPECIAL_SEQUENCE.BRIGHT_REVEAL}ms ease-out`,
    pointerEvents: 'none',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    opacity: showContent ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: 'opacity 0.5s ease-out',
  };

  const contentContainerStyle: React.CSSProperties = {
    width: LUCKY_DRAW_2026_DESIGN_WIDTH,
    height: LUCKY_DRAW_2026_DESIGN_HEIGHT,
    transform: `scale(${scale})`,
    transformOrigin: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  };

  const contentStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: showContent ? 1 : 0,
    transform: showContent ? 'scale(1)' : 'scale(0.6)',
    transition: isSpecialPrize
      ? `opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)`
      : `opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1) ${mainDelay}s, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1) ${mainDelay}s`,
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <>
      {/* Special Prize: Dark Overlay */}
      {isSpecialPrize && isVisible && <div style={darkOverlayStyle} />}

      {/* Special Prize: Flash Effect on Explosion */}
      {isSpecialPrize && isVisible && <div style={flashOverlayStyle} />}

      {/* Special Prize: Slow Fireworks during dark phase - above dark overlay */}
      {isSpecialPrize && showSpecialFireworks && (
        <Fireworks
          prizeId="special"
          isActive={specialPhase === 'rockets_flying' || specialPhase === 'explosion' || specialPhase === 'flash' || isInRevealPhase}
          zIndex={900}
        />
      )}

      <div style={overlayStyle}>
        {/* Behind Confetti Layer */}
        <ZoomProofConfettiCanvas zIndex={8} onInstanceReady={handleBehindInstanceReady} />

        {/* Winner Badge & Info */}
        <div style={contentContainerStyle}>
          {/* Logo at top center */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              opacity: showContent ? 1 : 0,
              transition: 'opacity 0.5s ease-out',
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: 180,
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          <div style={contentStyle}>
            <LuckyWinnerPart open={true} awardees={winner} urlRibbonBg={urlRibbon} urlBoxAvatar={urlBoxAvatar} />
          </div>
        </div>

        {/* Fireworks for non-special prizes are shown from main page */}

        {/* Front Confetti Layer */}
        <ZoomProofConfettiCanvas zIndex={9999} onInstanceReady={handleFrontInstanceReady} />
      </div>
    </>
  );
};
