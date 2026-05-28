import {
  Box, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import { COLOR_SCHEME_IDS, COLOR_SCHEMES } from '../../theme/colorSchemes';
import { useBrandTheme } from '../../context/BrandThemeContext';

export default function BrandColorPicker() {
  const { schemeId, setColorScheme } = useBrandTheme();

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={700}
        sx={{ display: 'block', mb: 1 }}
      >
        Cor do sistema
      </Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={schemeId}
        onChange={(_, value) => {
          if (value) setColorScheme(value);
        }}
        aria-label="Cor do sistema"
        sx={{
          '& .MuiToggleButton-root': {
            py: 1,
            px: 1,
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            gap: 0.75,
            borderColor: 'divider',
          },
        }}
      >
        {COLOR_SCHEME_IDS.map((id) => {
          const scheme = COLOR_SCHEMES[id];
          return (
            <ToggleButton key={id} value={id} aria-label={scheme.label}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: scheme.swatch,
                  border: '2px solid',
                  borderColor: schemeId === id ? 'primary.dark' : 'transparent',
                  boxShadow: schemeId === id ? `0 0 0 1px ${scheme.swatch}` : 'none',
                  flexShrink: 0,
                }}
              />
              {scheme.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}
