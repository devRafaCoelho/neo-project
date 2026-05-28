import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme/theme';
import {
  COLOR_SCHEMES,
  COLOR_SCHEME_STORAGE_KEY,
  DEFAULT_COLOR_SCHEME,
  readStoredColorScheme,
} from '../theme/colorSchemes';

const BrandThemeContext = createContext(null);

export function BrandThemeProvider({ children }) {
  const [schemeId, setSchemeId] = useState(readStoredColorScheme);

  const theme = useMemo(() => createAppTheme(schemeId), [schemeId]);

  const setColorScheme = useCallback((id) => {
    setSchemeId(id);
    try {
      localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      schemeId,
      scheme: COLOR_SCHEMES[schemeId] ?? COLOR_SCHEMES[DEFAULT_COLOR_SCHEME],
      setColorScheme,
    }),
    [schemeId, setColorScheme],
  );

  return (
    <BrandThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </BrandThemeContext.Provider>
  );
}

export function useBrandTheme() {
  const ctx = useContext(BrandThemeContext);
  if (!ctx) {
    throw new Error('useBrandTheme deve ser usado dentro de BrandThemeProvider');
  }
  return ctx;
}
