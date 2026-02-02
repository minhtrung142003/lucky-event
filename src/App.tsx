import { Theme, ThemeProvider } from '@emotion/react'; // Rebuild trigger
import { createTheme, CssBaseline } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Routes } from 'react-router-dom';
import { MODE, STYLE } from './common/constant';
import { GlobalReduxState } from './redux/store.interface';
import { renderRoutes } from './router/render.route';
import { routes } from './router/route.route';
import { OPACITY } from './common/constant/opacity.constant';
import { LuckyDrawProvider } from './context/lucky-draw.context';
import { EffectsProvider } from './context/effects.context';

// Preload heavy images at app startup to avoid blank screen on first navigation
import backgroundImage from './assets/images/figma/background.png';

// Preload function - starts loading immediately when app mounts
const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

export default function App() {
  const system = useSelector((state: GlobalReduxState) => state.system);

  // Preload heavy background image on app mount
  React.useEffect(() => {
    preloadImage(backgroundImage);
  }, []);

  const theme = createTheme({
    ...MODE[system.mode],
    ...MODE.OTHER,
    components: {
      MuiStack: {
        styleOverrides: {
          root: { gap: STYLE.PADDING_GAP_LAYOUT },
        },
      },
      MuiButton: {
        defaultProps: {
          size: 'medium',
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            '&.Mui-disabled': {
              borderColor: MODE[system.mode].palette.divider,
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: MODE[system.mode].palette.background.paper,
            color: MODE[system.mode].palette.text.primary,
            boxShadow: MODE[system.mode].shadows[1],
            padding: STYLE.PADDING_GAP_ITEM,
            margin: `5px !important`,
            borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
            maxWidth: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
          fullWidth: true,
        },
        styleOverrides: {
          root: {
            '& fieldset': {
              borderColor: MODE[system.mode].palette.divider,
              borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: `${MODE[system.mode].palette.divider}${OPACITY[30]}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontWeight: 'unset',
            boxShadow: 'none',
            border: 'none',
            '&:first-of-type': {
              borderTopLeftRadius: STYLE.BORDER_RADIUS_ELEMENT,
              borderBottomLeftRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
            '&:last-of-type': {
              borderTopRightRadius: STYLE.BORDER_RADIUS_ELEMENT,
              borderBottomRightRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
          },
        },
      },
    },
  } as unknown as Theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LuckyDrawProvider>
        <EffectsProvider>
          <Routes>{renderRoutes(routes)}</Routes>
        </EffectsProvider>
      </LuckyDrawProvider>
    </ThemeProvider>
  );
}
