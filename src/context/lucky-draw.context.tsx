import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { employees, Employee, prizes2026, Prize } from '../common/data';
import { LOTTERY_CODE_LENGTH } from '../pages/lucky-draw-2026/types';
import { saveAwardSession, getAwardById } from '../services/award-history.service';
import { AwardHistoryEntry } from '../common/data/prize.interface';

export type WinnerStatus = 'won' | 'pending_award' | 'awarded' | 'absent';

export interface PrizeWinner {
  employeeCode: string;
  employeeName: string;
  department: string;
  part: string;
  prizeId: string;
  status: WinnerStatus;
  timestamp: number;
  lotteryCode: string;
}

export interface LuckyDrawState {
  currentPrizeId: string | null;
  digits: (number | null)[]; // [null, null, null]
  activePosition: number; // 0-2
  digitRevealed: boolean[]; // [false, false, false]
  remainingCandidates: Employee[];
  matchedEmployee: Employee | null;
  isNotFound: boolean;
  winners: PrizeWinner[];
  excludedCodes: string[];
  announcement: {
    visible: boolean;
    winner: PrizeWinner | null;
  };
  ceremony: {
    isActive: boolean;
    sessionAwardees: PrizeWinner[];
    displayMode: 'drawing' | 'ceremony';
    isReplay: boolean; // true when replaying historical award
    replayData: AwardHistoryEntry | null; // data for replay
  };
}

export type LuckyDrawAction =
  | { type: 'SET_DIGIT'; position: number; value: number }
  | { type: 'UNDO_DIGIT' }
  | { type: 'RESET_DIGITS' }
  | { type: 'SET_PRIZE'; prizeId: string }
  | { type: 'ADD_WINNER'; winner: PrizeWinner }
  | { type: 'UPDATE_WINNER_STATUS'; employeeCode: string; status: WinnerStatus }
  | { type: 'SHOW_ANNOUNCEMENT'; winner: PrizeWinner }
  | { type: 'HIDE_ANNOUNCEMENT' }
  | { type: 'CONFIRM_WINNER'; status: 'received' | 'absent' }
  | { type: 'ADD_EXCLUSION'; code: string }
  | { type: 'REMOVE_EXCLUSION'; code: string }
  | { type: 'SET_EXCLUSIONS'; codes: string[] }
  | { type: 'SYNC_FROM_REMOTE'; state: Partial<LuckyDrawState> }
  | { type: 'RESET_ALL' }
  // Ceremony actions
  | { type: 'START_CEREMONY' }
  | { type: 'END_CEREMONY' }
  | { type: 'COMPLETE_CEREMONY' }
  | { type: 'REMOVE_FROM_SESSION'; employeeCode: string }
  | { type: 'REMOVE_WINNER'; employeeCode: string }
  | { type: 'BACK_TO_DRAWING' }
  | { type: 'REPLAY_CEREMONY'; historyId: string }
  | { type: 'END_REPLAY' }
  // Digit reveal actions
  | { type: 'REVEAL_DIGIT'; position: number }
  // Congratulations action (separate from auto-reveal)
  | { type: 'SHOW_CONGRATULATIONS' };

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  WINNERS: 'lucky-draw-winners',
  CURRENT_PRIZE: 'lucky-draw-current-prize',
  EXCLUSIONS: 'lucky-draw-exclusions',
  ANNOUNCEMENT: 'lucky-draw-announcement',
} as const;

const CHANNEL_NAME = 'lucky-draw-sync';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Filter employees based on entered digits (matching lotteryCode) and exclusions
 */
function filterEmployees(digits: (number | null)[], excludedCodes: Set<string>): Employee[] {
  return employees.filter(emp => {
    // Check if excluded (by employee code, not lottery code)
    if (excludedCodes.has(emp.code)) return false;

    // Check if digits match lottery code
    const lotteryCode = emp.lotteryCode;
    for (let i = 0; i < LOTTERY_CODE_LENGTH; i++) {
      if (digits[i] !== null && lotteryCode[i] !== String(digits[i])) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Compute derived state (candidates, matched employee, not found)
 */
function computeDerivedState(
  digits: (number | null)[],
  winners: PrizeWinner[],
  excludedCodes: string[]
): Pick<LuckyDrawState, 'remainingCandidates' | 'matchedEmployee' | 'isNotFound'> {
  const excluded = new Set([...excludedCodes, ...winners.filter(w => w.status !== 'won').map(w => w.employeeCode)]);

  const candidates = filterEmployees(digits, excluded);

  // Check if all digits are filled
  const allFilled = digits.every(d => d !== null);

  return {
    remainingCandidates: candidates,
    matchedEmployee: candidates.length === 1 ? candidates[0] : null,
    isNotFound: candidates.length === 0,
  };
}

/**
 * Load persisted state from localStorage
 */
function loadPersistedState(): Pick<LuckyDrawState, 'winners' | 'currentPrizeId' | 'excludedCodes' | 'announcement'> {
  try {
    const winnersJson = localStorage.getItem(STORAGE_KEYS.WINNERS);
    const prizeJson = localStorage.getItem(STORAGE_KEYS.CURRENT_PRIZE);
    const exclusionsJson = localStorage.getItem(STORAGE_KEYS.EXCLUSIONS);
    const announcementJson = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT);

    const winners = winnersJson ? JSON.parse(winnersJson) : [];
    const savedPrizeId = prizeJson ? JSON.parse(prizeJson) : null;
    const defaultPrizeId =
      prizes2026.find((p: Prize) => p.id === 'mini_consolation')?.id ??
      [...prizes2026].sort((a: Prize, b: Prize) => a.order - b.order)[0]?.id ??
      null;
    const excludedCodes = exclusionsJson ? JSON.parse(exclusionsJson) : [];
    const announcement = announcementJson ? JSON.parse(announcementJson) : { visible: false, winner: null };

    return {
      winners,
      currentPrizeId: savedPrizeId || defaultPrizeId,
      excludedCodes,
      announcement,
    };
  } catch (error) {
    console.error('[LuckyDrawContext] Failed to load persisted state:', error);
    return {
      winners: [],
      currentPrizeId: null,
      excludedCodes: [],
      announcement: { visible: false, winner: null },
    };
  }
}

/**
 * Save state to localStorage
 */
function persistState(state: LuckyDrawState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(state.winners));
    localStorage.setItem(STORAGE_KEYS.CURRENT_PRIZE, JSON.stringify(state.currentPrizeId));
    localStorage.setItem(STORAGE_KEYS.EXCLUSIONS, JSON.stringify(state.excludedCodes));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(state.announcement));
  } catch (error) {
    console.error('[LuckyDrawContext] Failed to persist state:', error);
  }
}

// ============================================================================
// Initial State
// ============================================================================

function getInitialState(): LuckyDrawState {
  const persisted = loadPersistedState();
  // 3 digits for lottery code (000-999), all null initially
  const digits: (number | null)[] = [null, null, null];

  const derived = computeDerivedState(digits, persisted.winners, persisted.excludedCodes);

  return {
    currentPrizeId: persisted.currentPrizeId,
    digits,
    activePosition: 0, // Start at position 0
    digitRevealed: [false, false, false], // All digits hidden initially
    ...derived,
    winners: persisted.winners,
    excludedCodes: persisted.excludedCodes,
    announcement: persisted.announcement,
    ceremony: {
      isActive: false,
      sessionAwardees: [],
      displayMode: 'drawing',
      isReplay: false,
      replayData: null,
    },
  };
}

// ============================================================================
// Reducer
// ============================================================================

function reducer(state: LuckyDrawState, action: LuckyDrawAction): LuckyDrawState {
  switch (action.type) {
    case 'SET_DIGIT': {
      const { position, value } = action;
      // Valid positions: 0, 1, 2 (3 digits)
      if (position < 0 || position >= LOTTERY_CODE_LENGTH) return state;

      const newDigits = [...state.digits];
      newDigits[position] = value;

      const derived = computeDerivedState(newDigits, state.winners, state.excludedCodes);

      // Auto-advance position if not at end
      const lastPosition = LOTTERY_CODE_LENGTH - 1;
      const nextPosition = position < lastPosition ? position + 1 : lastPosition;

      return {
        ...state,
        digits: newDigits,
        activePosition: nextPosition,
        ...derived,
      };
    }

    case 'UNDO_DIGIT': {
      // Find last filled position
      let lastFilledPos = -1;
      for (let i = LOTTERY_CODE_LENGTH - 1; i >= 0; i--) {
        if (state.digits[i] !== null) {
          lastFilledPos = i;
          break;
        }
      }

      if (lastFilledPos === -1) return state;

      const newDigits = [...state.digits];
      newDigits[lastFilledPos] = null;

      // Reset digitRevealed cho vị trí này và tất cả vị trí sau
      const newRevealed = [...state.digitRevealed];
      for (let i = lastFilledPos; i < LOTTERY_CODE_LENGTH; i++) {
        newRevealed[i] = false;
      }

      const derived = computeDerivedState(newDigits, state.winners, state.excludedCodes);

      return {
        ...state,
        digits: newDigits,
        activePosition: lastFilledPos,
        digitRevealed: newRevealed,
        ...derived,
      };
    }

    case 'RESET_DIGITS': {
      // Reset to 3 null digits
      const newDigits: (number | null)[] = [null, null, null];
      const derived = computeDerivedState(newDigits, state.winners, state.excludedCodes);

      return {
        ...state,
        digits: newDigits,
        activePosition: 0, // Start at position 0
        digitRevealed: [false, false, false], // Hide all digits
        ...derived,
        announcement: { visible: false, winner: null },
      };
    }

    case 'SET_PRIZE': {
      return {
        ...state,
        currentPrizeId: action.prizeId,
      };
    }

    case 'ADD_WINNER': {
      const newWinners = [...state.winners, action.winner];
      const derived = computeDerivedState(state.digits, newWinners, state.excludedCodes);

      return {
        ...state,
        winners: newWinners,
        ...derived,
      };
    }

    case 'REMOVE_WINNER': {
      const newWinners = state.winners.filter(w => w.employeeCode !== action.employeeCode);
      const derived = computeDerivedState(state.digits, newWinners, state.excludedCodes);

      // Also remove from session if present
      const newSessionAwardees = state.ceremony.sessionAwardees.filter(w => w.employeeCode !== action.employeeCode);

      return {
        ...state,
        winners: newWinners,
        ...derived,
        ceremony: {
          ...state.ceremony,
          sessionAwardees: newSessionAwardees,
        },
      };
    }

    case 'UPDATE_WINNER_STATUS': {
      const newWinners = state.winners.map(w => (w.employeeCode === action.employeeCode ? { ...w, status: action.status } : w));

      return {
        ...state,
        winners: newWinners,
      };
    }

    case 'SHOW_ANNOUNCEMENT': {
      return {
        ...state,
        announcement: {
          visible: true,
          winner: action.winner,
        },
      };
    }

    case 'HIDE_ANNOUNCEMENT': {
      return {
        ...state,
        announcement: {
          visible: false,
          winner: null,
        },
      };
    }

    case 'CONFIRM_WINNER': {
      if (!state.announcement.winner) return state;

      const statusMap: Record<'received' | 'absent', WinnerStatus> = {
        received: 'pending_award',
        absent: 'absent',
      };

      const newStatus = statusMap[action.status];
      const confirmedWinner = state.announcement.winner;

      const newWinners = state.winners.map(w => (w.employeeCode === confirmedWinner.employeeCode ? { ...w, status: newStatus } : w));

      // Add to session awardees (for ceremony display)
      const updatedWinner = { ...confirmedWinner, status: newStatus };
      const newSessionAwardees = [...state.ceremony.sessionAwardees.filter(w => w.employeeCode !== confirmedWinner.employeeCode), updatedWinner];

      // Reset to 3 null digits after confirming winner
      const newDigits: (number | null)[] = [null, null, null];
      const derived = computeDerivedState(newDigits, newWinners, state.excludedCodes);

      return {
        ...state,
        winners: newWinners,
        digits: newDigits,
        activePosition: 0,
        digitRevealed: [false, false, false], // Reset reveal state
        ...derived,
        announcement: { visible: false, winner: null },
        ceremony: {
          ...state.ceremony,
          displayMode: 'drawing',
          sessionAwardees: newSessionAwardees,
        },
      };
    }

    case 'ADD_EXCLUSION': {
      if (state.excludedCodes.includes(action.code)) return state;
      const newExclusions = [...state.excludedCodes, action.code];
      const derived = computeDerivedState(state.digits, state.winners, newExclusions);

      return {
        ...state,
        excludedCodes: newExclusions,
        ...derived,
      };
    }

    case 'REMOVE_EXCLUSION': {
      const newExclusions = state.excludedCodes.filter(c => c !== action.code);
      const derived = computeDerivedState(state.digits, state.winners, newExclusions);

      return {
        ...state,
        excludedCodes: newExclusions,
        ...derived,
      };
    }

    case 'SET_EXCLUSIONS': {
      const derived = computeDerivedState(state.digits, state.winners, action.codes);

      return {
        ...state,
        excludedCodes: action.codes,
        ...derived,
      };
    }

    case 'SYNC_FROM_REMOTE': {
      // Merge remote state (for cross-tab sync)
      const newState = { ...state, ...action.state };

      // Recompute derived state
      const derived = computeDerivedState(newState.digits, newState.winners, newState.excludedCodes);

      return {
        ...newState,
        ...derived,
      };
    }

    case 'RESET_ALL': {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.WINNERS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PRIZE);
      localStorage.removeItem(STORAGE_KEYS.EXCLUSIONS);
      localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENT);

      return getInitialState();
    }

    // ========================================================================
    // Ceremony Actions
    // ========================================================================

    case 'START_CEREMONY': {
      // Gather all pending_award winners
      let pendingWinners = state.winners
        .filter(w => w.status === 'pending_award' || w.status === 'absent')
        .filter(
          // Only include winners that are still in ceremony session (not yet awarded)
          w => !state.ceremony.sessionAwardees.some(s => s.employeeCode === w.employeeCode && s.status === 'awarded')
        );

      // STRICT MODE: Only allow winners of the CURRENT PRIZE in the ceremony.
      // This prevents mixing winners from different prizes if the user accidentally switched prizes.
      // If logic above (PrizeManagement) works, they shouldn't be able to switch, but this is a safety net.
      // If for some reason state.currentPrizeId is null, allow fallback to first available prize type
      const targetPrizeId = state.currentPrizeId || (pendingWinners.length > 0 ? pendingWinners[0].prizeId : null);

      if (targetPrizeId) {
        pendingWinners = pendingWinners.filter(w => w.prizeId === targetPrizeId);
      }

      return {
        ...state,
        ceremony: {
          isActive: true,
          sessionAwardees: pendingWinners.length > 0 ? pendingWinners : state.ceremony.sessionAwardees,
          displayMode: 'ceremony',
          isReplay: false,
          replayData: null,
        },
      };
    }

    case 'END_CEREMONY': {
      // Just end ceremony without updating statuses
      return {
        ...state,
        ceremony: {
          ...state.ceremony,
          isActive: false,
          displayMode: 'drawing',
        },
      };
    }

    case 'COMPLETE_CEREMONY': {
      // Update all pending_award in session to 'awarded'
      const awardedCodes = new Set(state.ceremony.sessionAwardees.filter(w => w.status === 'pending_award').map(w => w.employeeCode));

      const newWinners = state.winners.map(w => (awardedCodes.has(w.employeeCode) ? { ...w, status: 'awarded' as WinnerStatus } : w));

      // Save to award history (only if not a replay and has pending_award winners)
      if (!state.ceremony.isReplay && state.ceremony.sessionAwardees.length > 0) {
        const currentPrize = prizes2026.find((p: Prize) => p.id === state.currentPrizeId);
        if (currentPrize) {
          const winnersToSave = state.ceremony.sessionAwardees
            .filter(w => w.status === 'pending_award')
            .map(w => ({
              employeeCode: w.employeeCode,
              employeeName: w.employeeName,
              department: w.department,
              part: w.part,
              lotteryCode: w.lotteryCode,
            }));

          if (winnersToSave.length > 0) {
            saveAwardSession({
              prizeId: currentPrize.id,
              prizeName: currentPrize.name,
              prizeDescription: currentPrize.description,
              winners: winnersToSave,
            });
          }
        }
      }

      return {
        ...state,
        winners: newWinners,
        announcement: {
          visible: false,
          winner: null,
        },
        ceremony: {
          isActive: false,
          sessionAwardees: [], // Clear session after completion
          displayMode: 'drawing',
          isReplay: false,
          replayData: null,
        },
      };
    }

    case 'REMOVE_FROM_SESSION': {
      // Remove a person from current ceremony session
      const newSessionAwardees = state.ceremony.sessionAwardees.filter(w => w.employeeCode !== action.employeeCode);

      return {
        ...state,
        ceremony: {
          ...state.ceremony,
          sessionAwardees: newSessionAwardees,
        },
      };
    }

    case 'BACK_TO_DRAWING': {
      // Switch back to drawing mode without ending ceremony
      // Also hide the winner announcement screen
      return {
        ...state,
        announcement: {
          visible: false,
          winner: null,
        },
        ceremony: {
          ...state.ceremony,
          displayMode: 'drawing',
        },
      };
    }

    case 'REPLAY_CEREMONY': {
      // Replay a historical award ceremony
      const historyEntry = getAwardById(action.historyId);
      if (!historyEntry) return state;

      // Convert history winners to PrizeWinner format for display
      const replayAwardees: PrizeWinner[] = historyEntry.winners.map(w => ({
        employeeCode: w.employeeCode,
        employeeName: w.employeeName,
        department: w.department,
        part: w.part,
        lotteryCode: w.lotteryCode,
        prizeId: historyEntry.prizeId,
        status: 'awarded' as WinnerStatus, // Show as awarded in replay
        timestamp: historyEntry.timestamp,
      }));

      return {
        ...state,
        ceremony: {
          isActive: true,
          sessionAwardees: replayAwardees,
          displayMode: 'ceremony',
          isReplay: true,
          replayData: historyEntry,
        },
      };
    }

    case 'END_REPLAY': {
      // End replay mode and go back to normal
      return {
        ...state,
        ceremony: {
          isActive: false,
          sessionAwardees: [],
          displayMode: 'drawing',
          isReplay: false,
          replayData: null,
        },
      };
    }

    // ========================================================================
    // Digit Reveal Actions
    // ========================================================================

    case 'REVEAL_DIGIT': {
      const { position } = action;
      if (position < 0 || position >= LOTTERY_CODE_LENGTH) return state;

      const newRevealed = [...state.digitRevealed];
      newRevealed[position] = true;

      return {
        ...state,
        digitRevealed: newRevealed,
      };
    }

    case 'SHOW_CONGRATULATIONS': {
      // Show the winner announcement screen manually
      // This is called when control clicks "Chúc mừng" button
      if (!state.matchedEmployee || !state.currentPrizeId) return state;

      // Check if winner already exists
      const existingWinner = state.winners.find(w => w.employeeCode === state.matchedEmployee!.code);
      if (existingWinner) {
        // Just show announcement for existing winner
        return {
          ...state,
          announcement: {
            visible: true,
            winner: existingWinner,
          },
        };
      }

      // Create new winner and show announcement
      const newWinner: PrizeWinner = {
        employeeCode: state.matchedEmployee.code,
        employeeName: state.matchedEmployee.name,
        department: state.matchedEmployee.department,
        part: state.matchedEmployee.part,
        prizeId: state.currentPrizeId,
        lotteryCode: state.matchedEmployee.lotteryCode,
        status: 'won',
        timestamp: Date.now(),
      };

      const newWinners = [...state.winners, newWinner];
      const derived = computeDerivedState(state.digits, newWinners, state.excludedCodes);

      return {
        ...state,
        winners: newWinners,
        ...derived,
        announcement: {
          visible: true,
          winner: newWinner,
        },
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

interface LuckyDrawContextType {
  state: LuckyDrawState;
  dispatch: React.Dispatch<LuckyDrawAction>;

  // Convenience actions
  setDigit: (position: number, value: number) => void;
  undoDigit: () => void;
  resetDigits: () => void;
  setPrize: (prizeId: string) => void;
  confirmWinner: (employeeCode: string, employeeName: string, department: string, part: string) => void;
  updateWinnerStatus: (employeeCode: string, status: WinnerStatus) => void;
  addExclusion: (code: string) => void;
  removeExclusion: (code: string) => void;
  removeWinner: (employeeCode: string) => void;
  hideAnnouncement: () => void;
  resetAll: () => void;

  // Ceremony actions
  startCeremony: () => void;
  endCeremony: () => void;
  completeCeremony: () => void;
  removeFromSession: (employeeCode: string) => void;
  backToDrawing: () => void;
  confirmWinnerAction: (status: 'received' | 'absent') => void;

  // Replay actions
  replayCeremony: (historyId: string) => void;
  endReplay: () => void;

  // Digit reveal actions
  revealDigit: (position: number) => void;
  showCongratulations: () => void;
}

const LuckyDrawContext = createContext<LuckyDrawContextType | null>(null);

// ============================================================================
// Provider
// ============================================================================

export const LuckyDrawProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // BroadcastChannel for cross-tab sync
  const channelRef = React.useRef<BroadcastChannel | null>(null);

  // Initialize channel
  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);

    channelRef.current.onmessage = event => {
      const { type, payload } = event.data;

      if (type === 'SYNC_STATE') {
        dispatch({ type: 'SYNC_FROM_REMOTE', state: payload });
      }
    };

    return () => {
      channelRef.current?.close();
    };
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    persistState(state);
  }, [state.winners, state.currentPrizeId, state.excludedCodes, state.announcement]);

  // Broadcast state changes to other tabs
  const broadcastState = useCallback((partialState: Partial<LuckyDrawState>) => {
    channelRef.current?.postMessage({
      type: 'SYNC_STATE',
      payload: partialState,
    });
  }, []);

  // Convenience actions with auto-broadcast
  const setDigit = useCallback((position: number, value: number) => {
    dispatch({ type: 'SET_DIGIT', position, value });
    // KHÔNG broadcast digits - chỉ cập nhật local state
    // Số sẽ được gửi qua show page khi ấn nút "Mở" (revealDigit)
  }, []);

  const undoDigit = useCallback(() => {
    // Tìm vị trí cuối cùng có số
    let lastFilledPos = -1;
    for (let i = LOTTERY_CODE_LENGTH - 1; i >= 0; i--) {
      if (state.digits[i] !== null) {
        lastFilledPos = i;
        break;
      }
    }

    if (lastFilledPos === -1) return;

    dispatch({ type: 'UNDO_DIGIT' });

    // Broadcast để đóng ô số bên show page
    const newDigits = [...state.digits];
    newDigits[lastFilledPos] = null;

    const newRevealed = [...state.digitRevealed];
    for (let i = lastFilledPos; i < LOTTERY_CODE_LENGTH; i++) {
      newRevealed[i] = false;
    }

    broadcastState({
      digits: newDigits,
      digitRevealed: newRevealed,
    });
  }, [state.digits, state.digitRevealed, broadcastState]);

  const resetDigits = useCallback(() => {
    dispatch({ type: 'RESET_DIGITS' });
    // Broadcast reset để show page đóng các ô số lại
    broadcastState({
      digits: [null, null, null],
      digitRevealed: [false, false, false],
    });
  }, [broadcastState]);

  const setPrize = useCallback(
    (prizeId: string) => {
      dispatch({ type: 'SET_PRIZE', prizeId });
      broadcastState({ currentPrizeId: prizeId });
    },
    [broadcastState]
  );

  const confirmWinner = useCallback(
    (employeeCode: string, employeeName: string, department: string, part: string) => {
      if (!state.currentPrizeId) {
        console.warn('[LuckyDrawContext] No prize selected');
        return;
      }

      // Check if already won
      if (state.winners.some(w => w.employeeCode === employeeCode)) {
        console.warn('[LuckyDrawContext] Employee already won');
        return;
      }
      const emp = employees.find(e => e.code === employeeCode);
      const lc = emp?.lotteryCode ?? '';

      const newWinner: PrizeWinner = {
        employeeCode,
        employeeName,
        department,
        part,
        prizeId: state.currentPrizeId,
        lotteryCode: lc,
        status: 'won',
        timestamp: Date.now(),
      };

      // Just add the winner, don't show announcement automatically
      // User needs to click "Chúc mừng" button to show announcement
      dispatch({ type: 'ADD_WINNER', winner: newWinner });

      // Broadcast the new winner to other tabs
      broadcastState({
        winners: [...state.winners, newWinner],
      });
    },
    [state.currentPrizeId, state.winners, broadcastState]
  );

  const hideAnnouncement = useCallback(() => {
    const currentWinner = state.announcement.winner;

    // If we're closing the announcement while the winner status is still 'won' (unconfirmed),
    // remove them from the winners list so they aren't excluded from next draws.
    if (currentWinner && currentWinner.status === 'won') {
      dispatch({ type: 'REMOVE_WINNER', employeeCode: currentWinner.employeeCode });

      const newWinners = state.winners.filter(w => w.employeeCode !== currentWinner.employeeCode);
      broadcastState({
        winners: newWinners,
        announcement: { visible: false, winner: null },
      });
    } else {
      dispatch({ type: 'HIDE_ANNOUNCEMENT' });
      broadcastState({ announcement: { visible: false, winner: null } });
    }
  }, [state.announcement.winner, state.winners, broadcastState, dispatch]);

  const confirmWinnerAction = useCallback(
    (status: 'received' | 'absent') => {
      if (!state.announcement.winner) return;

      const winner = state.announcement.winner;
      const statusMap: Record<'received' | 'absent', WinnerStatus> = {
        received: 'pending_award',
        absent: 'absent',
      };
      const newStatus = statusMap[status];

      dispatch({ type: 'CONFIRM_WINNER', status });

      // Broadcast everything that changed in CONFIRM_WINNER reducer
      const newWinners = state.winners.map(w => (w.employeeCode === winner.employeeCode ? { ...w, status: newStatus } : w));

      broadcastState({
        winners: newWinners,
        digits: [null, null, null],
        activePosition: 0,
        digitRevealed: [false, false, false],
        announcement: { visible: false, winner: null },
        ceremony: {
          ...state.ceremony,
          displayMode: 'drawing',
          sessionAwardees: [...state.ceremony.sessionAwardees.filter(w => w.employeeCode !== winner.employeeCode), { ...winner, status: newStatus }],
        },
      });
    },
    [state.announcement.winner, state.winners, state.ceremony, broadcastState]
  );

  const updateWinnerStatus = useCallback(
    (employeeCode: string, status: WinnerStatus) => {
      dispatch({ type: 'UPDATE_WINNER_STATUS', employeeCode, status });
      // Broadcast updated winners
      const newWinners = state.winners.map(w => (w.employeeCode === employeeCode ? { ...w, status } : w));
      broadcastState({ winners: newWinners });
    },
    [state.winners, broadcastState]
  );

  const addExclusion = useCallback(
    (code: string) => {
      if (state.excludedCodes.includes(code)) return;
      dispatch({ type: 'ADD_EXCLUSION', code });
      broadcastState({ excludedCodes: [...state.excludedCodes, code] });
    },
    [state.excludedCodes, broadcastState]
  );

  const removeExclusion = useCallback(
    (code: string) => {
      dispatch({ type: 'REMOVE_EXCLUSION', code });
      broadcastState({ excludedCodes: state.excludedCodes.filter(c => c !== code) });
    },
    [state.excludedCodes, broadcastState]
  );

  const removeWinner = useCallback(
    (employeeCode: string) => {
      dispatch({ type: 'REMOVE_WINNER', employeeCode });

      const newWinners = state.winners.filter(w => w.employeeCode !== employeeCode);
      const newSessionAwardees = state.ceremony.sessionAwardees.filter(w => w.employeeCode !== employeeCode);

      broadcastState({
        winners: newWinners,
        ceremony: {
          ...state.ceremony,
          sessionAwardees: newSessionAwardees,
        },
      });
    },
    [state.winners, state.ceremony, broadcastState]
  );

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
    broadcastState({
      digits: [null, null, null],
      winners: [],
      excludedCodes: [],
      currentPrizeId: null,
      announcement: { visible: false, winner: null },
      ceremony: { isActive: false, sessionAwardees: [], displayMode: 'drawing', isReplay: false, replayData: null },
      remainingCandidates: [],
      matchedEmployee: null,
      isNotFound: false,
    });
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENT);
  }, [broadcastState]);

  // Ceremony actions
  const startCeremony = useCallback(() => {
    dispatch({ type: 'START_CEREMONY' });

    // Gather pending awardees for broadcast - MUST match reducer logic exactly
    let pendingWinners = state.winners
      .filter(w => w.status === 'pending_award' || w.status === 'absent')
      .filter(w => !state.ceremony.sessionAwardees.some(s => s.employeeCode === w.employeeCode && s.status === 'awarded'));

    // Filter by current prize ID (same as reducer logic)
    const targetPrizeId = state.currentPrizeId || (pendingWinners.length > 0 ? pendingWinners[0].prizeId : null);
    if (targetPrizeId) {
      pendingWinners = pendingWinners.filter(w => w.prizeId === targetPrizeId);
    }

    broadcastState({
      ceremony: {
        isActive: true,
        sessionAwardees: pendingWinners.length > 0 ? pendingWinners : state.ceremony.sessionAwardees,
        displayMode: 'ceremony',
        isReplay: false,
        replayData: null,
      },
    });
  }, [broadcastState, state.winners, state.currentPrizeId, state.ceremony.sessionAwardees]);

  const endCeremony = useCallback(() => {
    dispatch({ type: 'END_CEREMONY' });
    broadcastState({
      ceremony: {
        ...state.ceremony,
        isActive: false,
        displayMode: 'drawing',
      },
    });
  }, [broadcastState, state.ceremony]);

  const completeCeremony = useCallback(() => {
    dispatch({ type: 'COMPLETE_CEREMONY' });
    // Update winners status for broadcast
    const awardedCodes = new Set(state.ceremony.sessionAwardees.filter(w => w.status === 'pending_award').map(w => w.employeeCode));
    const newWinners = state.winners.map(w => (awardedCodes.has(w.employeeCode) ? { ...w, status: 'awarded' as WinnerStatus } : w));
    broadcastState({
      winners: newWinners,
      ceremony: { isActive: false, sessionAwardees: [], displayMode: 'drawing', isReplay: false, replayData: null },
    });
  }, [broadcastState, state.ceremony.sessionAwardees, state.winners]);

  const removeFromSession = useCallback(
    (employeeCode: string) => {
      dispatch({ type: 'REMOVE_FROM_SESSION', employeeCode });
      const newSessionAwardees = state.ceremony.sessionAwardees.filter(w => w.employeeCode !== employeeCode);
      broadcastState({
        ceremony: { ...state.ceremony, sessionAwardees: newSessionAwardees },
      });
    },
    [broadcastState, state.ceremony]
  );

  const backToDrawing = useCallback(() => {
    dispatch({ type: 'BACK_TO_DRAWING' });
    broadcastState({
      ceremony: { ...state.ceremony, displayMode: 'drawing' },
    });
  }, [broadcastState, state.ceremony]);

  // Replay ceremony actions
  const replayCeremony = useCallback(
    (historyId: string) => {
      dispatch({ type: 'REPLAY_CEREMONY', historyId });

      // Get the history entry for broadcast
      const historyEntry = getAwardById(historyId);
      if (!historyEntry) return;

      // Convert history winners to PrizeWinner format for display
      const replayAwardees: PrizeWinner[] = historyEntry.winners.map(w => ({
        employeeCode: w.employeeCode,
        employeeName: w.employeeName,
        department: w.department,
        part: w.part,
        lotteryCode: w.lotteryCode,
        prizeId: historyEntry.prizeId,
        status: 'awarded' as WinnerStatus,
        timestamp: historyEntry.timestamp,
      }));

      broadcastState({
        ceremony: {
          isActive: true,
          sessionAwardees: replayAwardees,
          displayMode: 'ceremony',
          isReplay: true,
          replayData: historyEntry,
        },
      });
    },
    [broadcastState]
  );

  const endReplay = useCallback(() => {
    dispatch({ type: 'END_REPLAY' });
    broadcastState({
      ceremony: {
        isActive: false,
        sessionAwardees: [],
        displayMode: 'drawing',
        isReplay: false,
        replayData: null,
      },
    });
  }, [broadcastState]);

  // Digit reveal actions
  const revealDigit = useCallback(
    (position: number) => {
      dispatch({ type: 'REVEAL_DIGIT', position });

      // Gửi digit tại vị trí này + revealed state qua show page
      const newDigits = [...state.digits];
      const newRevealed = [...state.digitRevealed];
      newRevealed[position] = true;

      broadcastState({
        digits: newDigits,
        digitRevealed: newRevealed,
      });
    },
    [state.digits, state.digitRevealed, broadcastState]
  );

  const showCongratulations = useCallback(() => {
    if (!state.matchedEmployee || !state.currentPrizeId) return;

    dispatch({ type: 'SHOW_CONGRATULATIONS' });

    // Create winner for broadcast
    const existingWinner = state.winners.find(w => w.employeeCode === state.matchedEmployee!.code);
    if (existingWinner) {
      broadcastState({
        announcement: { visible: true, winner: existingWinner },
      });
    } else {
      const newWinner: PrizeWinner = {
        employeeCode: state.matchedEmployee.code,
        employeeName: state.matchedEmployee.name,
        department: state.matchedEmployee.department,
        part: state.matchedEmployee.part,
        prizeId: state.currentPrizeId,
        lotteryCode: state.matchedEmployee.lotteryCode,
        status: 'won',
        timestamp: Date.now(),
      };
      broadcastState({
        winners: [...state.winners, newWinner],
        announcement: { visible: true, winner: newWinner },
      });
    }
  }, [state.matchedEmployee, state.currentPrizeId, state.winners, broadcastState]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      setDigit,
      undoDigit,
      resetDigits,
      setPrize,
      confirmWinner,
      updateWinnerStatus,
      addExclusion,
      removeExclusion,
      removeWinner,
      hideAnnouncement,
      confirmWinnerAction,
      resetAll,
      // Ceremony
      startCeremony,
      endCeremony,
      completeCeremony,
      removeFromSession,
      backToDrawing,
      // Replay
      replayCeremony,
      endReplay,
      // Digit reveal
      revealDigit,
      showCongratulations,
    }),
    [
      state,
      setDigit,
      undoDigit,
      resetDigits,
      setPrize,
      confirmWinner,
      updateWinnerStatus,
      addExclusion,
      removeExclusion,
      removeWinner,
      hideAnnouncement,
      confirmWinnerAction,
      resetAll,
      startCeremony,
      endCeremony,
      completeCeremony,
      removeFromSession,
      backToDrawing,
      replayCeremony,
      endReplay,
      revealDigit,
      showCongratulations,
    ]
  );

  return <LuckyDrawContext.Provider value={value}>{children}</LuckyDrawContext.Provider>;
};

// ============================================================================
// Hook
// ============================================================================

export function useLuckyDraw(): LuckyDrawContextType {
  const context = useContext(LuckyDrawContext);
  if (!context) {
    throw new Error('useLuckyDraw must be used within a LuckyDrawProvider');
  }
  return context;
}

export default LuckyDrawProvider;
