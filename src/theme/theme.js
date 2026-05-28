import { createTheme } from '@mui/material/styles';
import { COLOR_SCHEMES, DEFAULT_COLOR_SCHEME } from './colorSchemes';

/**
 * @param {import('./colorSchemes').ColorSchemeId} [schemeId]
 */
export function createAppTheme(schemeId = DEFAULT_COLOR_SCHEME) {
  const scheme = COLOR_SCHEMES[schemeId] ?? COLOR_SCHEMES.green;
  const { primary, secondary, surfaces, gradient, shadowRgb } = scheme;

  return createTheme({
    palette: {
      mode: 'light',
      primary,
      secondary,
      warning: {
        main: '#E3850D',
      },
      success: {
        main: schemeId === 'green' ? '#5BD38C' : primary.light,
      },
      background: {
        default: surfaces.default,
        paper: '#FFFFFF',
      },
      text: {
        primary: '#3A3735',
        secondary: '#6B6968',
      },
      neutral: {
        light: surfaces.hover,
        main: surfaces.hoverStrong,
        dark: primary.main,
      },
      divider: surfaces.divider,
      brand: surfaces,
    },
    typography: {
      fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '9px 22px',
            fontSize: '0.9rem',
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${gradient.hoverFrom} 0%, ${gradient.hoverTo} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow: `0 2px 12px rgba(${shadowRgb},0.08)`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          InputLabelProps: { shrink: true },
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: `0 1px 8px rgba(${shadowRgb},0.1)`,
            borderRadius: 0,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              backgroundColor: primary.dark,
              color: '#FFFFFF',
              fontWeight: 600,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(even)': {
              backgroundColor: surfaces.muted,
            },
            '&:hover': {
              backgroundColor: `${surfaces.hover} !important`,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
          },
        },
      },
    },
  });
}

export default createAppTheme(DEFAULT_COLOR_SCHEME);
