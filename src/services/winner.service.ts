/**
 * Winner Service
 * Manages prize winners: CRUD operations, status updates, queries
 * Data is persisted to localStorage and synced across tabs
 */

import { STORAGE_KEYS } from './storage.keys';
import { StorageService } from './storage.service';

// Winner status types
export type WinnerStatus = 'won' | 'pending_award' | 'awarded' | 'absent';

export interface PrizeWinner {
    employeeCode: string;
    employeeName: string;
    prizeId: string;
    status: WinnerStatus;
    timestamp: number;
}

/**
 * Get all winners from storage
 */
export const getAll = (): PrizeWinner[] => {
    return StorageService.load<PrizeWinner[]>(STORAGE_KEYS.WINNERS, []);
};

/**
 * Save all winners to storage (internal use)
 */
const saveAll = (winners: PrizeWinner[]): boolean => {
    return StorageService.save(STORAGE_KEYS.WINNERS, winners);
};

/**
 * Add a new winner
 */
export const add = (winner: Omit<PrizeWinner, 'timestamp'> & { timestamp?: number }): PrizeWinner => {
    const newWinner: PrizeWinner = {
        ...winner,
        timestamp: winner.timestamp ?? Date.now(),
    };

    const winners = getAll();
    winners.push(newWinner);
    saveAll(winners);

    return newWinner;
};

/**
 * Update winner status by employee code
 */
export const updateStatus = (employeeCode: string, status: WinnerStatus): boolean => {
    const winners = getAll();
    const index = winners.findIndex(w => w.employeeCode === employeeCode);

    if (index === -1) {
        console.warn(`[WinnerService] Winner not found: ${employeeCode}`);
        return false;
    }

    winners[index] = { ...winners[index], status };
    return saveAll(winners);
};

/**
 * Remove a winner by employee code
 */
export const remove = (employeeCode: string): boolean => {
    const winners = getAll();
    const filtered = winners.filter(w => w.employeeCode !== employeeCode);

    if (filtered.length === winners.length) {
        console.warn(`[WinnerService] Winner not found for removal: ${employeeCode}`);
        return false;
    }

    return saveAll(filtered);
};

/**
 * Get winners by prize ID
 */
export const getByPrize = (prizeId: string): PrizeWinner[] => {
    return getAll().filter(w => w.prizeId === prizeId);
};

/**
 * Get winners by status
 */
export const getByStatus = (status: WinnerStatus): PrizeWinner[] => {
    return getAll().filter(w => w.status === status);
};

/**
 * Check if an employee has already won any prize
 */
export const isAlreadyWon = (employeeCode: string): boolean => {
    return getAll().some(w => w.employeeCode === employeeCode);
};

/**
 * Check if an employee has won a specific prize
 */
export const hasWonPrize = (employeeCode: string, prizeId: string): boolean => {
    return getAll().some(w => w.employeeCode === employeeCode && w.prizeId === prizeId);
};

/**
 * Get pending awards (winners waiting to receive their prize)
 */
export const getPendingAwards = (): PrizeWinner[] => {
    return getByStatus('pending_award');
};

/**
 * Get awarded winners
 */
export const getAwarded = (): PrizeWinner[] => {
    return getByStatus('awarded');
};

/**
 * Count winners by prize ID
 */
export const countByPrize = (prizeId: string): number => {
    return getByPrize(prizeId).length;
};

/**
 * Count valid winners by prize ID (excluding absent)
 */
export const countValidByPrize = (prizeId: string): number => {
    return getByPrize(prizeId).filter(
        w => w.status !== 'absent'
    ).length;
};

/**
 * Clear all winners (use with caution!)
 */
export const clearAll = (): boolean => {
    return StorageService.remove(STORAGE_KEYS.WINNERS);
};

/**
 * Subscribe to winner changes
 */
export const subscribe = (handler: (winners: PrizeWinner[]) => void): (() => void) => {
    return StorageService.subscribe<PrizeWinner[]>(STORAGE_KEYS.WINNERS, (event) => {
        handler(event.value as PrizeWinner[]);
    });
};

// Export as namespace-like object
export const WinnerService = {
    getAll,
    add,
    updateStatus,
    remove,
    getByPrize,
    getByStatus,
    isAlreadyWon,
    hasWonPrize,
    getPendingAwards,
    getAwarded,
    countByPrize,
    countValidByPrize,
    clearAll,
    subscribe,
};

export default WinnerService;
