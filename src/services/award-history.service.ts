/**
 * Award History Service
 * Manages saving and retrieving award ceremony history for replay functionality
 */

import { STORAGE_KEYS } from './storage.keys';
import { AwardHistoryEntry, AwardHistoryWinner } from '../common/data/prize.interface';

/**
 * Get all award history entries
 */
export const getAwardHistory = (): AwardHistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AWARD_HISTORY);
    if (!stored) return [];
    return JSON.parse(stored) as AwardHistoryEntry[];
  } catch (error) {
    console.error('[AwardHistoryService] Failed to load history:', error);
    return [];
  }
};

/**
 * Save a new award session to history
 */
export const saveAwardSession = (params: {
  prizeId: string;
  prizeName: string;
  prizeDescription: string;
  winners: AwardHistoryWinner[];
}): AwardHistoryEntry | null => {
  try {
    if (params.winners.length === 0) {
      console.warn('[AwardHistoryService] No winners to save');
      return null;
    }

    const history = getAwardHistory();
    const newEntry: AwardHistoryEntry = {
      id: `award-${Date.now()}`,
      prizeId: params.prizeId,
      prizeName: params.prizeName,
      prizeDescription: params.prizeDescription,
      timestamp: Date.now(),
      winners: params.winners,
    };

    history.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.AWARD_HISTORY, JSON.stringify(history));

    console.log('[AwardHistoryService] Saved award session:', newEntry.id);
    return newEntry;
  } catch (error) {
    console.error('[AwardHistoryService] Failed to save session:', error);
    return null;
  }
};

/**
 * Get a specific award entry by ID
 */
export const getAwardById = (id: string): AwardHistoryEntry | null => {
  const history = getAwardHistory();
  return history.find(entry => entry.id === id) || null;
};

/**
 * Delete a specific award entry
 */
export const deleteAwardEntry = (id: string): boolean => {
  try {
    const history = getAwardHistory();
    const filtered = history.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEYS.AWARD_HISTORY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('[AwardHistoryService] Failed to delete entry:', error);
    return false;
  }
};

/**
 * Clear all award history
 */
export const clearAwardHistory = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AWARD_HISTORY);
    return true;
  } catch (error) {
    console.error('[AwardHistoryService] Failed to clear history:', error);
    return false;
  }
};

/**
 * Get history entries grouped by prize
 */
export const getHistoryByPrize = (): Map<string, AwardHistoryEntry[]> => {
  const history = getAwardHistory();
  const grouped = new Map<string, AwardHistoryEntry[]>();

  history.forEach(entry => {
    const existing = grouped.get(entry.prizeId) || [];
    existing.push(entry);
    grouped.set(entry.prizeId, existing);
  });

  return grouped;
};
