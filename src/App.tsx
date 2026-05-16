import { Theme, ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Routes } from 'react-router-dom';
import { MODE, STYLE } from './common/constant';
import { GlobalReduxState } from './redux/store.interface';
import { renderRoutes } from './router/render.route';
import { routes } from './router/route.route';
import { OPACITY } from './common/constant/opacity.constant';

export default function App() {
  const system = useSelector((state: GlobalReduxState) => state.system);

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
              opacity: 0.6,
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: `${MODE[system.mode].palette.background.paper}e6`,
            color: MODE[system.mode].palette.text.primary,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 20px ${MODE[system.mode].palette.primary.main}40, 0 0 40px ${MODE[system.mode].palette.secondary.main}20`,
            padding: STYLE.PADDING_GAP_ITEM,
            margin: `5px !important`,
            borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
            maxWidth: 'none',
            border: `1px solid ${MODE[system.mode].palette.primary.main}50`,
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
            '& .MuiOutlinedInput-root': {
              backgroundColor: `${MODE[system.mode].palette.background.paper}80`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${MODE[system.mode].palette.primary.main}50`,
              transition: 'all 0.3s ease',
              '&:hover': {
                border: `1px solid ${MODE[system.mode].palette.primary.main}80`,
                boxShadow: `0 0 15px ${MODE[system.mode].palette.primary.main}20`,
              },
              '&.Mui-focused': {
                border: `2px solid ${MODE[system.mode].palette.primary.main}`,
                boxShadow: `0 0 20px ${MODE[system.mode].palette.primary.main}40, inset 0 0 10px ${MODE[system.mode].palette.primary.main}15`,
              },
            },
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
            backgroundImage: `linear-gradient(90deg, transparent, ${MODE[system.mode].palette.primary.main}30, transparent)`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontWeight: 'unset',
            boxShadow: 'none',
            border: 'none',
            backgroundColor: `${MODE[system.mode].palette.background.paper}60`,
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${MODE[system.mode].palette.primary.main}20`,
            '&:first-of-type': {
              borderTopLeftRadius: STYLE.BORDER_RADIUS_ELEMENT,
              borderBottomLeftRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
            '&:last-of-type': {
              borderTopRightRadius: STYLE.BORDER_RADIUS_ELEMENT,
              borderBottomRightRadius: STYLE.BORDER_RADIUS_ELEMENT,
            },
          },
          head: {
            fontWeight: 700,
            background: `linear-gradient(135deg, ${MODE[system.mode].palette.primary.main}20, ${MODE[system.mode].palette.secondary.main}15)`,
            boxShadow: `0 0 15px ${MODE[system.mode].palette.primary.main}15`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: `${MODE[system.mode].palette.primary.main}15`,
              boxShadow: `inset 0 0 20px ${MODE[system.mode].palette.primary.main}15, 0 0 20px ${MODE[system.mode].palette.primary.main}20`,
            },
          },
        },
      },
    },
  } as unknown as Theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>{renderRoutes(routes)}</Routes>
    </ThemeProvider>
  );
}
