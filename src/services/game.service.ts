/**
 * Game Service
 * Manages game state (non-persistent, in-memory only)
 * Game state resets on page reload - by design
 */

export interface GameState {
    digits: (number | null)[]; // 3 digits for lottery code [null, null, null]
    activePosition: number; // Current position being edited (0-2)
    isInputLocked: boolean; // Lock input on 2026 page
    isCandidateNotFound: boolean; // Flag for employee not found flow
    notFoundCode: string | null; // Code that was not found
}

/**
 * Default game state
 */
export const DEFAULT_GAME_STATE: GameState = {
    digits: [null, null, null],
    activePosition: 0,
    isInputLocked: true, // Default locked, only control page can input
    isCandidateNotFound: false,
    notFoundCode: null,
};

/**
 * Get default game state
 */
export const getDefaults = (): GameState => {
    return { ...DEFAULT_GAME_STATE };
};

/**
 * Get all digits
 */
export const getDigits = (state: GameState): (number | null)[] => {
    return [...state.digits];
};

/**
 * Set a single digit at position
 */
export const setDigit = (
    state: GameState,
    position: number,
    value: number | null
): GameState => {
    if (position < 0 || position > 4) {
        console.warn(`[GameService] Invalid position: ${position}`);
        return state;
    }

    const newDigits = [...state.digits];
    newDigits[position] = value;
    return { ...state, digits: newDigits };
};

/**
 * Set all digits at once
 */
export const setDigits = (
    state: GameState,
    digits: (number | null)[]
): GameState => {
    if (digits.length !== 5) {
        console.warn(`[GameService] Invalid digits length: ${digits.length}`);
        return state;
    }
    return { ...state, digits: [...digits] };
};

/**
 * Get active position
 */
export const getActivePosition = (state: GameState): number => {
    return state.activePosition;
};

/**
 * Set active position
 */
export const setActivePosition = (state: GameState, position: number): GameState => {
    if (position < 1 || position > 4) {
        console.warn(`[GameService] Invalid active position: ${position}`);
        return state;
    }
    return { ...state, activePosition: position };
};

/**
 * Set input locked state
 */
export const setLocked = (state: GameState, locked: boolean): GameState => {
    return { ...state, isInputLocked: locked };
};

/**
 * Set not found alert
 */
export const setNotFoundAlert = (
    state: GameState,
    show: boolean,
    code: string | null = null
): GameState => {
    return {
        ...state,
        isCandidateNotFound: show,
        notFoundCode: show ? code : null,
    };
};

/**
 * Reset game to initial state
 */
export const reset = (): GameState => {
    return getDefaults();
};

/**
 * Reset only the digits (keep other state)
 */
export const resetDigits = (state: GameState): GameState => {
    return {
        ...state,
        digits: [null, null, null],
        activePosition: 0,
    };
};

/**
 * Get the employee code from digits (as string)
 */
export const getEmployeeCode = (state: GameState): string | null => {
    const { digits } = state;

    // Check if all digits are filled
    if (digits.some(d => d === null)) {
        return null;
    }

    return digits.join('');
};

/**
 * Check if game input is complete (all digits filled)
 */
export const isComplete = (state: GameState): boolean => {
    return state.digits.every(d => d !== null);
};

// Export as namespace-like object
export const GameService = {
    getDefaults,
    getDigits,
    setDigit,
    setDigits,
    getActivePosition,
    setActivePosition,
    setLocked,
    setNotFoundAlert,
    reset,
    resetDigits,
    getEmployeeCode,
    isComplete,
    DEFAULT_GAME_STATE,
};

export default GameService;
