/**
 * Channel Service
 * Manages BroadcastChannel for cross-tab communication
 * Handles message routing and command dispatching
 */

import { CHANNEL_NAME } from './storage.keys';
import { PrizeWinner, WinnerStatus } from './winner.service';

/**
 * All possible control messages
 */
export type ControlMessage =
    // Effect controls
    | { type: 'TRIGGER_CONFETTI'; payload: { level: number } }
    | { type: 'RESET' }

    // Prize controls
    | { type: 'SET_PRIZE'; payload: { prizeId: string } }
    | { type: 'SET_WINNER'; payload: { employeeCode: string } }
    | { type: 'SET_CURRENT_PRIZE'; payload: { prizeId: string } }
    | { type: 'SET_EXCLUDED_CODES'; payload: { codes: string[] } }

    // Winner controls
    | { type: 'ADD_WINNER'; payload: { winner: PrizeWinner } }
    | { type: 'UPDATE_WINNER_STATUS'; payload: { employeeCode: string; status: WinnerStatus } }

    // Game controls
    | { type: 'SET_GAME_DIGIT'; payload: { position: number; value: number | null } }
    | { type: 'SET_GAME_DIGITS'; payload: { digits: (number | null)[] } }
    | { type: 'SET_GAME_ACTIVE_POSITION'; payload: { position: number } }
    | { type: 'RESET_GAME_DIGITS' }
    | { type: 'LOCK_GAME_INPUT'; payload: { locked: boolean } }
    | { type: 'SHOW_NOT_FOUND_ALERT'; payload: { code: string } }
    | { type: 'HIDE_NOT_FOUND_ALERT' }

    // Winner announcement
    | { type: 'SHOW_WINNER'; payload: { winner: PrizeWinner } }
    | { type: 'HIDE_WINNER' }
    | { type: 'CONFIRM_WINNER_RECEIVED' }
    | { type: 'MARK_WINNER_ABSENT' }
    | { type: 'MARK_WINNER_DECLINED' };

export type MessageHandler = (message: ControlMessage) => void;

// Singleton channel instance
let channel: BroadcastChannel | null = null;
const handlers: Set<MessageHandler> = new Set();

/**
 * Get or create the broadcast channel
 */
const getChannel = (): BroadcastChannel => {
    if (!channel) {
        channel = new BroadcastChannel(CHANNEL_NAME);

        channel.onmessage = (event: MessageEvent) => {
            const message = event.data as ControlMessage;
            handlers.forEach(handler => {
                try {
                    handler(message);
                } catch (error) {
                    console.error('[ChannelService] Handler error:', error);
                }
            });
        };
    }
    return channel;
};

/**
 * Initialize the channel service
 * Call this at app startup
 */
export const init = (): void => {
    getChannel();
};

/**
 * Send a message to all tabs (including self via handlers)
 */
export const send = (message: ControlMessage): void => {
    getChannel().postMessage(message);

    // Also trigger local handlers for the sender
    handlers.forEach(handler => {
        try {
            handler(message);
        } catch (error) {
            console.error('[ChannelService] Local handler error:', error);
        }
    });
};

/**
 * Subscribe to incoming messages
 * Returns unsubscribe function
 */
export const subscribe = (handler: MessageHandler): (() => void) => {
    handlers.add(handler);

    return () => {
        handlers.delete(handler);
    };
};

/**
 * Close the channel and clean up
 */
export const close = (): void => {
    if (channel) {
        channel.close();
        channel = null;
    }
    handlers.clear();
};

// Export as namespace-like object
export const ChannelService = {
    init,
    send,
    subscribe,
    close,
};

export default ChannelService;
