export const COLOR_SCHEME_STORAGE_KEY = 'neo-sai-color-scheme';

export const DEFAULT_COLOR_SCHEME = 'green';

export const COLOR_SCHEME_IDS = ['green', 'blue', 'orange'];

/** @typedef {'green' | 'blue' | 'orange'} ColorSchemeId */

/**
 * @type {Record<ColorSchemeId, {
 *   id: ColorSchemeId;
 *   label: string;
 *   swatch: string;
 *   primary: { main: string; dark: string; light: string; contrastText: string };
 *   secondary: { main: string; contrastText: string };
 *   surfaces: {
 *     default: string;
 *     muted: string;
 *     hover: string;
 *     hoverStrong: string;
 *     accentSoft: string;
 *     chip: string;
 *     dragActive: string;
 *     divider: string;
 *   };
 *   gradient: { from: string; to: string; hoverFrom: string; hoverTo: string };
 *   shadowRgb: string;
 * }>}
 */
export const COLOR_SCHEMES = {
  green: {
    id: 'green',
    label: 'Verde',
    swatch: '#00A443',
    primary: {
      main: '#00A443',
      dark: '#004042',
      light: '#26BF64',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0792E5',
      contrastText: '#FFFFFF',
    },
    surfaces: {
      default: '#F7FAF8',
      muted: '#F0F7F3',
      hover: '#DCEBE1',
      hoverStrong: '#C5DDD0',
      accentSoft: '#F7FCF9',
      chip: '#DCEBE1',
      dragActive: '#F0FAF4',
      divider: '#E0EAE5',
    },
    gradient: {
      from: '#00A443',
      to: '#004042',
      hoverFrom: '#009038',
      hoverTo: '#003035',
    },
    shadowRgb: '0,64,66',
  },
  blue: {
    id: 'blue',
    label: 'Azul',
    swatch: '#0792E5',
    primary: {
      main: '#0792E5',
      dark: '#003D6B',
      light: '#4DB3F0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00A443',
      contrastText: '#FFFFFF',
    },
    surfaces: {
      default: '#F5F9FC',
      muted: '#EBF4FA',
      hover: '#D4E8F5',
      hoverStrong: '#B8D9EF',
      accentSoft: '#F0F7FC',
      chip: '#D4E8F5',
      dragActive: '#E8F4FC',
      divider: '#D6E6F0',
    },
    gradient: {
      from: '#0792E5',
      to: '#003D6B',
      hoverFrom: '#0680C8',
      hoverTo: '#002F52',
    },
    shadowRgb: '0,61,107',
  },
  orange: {
    id: 'orange',
    label: 'Laranja',
    swatch: '#E3850D',
    primary: {
      main: '#E3850D',
      dark: '#8B4E08',
      light: '#F0A845',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0792E5',
      contrastText: '#FFFFFF',
    },
    surfaces: {
      default: '#FBF8F5',
      muted: '#F8F0E8',
      hover: '#F0E0D0',
      hoverStrong: '#E5CDB8',
      accentSoft: '#FDF9F5',
      chip: '#F0E0D0',
      dragActive: '#FBF3EA',
      divider: '#EDE4DA',
    },
    gradient: {
      from: '#E3850D',
      to: '#8B4E08',
      hoverFrom: '#CC770B',
      hoverTo: '#6D3E06',
    },
    shadowRgb: '139,78,8',
  },
};

export function isValidColorSchemeId(value) {
  return COLOR_SCHEME_IDS.includes(value);
}

export function readStoredColorScheme() {
  try {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
    if (isValidColorSchemeId(stored)) return stored;
  } catch {
    /* localStorage indisponível */
  }
  return DEFAULT_COLOR_SCHEME;
}
