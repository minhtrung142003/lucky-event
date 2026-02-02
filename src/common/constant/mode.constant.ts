import { ThemeOptions } from '@mui/material';
import { Mode } from '../enums/mode.enum';

export const dark = {
  palette: {
    mode: Mode.DARK,
    primary: {
      main: '#ff3d00', //
      light: '#ff5019', //
      dark: '#e53600', //
      contrastText: '#0c0c0c', //
    },
    secondary: {
      main: '#bf00e0', //
      light: '#c519e3', //
      dark: '#ab00c9', //
      contrastText: '#0c0c0c', //
    },
    error: {
      main: '#d50000', //
      light: '#d91919', //
      dark: '#bf0000', //
      contrastText: '#0c0c0c', //
    },
    warning: {
      main: '#ffc107', //
      light: '#ffc71f', //
      dark: '#e5ad06', //
      contrastText: '#0c0c0c', //
    },
    info: {
      main: '#105089', //
      light: '#276194', //
      dark: '#0e487b', //
      contrastText: '#0c0c0c', //
    },
    success: {
      main: '#2e7d32', //
      light: '#428a46', //
      dark: '#29702d', //
      contrastText: '#0c0c0c', //
    },

    text: {
      primary: '#fdfdfd', // Text
      secondary: '#787878', // Label bên trên textfield
      disabled: '#606060', // Màu disable của content textfield
    },
    divider: '#1d1d1d', // Border
    action: {
      active: '#787878', // Icon đổ xuống ở TextField select
      hover: '#0c0c0c', //
      hoverOpacity: 0.05, // Độ mờ khi hover vào button outlined
      selected: 'rgba(255, 255, 255, 0.16)',
      selectedOpacity: 'none', // Độ mờ khi select rồi nhưng hover tiếp
      disabled: '#1d1d1d', // Border textfield, content button when disable
      disabledBackground: '#414141', // Background button
      disabledOpacity: 0,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0,
      activatedOpacity: 0,
    },
    background: {
      paper: '#121212', //
      default: '#0e0e0e', //
    },
  },
  shadows: [
    'none',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
  ],
};

export const light = {
  palette: {
    mode: Mode.LIGHT,
    primary: {
      main: '#e04f10', //
      light: '#e36027', //
      dark: '#c8470e', //
      contrastText: '#fdfdfd', //
    },
    secondary: {
      main: '#bf00e0', //
      light: '#c519e3', //
      dark: '#ab00c9', //
      contrastText: '#fdfdfd', //
    },
    error: {
      main: '#d50000', //
      light: '#d91919', //
      dark: '#bf0000', //
      contrastText: '#fdfdfd', //
    },
    warning: {
      main: '#ffc107', //
      light: '#ffc71f', //
      dark: '#e5ad06', //
      contrastText: '#fdfdfd', //
    },
    info: {
      main: '#105089', //
      light: '#276194', //
      dark: '#0e487b', //
      contrastText: '#fdfdfd', //
    },
    success: {
      main: '#2e7d32', //
      light: '#428a46', //
      dark: '#29702d', //
      contrastText: '#fdfdfd', //
    },

    text: {
      primary: '#0c0c0c', // Text
      secondary: '#575757', // Label bên trên textfield
      disabled: '#a7a7a7', // Màu disable của content textfield
    },

    divider: '#e3e3e3', // Border

    action: {
      active: '#575757', // Icon đổ xuống ở TextField select
      hover: '#eaeaea', // Màu hover
      hoverOpacity: 0.05, // Độ mờ khi hover vào button outlined
      selected: 'rgba(0, 0, 0, 0.08)',
      selectedOpacity: 'none', // Độ mờ khi select rồi nhưng hover tiếp
      disabled: '#e3e3e3', // Border textfield, content button when disable
      disabledBackground: '#b7b7b7', // Background button
      disabledOpacity: 0,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0,
      activatedOpacity: 0,
    },

    background: {
      paper: '#fafafa', //
      default: '#ffffff', //
    },
  },
  shadows: [
    'none',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
  ],
};

export const OTHER: ThemeOptions = {
  typography: {
    fontWeightRegular: 400, // Default font weight
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontWeight: 900,
      letterSpacing: 4,
      fontSize: '4rem',
    },
    h2: {
      fontWeight: 900,
      letterSpacing: 4,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 900,
      letterSpacing: 4,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: 4,
    },
    h5: {
      fontSize: 28,
      fontWeight: 900,
      letterSpacing: 4,
    },
    h6: {
      fontSize: 24,
      fontWeight: 550,
      letterSpacing: 1,
    },
    subtitle2: {
      fontWeight: 550,
      fontSize: 16,
    },
    subtitle1: {
      // Use label
      fontWeight: 550,
      fontSize: '1rem',
    },
    body2: {
      fontWeight: 550,
      fontSize: '1rem',
    },
    body1: {
      // Use text
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
