// Banner assets
import bannerDiamond from '../../assets/images/banner-diamond-big.svg';
import bannerDiamondSmall from '../../assets/images/banner-diamond-small.svg';
import banner1 from '../../assets/images/banner-1-big.svg';
import banner1Small from '../../assets/images/banner-1-small.svg';
import banner2 from '../../assets/images/banner-2.svg';
import banner3 from '../../assets/images/banner-3.svg';
import banner4 from '../../assets/images/banner-4-big.svg';
import banner4Small from '../../assets/images/banner-4-small.svg';

// Winner badge assets
import winnerDiamond from '../../assets/images/winner-diamond.svg';
import winner1 from '../../assets/images/winner-1.svg';
import winner2 from '../../assets/images/winner-2.svg';
import winner3 from '../../assets/images/winner-3.svg';
import winner4 from '../../assets/images/winner-4.svg';

// ============================================================================
// Types
// ============================================================================

export type CongratulationScenario = 'encouragement' | 'special' | 'premium';
export type ConfettiLevel = 1 | 2 | 3 | 4;
export type PrizeIdType = 'special' | 'first' | 'second' | 'third' | 'fourth' | 'consolation' | 'mini_consolation';

export interface ScenarioConfig {
  scenario: CongratulationScenario;
  banner: string;
  winnerBadge: string;
  confettiLevels: ConfettiLevel[];
}

// ============================================================================
// Layout Constants
// ============================================================================

export const LUCKY_DRAW_2026_DESIGN_WIDTH = 4000;
export const LUCKY_DRAW_2026_DESIGN_HEIGHT = 1620;
export const LUCKY_DRAW_2026_ASPECT_RATIO = LUCKY_DRAW_2026_DESIGN_WIDTH / LUCKY_DRAW_2026_DESIGN_HEIGHT;

// ============================================================================
// Common Typography Styles (MUI sx)
// ============================================================================

const FONT_FAMILY = 'Montserrat, sans-serif';

export const TYPOGRAPHY_STYLES = {
  pageTitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: 800,
    fontSize: 88,
    lineHeight: 'normal',
    color: '#fff',
    textAlign: 'center' as const,
    textShadow: '8px 0 0 #D5B23E',
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: 700,
    fontSize: 48,
    lineHeight: 'normal',
    color: '#fff',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    textShadow: '0px 0px 2px rgba(255,255,255,1)',
    width: '100%',
  },
  emptyText: {
    fontFamily: FONT_FAMILY,
    fontWeight: 600,
    fontSize: 24,
    lineHeight: 'normal',
    color: '#fff',
  },
} as const;

// ============================================================================
// Common Layout Styles
// ============================================================================

export const LAYOUT_STYLES = {
  glassCard: {
    background: 'rgba(6, 62, 56, 0.24)',
    backdropFilter: 'blur(20px)',
    borderRadius: '32px',
  },
  emptyPlaceholder: {
    padding: '16px 32px',
    borderRadius: '100px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.16))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'max-content',
  },
} as const;

// ============================================================================
// Transition Timing (ms)
// ============================================================================

export const TRANSITION_TIMING = {
  FADE_OUT_CONTENT: 500,
  FADE_OUT_EFFECTS: 1000,
  FADE_OUT_BG: 1000,
  FADE_IN_BG: 800,
  FADE_IN_DECORATIONS: 400,
  FADE_IN_MAIN: 600,
  CONFETTI_DELAY: 1500,
  FADE_IN_TEXT: 500,
  TOTAL_FADE_OUT: 2500,
  TOTAL_FADE_IN: 2500,
} as const;

// ============================================================================
// Prize Config Maps
// ============================================================================

const BANNER_MAP: Record<string, string> = {
  special: bannerDiamondSmall,
  first: banner1Small,
  second: banner2,
  third: banner3,
  fourth: banner4Small,
};

const WINNER_BADGE_MAP: Record<string, string> = {
  special: winnerDiamond,
  first: winner1,
  second: winner2,
  third: winner3,
  fourth: winner4,
};

const MAX_DISPLAY_MAP: Record<string, number> = {
  special: 1,
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
};

export enum GradientColors {
  special = 'rgba(208, 203, 192, 1), rgba(173, 164, 144, 1), rgba(154, 145, 115, 1), rgba(173, 164, 144, 1), rgba(208, 203, 192, 1)',
  first = 'rgba(246, 231, 147, 1), rgba(207, 177, 87, 1), rgba(176, 139, 50, 1), rgba(207, 177, 87, 1), rgba(245, 230, 146, 1)',
  second = 'rgba(179, 191, 198, 1), rgba(143, 165, 177, 1), rgba(115, 139, 152, 1), rgba(143, 165, 177, 1), rgba(198, 207, 212, 1)',
  third = 'rgba(220, 199, 181, 1), rgba(190, 141, 100, 1), rgba(185, 120, 66, 1), rgba(190, 141, 100, 1), rgba(213, 191, 174, 1)',
  fourth = 'rgba(186, 219, 215, 1), rgba(119, 184, 175, 1), rgba(74, 158, 147, 1), rgba(115, 180, 172, 1), rgba(195, 225, 222, 1)',
  consolation = 'rgba(255,255,255,0.16)',
  mini_consolation = 'rgba(255,255,255,0.15)',
}

// ============================================================================
// Helper Functions
// ============================================================================

const ENCOURAGEMENT_PRIZES = ['consolation', 'mini_consolation'];
const SPECIAL_PRIZES = ['special', 'first', 'second'];

export const getScenario = (prizeId: string): CongratulationScenario => {
  if (ENCOURAGEMENT_PRIZES.includes(prizeId)) return 'encouragement';
  if (SPECIAL_PRIZES.includes(prizeId)) return 'special';
  return 'premium';
};

export const getScenarioConfig = (prizeId: string): ScenarioConfig => {
  const scenario = getScenario(prizeId);

  const configs: Record<CongratulationScenario, ScenarioConfig> = {
    encouragement: {
      scenario,
      banner: banner4,
      winnerBadge: winner4,
      confettiLevels: [1],
    },
    special: {
      scenario,
      banner: bannerDiamond,
      winnerBadge: winnerDiamond,
      confettiLevels: [4],
    },
    premium: {
      scenario,
      banner: banner1,
      winnerBadge: winner1,
      confettiLevels: [2, 3],
    },
  };

  return configs[scenario];
};

export const getBannerImage = (prizeId: string): string => BANNER_MAP[prizeId] ?? banner1Small;

export const getWinnerBadge = (prizeId: string): string => WINNER_BADGE_MAP[prizeId] ?? winner1;

export const getMaxDisplay = (prizeId: string): number => MAX_DISPLAY_MAP[prizeId] ?? 999;

export const shouldHideEmployeeDetails = (code: string): boolean => {
  const codeNum = parseInt(code, 10);
  return codeNum >= 6001 && codeNum <= 6008;
};
