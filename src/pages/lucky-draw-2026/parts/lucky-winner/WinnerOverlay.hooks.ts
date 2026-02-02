import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useConfetti } from '../../../../hooks/use-confetti.hook';
import { SPECIAL_SEQUENCE } from '../../components/animated-background/Fireworks';
import { getScenarioConfig, TRANSITION_TIMING, ConfettiLevel } from '../../lucky-draw-2026.constants';

// ============================================================================
// Types
// ============================================================================

export type SpecialPhase = 'idle' | 'darkening' | 'rockets_flying' | 'explosion' | 'flash' | 'reveal' | 'confetti';

interface SpecialPrizeSequenceResult {
  specialPhase: SpecialPhase;
  showSpecialFireworks: boolean;
  isInRevealPhase: boolean;
  isMounted: boolean;
}

interface ConfettiRefs {
  front: React.MutableRefObject<any>;
  behind: React.MutableRefObject<any>;
}

// ============================================================================
// useSpecialPrizeSequence - State machine for special prize animation
// ============================================================================

export const useSpecialPrizeSequence = (
  isVisible: boolean,
  isSpecialPrize: boolean,
  hasWinner: boolean,
  confettiRefs: ConfettiRefs,
  scale: number
): SpecialPrizeSequenceResult => {
  const { triggerByLevel } = useConfetti();
  const [specialPhase, setSpecialPhase] = useState<SpecialPhase>('idle');
  const [showSpecialFireworks, setShowSpecialFireworks] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isVisible || !isSpecialPrize || !hasWinner) {
      setSpecialPhase('idle');
      setShowSpecialFireworks(false);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    const { DARK_FADE_IN, ROCKETS_FLIGHT, EXPLOSION_FLASH, WINNER_APPEAR } = SPECIAL_SEQUENCE;

    // Phase 1: Darkening
    setSpecialPhase('darkening');
    setShowSpecialFireworks(true);

    // Phase 2: Rockets Flying
    timers.push(setTimeout(() => {
      setSpecialPhase('rockets_flying');
    }, DARK_FADE_IN));

    // Phase 3: Explosion
    timers.push(setTimeout(() => {
      setSpecialPhase('explosion');
    }, DARK_FADE_IN + ROCKETS_FLIGHT));

    // Phase 4: Flash
    timers.push(setTimeout(() => {
      setSpecialPhase('flash');
    }, DARK_FADE_IN + ROCKETS_FLIGHT + 100));

    // Phase 5: Reveal
    timers.push(setTimeout(() => {
      setSpecialPhase('reveal');
      setIsMounted(true);
    }, DARK_FADE_IN + ROCKETS_FLIGHT + EXPLOSION_FLASH));

    // Phase 6: Confetti
    timers.push(setTimeout(() => {
      setSpecialPhase('confetti');
      const EPIC_LEVEL = 5 as ConfettiLevel;
      if (confettiRefs.front.current) triggerByLevel(EPIC_LEVEL, confettiRefs.front.current, scale);
      if (confettiRefs.behind.current) triggerByLevel(EPIC_LEVEL, confettiRefs.behind.current, scale);
    }, DARK_FADE_IN + ROCKETS_FLIGHT + EXPLOSION_FLASH + WINNER_APPEAR));

    return () => timers.forEach(t => clearTimeout(t));
  }, [isVisible, isSpecialPrize, hasWinner, triggerByLevel, scale, confettiRefs]);

  const isInRevealPhase = specialPhase === 'reveal' || specialPhase === 'confetti';

  return { specialPhase, showSpecialFireworks, isInRevealPhase, isMounted };
};

// ============================================================================
// useMountAnimation - Simple mount/unmount for non-special prizes
// ============================================================================

export const useMountAnimation = (isVisible: boolean, skip: boolean): boolean => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (skip) return;

    if (isVisible) {
      const timer = requestAnimationFrame(() => setIsMounted(true));
      return () => cancelAnimationFrame(timer);
    } else {
      setIsMounted(false);
    }
  }, [isVisible, skip]);

  return isMounted;
};

// ============================================================================
// useWinnerConfetti - Confetti triggering logic
// ============================================================================

export const useWinnerConfetti = (
  isVisible: boolean,
  prizeId: string | undefined,
  isSpecialPrize: boolean,
  confettiRefs: ConfettiRefs,
  scale: number,
  externalLevel: number,
  externalTriggerId: number
) => {
  const { triggerByLevel } = useConfetti();
  const scenarioConfig = getScenarioConfig(prizeId || 'first');

  // Auto-trigger for non-special prizes
  useEffect(() => {
    if (!isVisible || !prizeId || isSpecialPrize) return;

    const timer = setTimeout(() => {
      const levels = scenarioConfig.confettiLevels;
      const randomLevel = levels[Math.floor(Math.random() * levels.length)] as ConfettiLevel;

      if (confettiRefs.front.current) triggerByLevel(randomLevel, confettiRefs.front.current, scale);
      if (confettiRefs.behind.current) triggerByLevel(randomLevel, confettiRefs.behind.current, scale);
    }, TRANSITION_TIMING.CONFETTI_DELAY);

    return () => clearTimeout(timer);
  }, [isVisible, prizeId, isSpecialPrize, scenarioConfig.confettiLevels, triggerByLevel, scale, confettiRefs]);

  // External trigger support
  useEffect(() => {
    if (!isVisible || externalLevel <= 0) return;

    const level = externalLevel as ConfettiLevel;
    if (confettiRefs.front.current) triggerByLevel(level, confettiRefs.front.current, scale);
    if (confettiRefs.behind.current) triggerByLevel(level, confettiRefs.behind.current, scale);
  }, [isVisible, externalTriggerId, externalLevel, triggerByLevel, scale, confettiRefs]);
};

// ============================================================================
// useConfettiRefs - Create stable refs for confetti instances
// ============================================================================

export const useConfettiRefs = () => {
  const front = useRef<any>(null);
  const behind = useRef<any>(null);

  const handleFrontReady = useCallback((instance: any) => {
    front.current = instance;
  }, []);

  const handleBehindReady = useCallback((instance: any) => {
    behind.current = instance;
  }, []);

  // Stable refs object - doesn't change between renders
  const refs = useMemo(() => ({ front, behind }), []);

  return {
    refs,
    handleFrontReady,
    handleBehindReady,
  };
};
