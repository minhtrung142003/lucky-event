import { ThemeOptions } from '@mui/material';
import { Mode } from '../enums/mode.enum';

// Premium Gaming Aesthetic with Neon Cyan/Purple accents
export const dark = {
  palette: {
    mode: Mode.DARK,
    primary: {
      main: '#00d9ff', // Neon Cyan - primary accent
      light: '#33e6ff', // Brighter cyan
      dark: '#00b3cc', // Darker cyan
      contrastText: '#0a0e27', // Dark navy for contrast
    },
    secondary: {
      main: '#c000ff', // Vibrant purple
      light: '#d933ff', // Bright purple
      dark: '#9900cc', // Deep purple
      contrastText: '#0a0e27', // Dark navy for contrast
    },
    error: {
      main: '#ff006e', // Hot pink/red
      light: '#ff3385', // Bright pink
      dark: '#cc0055', // Deep red-pink
      contrastText: '#0a0e27',
    },
    warning: {
      main: '#ffb300', // Golden orange
      light: '#ffc733', // Bright gold
      dark: '#cc9000', // Deep gold
      contrastText: '#0a0e27',
    },
    info: {
      main: '#00d9ff', // Cyan (same as primary)
      light: '#33e6ff',
      dark: '#00b3cc',
      contrastText: '#0a0e27',
    },
    success: {
      main: '#00ff88', // Bright lime
      light: '#33ffaa', // Brighter lime
      dark: '#00cc66', // Deep lime
      contrastText: '#0a0e27',
    },

    text: {
      primary: '#f0f0f5', // Near white with blue tint
      secondary: '#9ca3af', // Light gray
      disabled: '#4b5563', // Dark gray
    },
    divider: '#1e293b', // Dark slate
    action: {
      active: '#9ca3af',
      hover: '#1e1e3f', // Slight purple tint
      hoverOpacity: 0.08,
      selected: 'rgba(0, 217, 255, 0.12)',
      selectedOpacity: 'none',
      disabled: '#1e293b',
      disabledBackground: '#2d3748',
      disabledOpacity: 0,
      focus: 'rgba(0, 217, 255, 0.12)',
      focusOpacity: 0,
      activatedOpacity: 0,
    },
    background: {
      paper: '#0f1419', // Deep navy
      default: '#0a0e27', // Very dark navy with purple tint
    },
  },
  shadows: [
    'none',
    '0 0 20px rgba(0, 217, 255, 0.15), 0 0 40px rgba(192, 0, 255, 0.1), 0 8px 16px rgba(0, 0, 0, 0.3)',
    '0 0 30px rgba(0, 217, 255, 0.2), 0 0 60px rgba(192, 0, 255, 0.12), 0 12px 24px rgba(0, 0, 0, 0.4)',
    '0 0 30px rgba(0, 217, 255, 0.2), 0 0 60px rgba(192, 0, 255, 0.12), 0 12px 24px rgba(0, 0, 0, 0.4)',
    '0 0 40px rgba(0, 217, 255, 0.25), 0 0 80px rgba(192, 0, 255, 0.15), 0 16px 32px rgba(0, 0, 0, 0.5)',
    '0 0 40px rgba(0, 217, 255, 0.25), 0 0 80px rgba(192, 0, 255, 0.15), 0 16px 32px rgba(0, 0, 0, 0.5)',
    '0 0 50px rgba(0, 217, 255, 0.3), 0 0 100px rgba(192, 0, 255, 0.2), 0 20px 40px rgba(0, 0, 0, 0.6)',
    '0 0 50px rgba(0, 217, 255, 0.3), 0 0 100px rgba(192, 0, 255, 0.2), 0 20px 40px rgba(0, 0, 0, 0.6)',
    '0 0 60px rgba(0, 217, 255, 0.35), 0 0 120px rgba(192, 0, 255, 0.25), 0 24px 48px rgba(0, 0, 0, 0.7)',
    '0 0 60px rgba(0, 217, 255, 0.35), 0 0 120px rgba(192, 0, 255, 0.25), 0 24px 48px rgba(0, 0, 0, 0.7)',
    '0 0 70px rgba(0, 217, 255, 0.4), 0 0 140px rgba(192, 0, 255, 0.3), 0 28px 56px rgba(0, 0, 0, 0.8)',
    '0 0 70px rgba(0, 217, 255, 0.4), 0 0 140px rgba(192, 0, 255, 0.3), 0 28px 56px rgba(0, 0, 0, 0.8)',
    '0 0 80px rgba(0, 217, 255, 0.45), 0 0 160px rgba(192, 0, 255, 0.35), 0 32px 64px rgba(0, 0, 0, 0.9)',
    '0 0 80px rgba(0, 217, 255, 0.45), 0 0 160px rgba(192, 0, 255, 0.35), 0 32px 64px rgba(0, 0, 0, 0.9)',
    '0 0 90px rgba(0, 217, 255, 0.5), 0 0 180px rgba(192, 0, 255, 0.4), 0 36px 72px rgba(0, 0, 0, 0.95)',
    '0 0 90px rgba(0, 217, 255, 0.5), 0 0 180px rgba(192, 0, 255, 0.4), 0 36px 72px rgba(0, 0, 0, 0.95)',
    '0 0 100px rgba(0, 217, 255, 0.55), 0 0 200px rgba(192, 0, 255, 0.45), 0 40px 80px rgba(0, 0, 0, 1)',
    '0 0 100px rgba(0, 217, 255, 0.55), 0 0 200px rgba(192, 0, 255, 0.45), 0 40px 80px rgba(0, 0, 0, 1)',
    '0 0 110px rgba(0, 217, 255, 0.6), 0 0 220px rgba(192, 0, 255, 0.5), 0 44px 88px rgba(0, 0, 0, 1)',
    '0 0 110px rgba(0, 217, 255, 0.6), 0 0 220px rgba(192, 0, 255, 0.5), 0 44px 88px rgba(0, 0, 0, 1)',
    '0 0 120px rgba(0, 217, 255, 0.65), 0 0 240px rgba(192, 0, 255, 0.55), 0 48px 96px rgba(0, 0, 0, 1)',
    '0 0 120px rgba(0, 217, 255, 0.65), 0 0 240px rgba(192, 0, 255, 0.55), 0 48px 96px rgba(0, 0, 0, 1)',
    '0 0 130px rgba(0, 217, 255, 0.7), 0 0 260px rgba(192, 0, 255, 0.6), 0 52px 104px rgba(0, 0, 0, 1)',
    '0 0 130px rgba(0, 217, 255, 0.7), 0 0 260px rgba(192, 0, 255, 0.6), 0 52px 104px rgba(0, 0, 0, 1)',
  ],
};

export const light = {
  palette: {
    mode: Mode.LIGHT,
    primary: {
      main: '#00b3cc', // Darker cyan (lighter backgrounds)
      light: '#00d9ff', // Bright cyan
      dark: '#008099', // Deep cyan
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9900cc', // Deep purple
      light: '#c000ff', // Vibrant purple
      dark: '#7700aa', // Darker purple
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff006e', // Hot pink/red
      light: '#ff3385',
      dark: '#cc0055',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffb300', // Golden orange
      light: '#ffc733',
      dark: '#cc9000',
      contrastText: '#ffffff',
    },
    info: {
      main: '#00b3cc',
      light: '#00d9ff',
      dark: '#008099',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00cc66', // Deep lime
      light: '#00ff88',
      dark: '#009944',
      contrastText: '#ffffff',
    },

    text: {
      primary: '#1a202c', // Dark gray
      secondary: '#4b5563', // Medium gray
      disabled: '#cbd5e1', // Light gray
    },

    divider: '#cbd5e1', // Light border

    action: {
      active: '#4b5563',
      hover: '#f0f4f8', // Very light gray
      hoverOpacity: 0.06,
      selected: 'rgba(0, 179, 204, 0.12)',
      selectedOpacity: 'none',
      disabled: '#cbd5e1',
      disabledBackground: '#e2e8f0',
      disabledOpacity: 0,
      focus: 'rgba(0, 179, 204, 0.12)',
      focusOpacity: 0,
      activatedOpacity: 0,
    },

    background: {
      paper: '#f8fafc', // Almost white with slight blue tint
      default: '#ffffff', // Pure white
    },
  },
  shadows: [
    'none',
    '0 0 15px rgba(0, 179, 204, 0.1), 0 0 30px rgba(192, 0, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08)',
    '0 0 20px rgba(0, 179, 204, 0.12), 0 0 40px rgba(192, 0, 255, 0.08), 0 8px 16px rgba(0, 0, 0, 0.1)',
    '0 0 20px rgba(0, 179, 204, 0.12), 0 0 40px rgba(192, 0, 255, 0.08), 0 8px 16px rgba(0, 0, 0, 0.1)',
    '0 0 25px rgba(0, 179, 204, 0.15), 0 0 50px rgba(192, 0, 255, 0.1), 0 12px 20px rgba(0, 0, 0, 0.12)',
    '0 0 25px rgba(0, 179, 204, 0.15), 0 0 50px rgba(192, 0, 255, 0.1), 0 12px 20px rgba(0, 0, 0, 0.12)',
    '0 0 30px rgba(0, 179, 204, 0.18), 0 0 60px rgba(192, 0, 255, 0.12), 0 16px 24px rgba(0, 0, 0, 0.15)',
    '0 0 30px rgba(0, 179, 204, 0.18), 0 0 60px rgba(192, 0, 255, 0.12), 0 16px 24px rgba(0, 0, 0, 0.15)',
    '0 0 35px rgba(0, 179, 204, 0.2), 0 0 70px rgba(192, 0, 255, 0.15), 0 20px 32px rgba(0, 0, 0, 0.18)',
    '0 0 35px rgba(0, 179, 204, 0.2), 0 0 70px rgba(192, 0, 255, 0.15), 0 20px 32px rgba(0, 0, 0, 0.18)',
    '0 0 40px rgba(0, 179, 204, 0.22), 0 0 80px rgba(192, 0, 255, 0.18), 0 24px 40px rgba(0, 0, 0, 0.2)',
    '0 0 40px rgba(0, 179, 204, 0.22), 0 0 80px rgba(192, 0, 255, 0.18), 0 24px 40px rgba(0, 0, 0, 0.2)',
    '0 0 45px rgba(0, 179, 204, 0.25), 0 0 90px rgba(192, 0, 255, 0.2), 0 28px 48px rgba(0, 0, 0, 0.22)',
    '0 0 45px rgba(0, 179, 204, 0.25), 0 0 90px rgba(192, 0, 255, 0.2), 0 28px 48px rgba(0, 0, 0, 0.22)',
    '0 0 50px rgba(0, 179, 204, 0.28), 0 0 100px rgba(192, 0, 255, 0.22), 0 32px 56px rgba(0, 0, 0, 0.25)',
    '0 0 50px rgba(0, 179, 204, 0.28), 0 0 100px rgba(192, 0, 255, 0.22), 0 32px 56px rgba(0, 0, 0, 0.25)',
    '0 0 55px rgba(0, 179, 204, 0.3), 0 0 110px rgba(192, 0, 255, 0.25), 0 36px 64px rgba(0, 0, 0, 0.28)',
    '0 0 55px rgba(0, 179, 204, 0.3), 0 0 110px rgba(192, 0, 255, 0.25), 0 36px 64px rgba(0, 0, 0, 0.28)',
    '0 0 60px rgba(0, 179, 204, 0.32), 0 0 120px rgba(192, 0, 255, 0.28), 0 40px 72px rgba(0, 0, 0, 0.3)',
    '0 0 60px rgba(0, 179, 204, 0.32), 0 0 120px rgba(192, 0, 255, 0.28), 0 40px 72px rgba(0, 0, 0, 0.3)',
    '0 0 65px rgba(0, 179, 204, 0.35), 0 0 130px rgba(192, 0, 255, 0.3), 0 44px 80px rgba(0, 0, 0, 0.32)',
    '0 0 65px rgba(0, 179, 204, 0.35), 0 0 130px rgba(192, 0, 255, 0.3), 0 44px 80px rgba(0, 0, 0, 0.32)',
    '0 0 70px rgba(0, 179, 204, 0.38), 0 0 140px rgba(192, 0, 255, 0.32), 0 48px 88px rgba(0, 0, 0, 0.35)',
    '0 0 70px rgba(0, 179, 204, 0.38), 0 0 140px rgba(192, 0, 255, 0.32), 0 48px 88px rgba(0, 0, 0, 0.35)',
  ],
};

export const OTHER: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 900,
      letterSpacing: 2,
      fontSize: '4rem',
      textShadow: '0 0 20px rgba(0, 217, 255, 0.3), 0 0 40px rgba(192, 0, 255, 0.15)',
      background: 'linear-gradient(135deg, #00d9ff 0%, #c000ff 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 900,
      letterSpacing: 2,
      fontSize: '2.5rem',
      textShadow: '0 0 15px rgba(0, 217, 255, 0.25), 0 0 30px rgba(192, 0, 255, 0.12)',
      background: 'linear-gradient(135deg, #00d9ff 0%, #c000ff 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 800,
      letterSpacing: 1.5,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: 1,
    },
    h5: {
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: 1,
    },
    h6: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: 16,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body2: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    caption: {
      fontWeight: 500,
      fontSize: 12,
    },
    overline: {
      textTransform: 'none',
      fontWeight: 300,
      fontSize: 12,
    },
  },
};
