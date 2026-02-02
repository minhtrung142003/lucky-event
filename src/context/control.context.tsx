import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Import services
import {
  WinnerService,
  SettingsService,
  EffectService,
  GameService,
  ChannelService,
  STORAGE_KEYS,
  StorageService,
} from '../services';

import type {
  PrizeWinner,
  WinnerStatus,
  EffectSettings,
  ControlMessage,
} from '../services';

// Re-export types for backward compatibility
export type { PrizeWinner, WinnerStatus, ControlMessage };

// Re-export constants for backward compatibility
export { STORAGE_KEYS };
export const CONTROL_CHANNEL_NAME = 'lucky-event-control';
export const STORAGE_KEY_WINNERS = STORAGE_KEYS.WINNERS;
export const STORAGE_KEY_CURRENT_PRIZE = STORAGE_KEYS.CURRENT_PRIZE;
export const STORAGE_KEY_EXCLUSIONS = STORAGE_KEYS.EXCLUSIONS;

/**
 * Combined control state - merges persisted and non-persisted state
 */
export interface ControlState extends EffectSettings {
  // Game Control State (from GameService - non-persisted)
  gameDigits: (number | null)[];
  gameActivePosition: number;
  isGameInputLocked: boolean;
  isCandidateNotFound: boolean;
  notFoundCode: string | null;

  // Persisted state (from services)
  currentPrizeId: string | null;
  prizeWinners: PrizeWinner[];
  excludedCodes: string[];

  // Winner Announcement State (non-persisted)
  showWinnerAnnouncement: boolean;
  currentWinner: PrizeWinner | null;
}

interface ControlContextType {
  state: ControlState;
  sendCommand: (msg: ControlMessage) => void;
  lastCommand: ControlMessage | null;
}

/**
 * Build initial state from services
 */
const getInitialState = (): ControlState => {
  const effectDefaults = EffectService.getDefaults();
  const gameDefaults = GameService.getDefaults();

  return {
    // Effect settings (non-persisted)
    ...effectDefaults,

    // Game state (non-persisted)
    gameDigits: gameDefaults.digits,
    gameActivePosition: gameDefaults.activePosition,
    isGameInputLocked: gameDefaults.isInputLocked,
    isCandidateNotFound: gameDefaults.isCandidateNotFound,
    notFoundCode: gameDefaults.notFoundCode,

    // Persisted state (loaded from storage)
    currentPrizeId: SettingsService.getCurrentPrize(),
    prizeWinners: WinnerService.getAll(),
    excludedCodes: SettingsService.getExclusions(),

    // Winner announcement (non-persisted)
    showWinnerAnnouncement: false,
    currentWinner: null,
  };
};

/**
 * Get default state (for reset)
 */
const getDefaultState = (): ControlState => {
  const effectDefaults = EffectService.getDefaults();
  const gameDefaults = GameService.getDefaults();

  return {
    ...effectDefaults,
    gameDigits: gameDefaults.digits,
    gameActivePosition: gameDefaults.activePosition,
    isGameInputLocked: gameDefaults.isInputLocked,
    isCandidateNotFound: gameDefaults.isCandidateNotFound,
    notFoundCode: gameDefaults.notFoundCode,
    currentPrizeId: null,
    prizeWinners: [],
    excludedCodes: [],
    showWinnerAnnouncement: false,
    currentWinner: null,
  };
};

const ControlContext = createContext<ControlContextType>({
  state: getDefaultState(),
  sendCommand: () => {},
  lastCommand: null,
});

export const useControl = () => useContext(ControlContext);

export const ControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ControlState>(getInitialState);
  const [lastCommand, setLastCommand] = useState<ControlMessage | null>(null);

  /**
   * Process a control message and update state
   */
  const processMessage = useCallback((msg: ControlMessage, isLocal: boolean = false) => {
    setLastCommand(msg);

    switch (msg.type) {
      case 'TRIGGER_CONFETTI':
        setState((prev) => ({ ...prev, confettiLevel: msg.payload.level }));
        break;

      case 'RESET': {
        // Clear all persisted data
        WinnerService.clearAll();
        SettingsService.setCurrentPrize(null);
        SettingsService.clearExclusions();
        
        // Clear legacy keys
        StorageService.remove(STORAGE_KEYS.LEGACY_WINNERS);
        StorageService.remove(STORAGE_KEYS.LEGACY_STATE);
        
        setState(getDefaultState());
        break;
      }

      case 'SET_GAME_DIGIT':
        setState((prev) => {
          const newDigits = [...prev.gameDigits];
          newDigits[msg.payload.position] = msg.payload.value;
          return { ...prev, gameDigits: newDigits };
        });
        break;

      case 'SET_GAME_DIGITS':
        setState((prev) => ({ ...prev, gameDigits: msg.payload.digits }));
        break;

      case 'SET_GAME_ACTIVE_POSITION':
        setState((prev) => ({ ...prev, gameActivePosition: msg.payload.position }));
        break;

      case 'SET_CURRENT_PRIZE':
        // Persist to storage
        if (isLocal) {
          SettingsService.setCurrentPrize(msg.payload.prizeId);
        }
        setState((prev) => ({ ...prev, currentPrizeId: msg.payload.prizeId }));
        break;

      case 'SET_EXCLUDED_CODES':
        // Persist to storage
        if (isLocal) {
          SettingsService.setExclusions(msg.payload.codes);
        }
        setState((prev) => ({ ...prev, excludedCodes: msg.payload.codes }));
        break;

      case 'ADD_WINNER':
        // Persist to storage
        if (isLocal) {
          WinnerService.add(msg.payload.winner);
        }
        setState((prev) => ({
          ...prev,
          prizeWinners: [...prev.prizeWinners, msg.payload.winner],
        }));
        break;

      case 'UPDATE_WINNER_STATUS':
        // Persist to storage
        if (isLocal) {
          WinnerService.updateStatus(msg.payload.employeeCode, msg.payload.status);
        }
        setState((prev) => ({
          ...prev,
          prizeWinners: prev.prizeWinners.map((w) =>
            w.employeeCode === msg.payload.employeeCode
              ? { ...w, status: msg.payload.status }
              : w
          ),
        }));
        break;

      case 'RESET_GAME_DIGITS':
        setState((prev) => ({
          ...prev,
          gameDigits: [null, null, null],
          gameActivePosition: 0,
        }));
        break;

      case 'LOCK_GAME_INPUT':
        setState((prev) => ({ ...prev, isGameInputLocked: msg.payload.locked }));
        break;

      case 'SHOW_NOT_FOUND_ALERT':
        setState((prev) => ({
          ...prev,
          isCandidateNotFound: true,
          notFoundCode: msg.payload.code,
        }));
        break;

      case 'HIDE_NOT_FOUND_ALERT':
        setState((prev) => ({
          ...prev,
          isCandidateNotFound: false,
          notFoundCode: null,
        }));
        break;

      case 'SHOW_WINNER':
        setState((prev) => ({
          ...prev,
          showWinnerAnnouncement: true,
          currentWinner: msg.payload.winner,
        }));
        break;

      case 'HIDE_WINNER':
        setState((prev) => ({
          ...prev,
          showWinnerAnnouncement: false,
          currentWinner: null,
        }));
        break;

      case 'CONFIRM_WINNER_RECEIVED':
        setState((prev) => {
          if (prev.currentWinner) {
            // Persist status update
            if (isLocal) {
              WinnerService.updateStatus(prev.currentWinner.employeeCode, 'pending_award');
            }
          }
          return {
            ...prev,
            showWinnerAnnouncement: false,
            prizeWinners: prev.prizeWinners.map((w) =>
              w.employeeCode === prev.currentWinner?.employeeCode
                ? { ...w, status: 'pending_award' as WinnerStatus }
                : w
            ),
            currentWinner: null,
            gameDigits: [null, null, null],
            gameActivePosition: 0,
          };
        });
        break;

      case 'MARK_WINNER_ABSENT': {
        const newStatus: WinnerStatus = 'absent';
        setState((prev) => {
          if (prev.currentWinner && isLocal) {
            WinnerService.updateStatus(prev.currentWinner.employeeCode, newStatus);
          }
          return {
            ...prev,
            showWinnerAnnouncement: false,
            prizeWinners: prev.prizeWinners.map((w) =>
              w.employeeCode === prev.currentWinner?.employeeCode
                ? { ...w, status: newStatus }
                : w
            ),
            currentWinner: null,
            gameDigits: [null, null, null],
            gameActivePosition: 0,
          };
        });
        break;
      }

      default:
        // Handle any unhandled message types
        console.warn('[ControlContext] Unhandled message type:', (msg as ControlMessage).type);
    }
  }, []);

  /**
   * Initialize channel subscription
   */
  useEffect(() => {
    // Initialize channel
    ChannelService.init();

    // Subscribe to remote messages
    const unsubscribe = ChannelService.subscribe((msg) => {
      processMessage(msg, false);
    });

    // Initialize storage sync
    const cleanupStorageSync = StorageService.initSync();

    return () => {
      unsubscribe();
      cleanupStorageSync();
      ChannelService.close();
    };
  }, [processMessage]);

  /**
   * Send command - broadcasts to all tabs and processes locally
   */
  const sendCommand = useCallback((msg: ControlMessage) => {
    // Process locally first (with persistence)
    processMessage(msg, true);
    
    // Broadcast to other tabs
    ChannelService.send(msg);
  }, [processMessage]);

  return (
    <ControlContext.Provider value={{ state, sendCommand, lastCommand }}>
      {children}
    </ControlContext.Provider>
  );
};
