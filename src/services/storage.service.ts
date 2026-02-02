/**
 * Base Storage Service
 * Provides type-safe CRUD operations for localStorage with auto-sync via BroadcastChannel
 */

import { CHANNEL_NAME, StorageKey } from './storage.keys';

// Singleton channel instance for sync
let syncChannel: BroadcastChannel | null = null;

const getSyncChannel = (): BroadcastChannel => {
    if (!syncChannel) {
        syncChannel = new BroadcastChannel(`${CHANNEL_NAME}-storage-sync`);
    }
    return syncChannel;
};

export interface StorageChangeEvent<T = unknown> {
    key: StorageKey;
    value: T;
    source: 'local' | 'remote';
}

type StorageChangeHandler<T> = (event: StorageChangeEvent<T>) => void;

const listeners: Map<StorageKey, Set<StorageChangeHandler<unknown>>> = new Map();

/**
 * Load data from localStorage with type safety
 */
export const load = <T>(key: StorageKey, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;
        return JSON.parse(stored) as T;
    } catch (error) {
        console.error(`[StorageService] Failed to load key "${key}":`, error);
        return defaultValue;
    }
};

/**
 * Save data to localStorage and broadcast to other tabs
 */
export const save = <T>(key: StorageKey, value: T): boolean => {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);

        // Broadcast change to other tabs
        getSyncChannel().postMessage({ key, value });

        // Notify local listeners
        notifyListeners(key, value, 'local');

        return true;
    } catch (error) {
        console.error(`[StorageService] Failed to save key "${key}":`, error);
        return false;
    }
};

/**
 * Remove data from localStorage
 */
export const remove = (key: StorageKey): boolean => {
    try {
        localStorage.removeItem(key);

        // Broadcast removal to other tabs
        getSyncChannel().postMessage({ key, value: null, removed: true });

        return true;
    } catch (error) {
        console.error(`[StorageService] Failed to remove key "${key}":`, error);
        return false;
    }
};

/**
 * Clear multiple keys at once
 */
export const clearKeys = (keys: StorageKey[]): void => {
    keys.forEach(key => remove(key));
};

/**
 * Subscribe to changes for a specific key
 */
export const subscribe = <T>(
    key: StorageKey,
    handler: StorageChangeHandler<T>
): (() => void) => {
    if (!listeners.has(key)) {
        listeners.set(key, new Set());
    }

    listeners.get(key)!.add(handler as StorageChangeHandler<unknown>);

    // Return unsubscribe function
    return () => {
        listeners.get(key)?.delete(handler as StorageChangeHandler<unknown>);
    };
};

/**
 * Notify all listeners for a key
 */
const notifyListeners = <T>(key: StorageKey, value: T, source: 'local' | 'remote'): void => {
    const keyListeners = listeners.get(key);
    if (keyListeners) {
        keyListeners.forEach(handler => {
            try {
                handler({ key, value, source });
            } catch (error) {
                console.error(`[StorageService] Listener error for key "${key}":`, error);
            }
        });
    }
};

/**
 * Initialize cross-tab sync listener
 * Call this once at app startup
 */
export const initSync = (): (() => void) => {
    const channel = getSyncChannel();

    const handleMessage = (event: MessageEvent) => {
        const { key, value } = event.data as { key: StorageKey; value: unknown };
        notifyListeners(key, value, 'remote');
    };

    channel.addEventListener('message', handleMessage);

    // Return cleanup function
    return () => {
        channel.removeEventListener('message', handleMessage);
    };
};

// Export as namespace-like object for convenience
export const StorageService = {
    load,
    save,
    remove,
    clearKeys,
    subscribe,
    initSync,
};

export default StorageService;
