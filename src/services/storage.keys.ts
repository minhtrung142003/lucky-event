export const STORAGE_KEYS = {
  // Winner data - CRITICAL: Must persist
  WINNERS: 'lucky-event-prize-winners',

  // Settings - CRITICAL: Must persist
  CURRENT_PRIZE: 'lucky-event-current-prize',
  EXCLUSIONS: 'lucky-event-exclusions',

  // Award History - for replay functionality
  AWARD_HISTORY: 'lucky-event-award-history',

  // Legacy keys (for cleanup during migration)
  LEGACY_WINNERS: 'lucky-event-winners',
  LEGACY_STATE: 'lucky-event-state',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// BroadcastChannel name for cross-tab sync
export const CHANNEL_NAME = 'lucky-event-control';
