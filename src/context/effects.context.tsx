import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

// ============================================================================
// State - Minimal: only confetti & fireworks for cross-tab sync

export interface EffectsState {
  confettiLevel: number;
  confettiTriggerId: number;
  fireworksPrizeId: string | null;
  fireworksTriggerId: number;
}

type EffectsAction =
  | { type: 'SET_EFFECTS_BATCH'; effects: Partial<EffectsState> }
  | { type: 'SYNC_FROM_REMOTE'; state: Partial<EffectsState> };

const DEFAULT_EFFECTS: EffectsState = {
  confettiLevel: 0,
  confettiTriggerId: 0,
  fireworksPrizeId: null,
  fireworksTriggerId: 0,
};

const CHANNEL_NAME = 'lucky-draw-effects-sync';

// ============================================================================
// Reducer

function reducer(state: EffectsState, action: EffectsAction): EffectsState {
  switch (action.type) {
    case 'SET_EFFECTS_BATCH':
      return { ...state, ...action.effects };
    case 'SYNC_FROM_REMOTE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

// ============================================================================
// Context

interface EffectsContextType {
  state: EffectsState;
  triggerConfetti: (level: number) => void;
  triggerFireworks: (prizeId: string) => void;
}

const EffectsContext = createContext<EffectsContextType | null>(null);

// ============================================================================
// Provider

export const EffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_EFFECTS);
  const channelRef = React.useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current.onmessage = (event) => {
      if (event.data?.type === 'SYNC_EFFECTS') {
        dispatch({ type: 'SYNC_FROM_REMOTE', state: event.data.payload });
      }
    };
    return () => channelRef.current?.close();
  }, []);

  const broadcast = useCallback((partialState: Partial<EffectsState>) => {
    channelRef.current?.postMessage({ type: 'SYNC_EFFECTS', payload: partialState });
  }, []);

  const triggerConfetti = useCallback((level: number) => {
    const effects = { confettiLevel: level, confettiTriggerId: Date.now() };
    dispatch({ type: 'SET_EFFECTS_BATCH', effects });
    broadcast(effects);
  }, [broadcast]);

  const triggerFireworks = useCallback((prizeId: string) => {
    const effects = { fireworksPrizeId: prizeId, fireworksTriggerId: Date.now() };
    dispatch({ type: 'SET_EFFECTS_BATCH', effects });
    broadcast(effects);
  }, [broadcast]);

  const value = useMemo(
    () => ({ state, triggerConfetti, triggerFireworks }),
    [state, triggerConfetti, triggerFireworks]
  );

  return <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>;
};

// ============================================================================
// Hook

export function useEffects(): EffectsContextType {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error('useEffects must be used within an EffectsProvider');
  }
  return context;
}

export default EffectsProvider;
