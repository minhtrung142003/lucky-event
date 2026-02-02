/**
 * Settings Service
 * Manages application settings: current prize, exclusion list
 * Data is persisted to localStorage and synced across tabs
 */

import { STORAGE_KEYS } from './storage.keys';
import { StorageService } from './storage.service';

/**
 * Get current prize ID
 */
export const getCurrentPrize = (): string | null => {
    return StorageService.load<string | null>(STORAGE_KEYS.CURRENT_PRIZE, null);
};

/**
 * Set current prize ID
 */
export const setCurrentPrize = (prizeId: string | null): boolean => {
    if (prizeId === null) {
        return StorageService.remove(STORAGE_KEYS.CURRENT_PRIZE);
    }
    return StorageService.save(STORAGE_KEYS.CURRENT_PRIZE, prizeId);
};

/**
 * Get all excluded employee codes
 */
export const getExclusions = (): string[] => {
    return StorageService.load<string[]>(STORAGE_KEYS.EXCLUSIONS, []);
};

/**
 * Add an employee code to exclusion list
 */
export const addExclusion = (employeeCode: string): boolean => {
    const exclusions = getExclusions();

    // Avoid duplicates
    if (exclusions.includes(employeeCode)) {
        return true; // Already excluded
    }

    exclusions.push(employeeCode);
    return StorageService.save(STORAGE_KEYS.EXCLUSIONS, exclusions);
};

/**
 * Add multiple employee codes to exclusion list
 */
export const addExclusions = (employeeCodes: string[]): boolean => {
    const exclusions = getExclusions();
    const newExclusions = employeeCodes.filter(code => !exclusions.includes(code));

    if (newExclusions.length === 0) {
        return true; // All already excluded
    }

    return StorageService.save(STORAGE_KEYS.EXCLUSIONS, [...exclusions, ...newExclusions]);
};

/**
 * Remove an employee code from exclusion list
 */
export const removeExclusion = (employeeCode: string): boolean => {
    const exclusions = getExclusions();
    const filtered = exclusions.filter(code => code !== employeeCode);

    if (filtered.length === exclusions.length) {
        return true; // Was not in the list
    }

    return StorageService.save(STORAGE_KEYS.EXCLUSIONS, filtered);
};

/**
 * Set entire exclusion list (replaces existing)
 */
export const setExclusions = (employeeCodes: string[]): boolean => {
    // Remove duplicates
    const unique = [...new Set(employeeCodes)];
    return StorageService.save(STORAGE_KEYS.EXCLUSIONS, unique);
};

/**
 * Check if an employee is excluded
 */
export const isExcluded = (employeeCode: string): boolean => {
    return getExclusions().includes(employeeCode);
};

/**
 * Clear all exclusions
 */
export const clearExclusions = (): boolean => {
    return StorageService.remove(STORAGE_KEYS.EXCLUSIONS);
};

/**
 * Subscribe to current prize changes
 */
export const subscribeCurrentPrize = (
    handler: (prizeId: string | null) => void
): (() => void) => {
    return StorageService.subscribe<string | null>(STORAGE_KEYS.CURRENT_PRIZE, (event) => {
        handler(event.value as string | null);
    });
};

/**
 * Subscribe to exclusion list changes
 */
export const subscribeExclusions = (
    handler: (exclusions: string[]) => void
): (() => void) => {
    return StorageService.subscribe<string[]>(STORAGE_KEYS.EXCLUSIONS, (event) => {
        handler(event.value as string[]);
    });
};

// Export as namespace-like object
export const SettingsService = {
    getCurrentPrize,
    setCurrentPrize,
    getExclusions,
    addExclusion,
    addExclusions,
    removeExclusion,
    setExclusions,
    isExcluded,
    clearExclusions,
    subscribeCurrentPrize,
    subscribeExclusions,
};

export default SettingsService;
