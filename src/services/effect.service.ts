/**
 * Effect Service
 * Minimal - only confetti level for backward compatibility
 */

export interface EffectSettings {
    confettiLevel: number;
}

export const DEFAULT_EFFECTS: EffectSettings = {
    confettiLevel: 0,
};

export const getDefaults = (): EffectSettings => ({ ...DEFAULT_EFFECTS });

export const EffectService = {
    getDefaults,
    DEFAULT_EFFECTS,
};

export default EffectService;
