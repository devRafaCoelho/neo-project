import { Box, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useBrandTheme } from '../../context/BrandThemeContext';

/**
 * Tooltip customizado para gráficos Recharts.
 * @param {object} props - props do Recharts (active, payload, label)
 * @param {(label: string) => string} [titleFormatter]
 * @param {(value: number, entry: object) => string} [formatValue]
 * @param {Record<string, string>} [seriesLabels] - rótulos por dataKey
 * @param {boolean} [hideZero] - oculta séries com valor 0
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  titleFormatter = (l) => l,
  formatValue = (v) => (v != null ? String(v) : '—'),
  seriesLabels = {},
  hideZero = false,
}) {
  const theme = useTheme();
  const { scheme } = useBrandTheme();

  if (!active || !payload?.length) return null;

  const items = payload.filter((entry) => {
    if (!hideZero) return true;
    const v = Number(entry.value);
    return !Number.isNaN(v) && v !== 0;
  });

  if (!items.length) return null;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: `0 10px 28px rgba(${scheme.shadowRgb}, 0.14)`,
        p: 1.75,
        minWidth: 168,
        maxWidth: 300,
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="primary.dark"
        sx={{ lineHeight: 1.3, mb: 1 }}
      >
        {titleFormatter(label)}
      </Typography>
      <Divider sx={{ mb: 1.25 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {items.map((entry) => {
          const seriesName =
            seriesLabels[entry.dataKey]
            ?? entry.name
            ?? entry.dataKey;
          const color = entry.color ?? entry.fill ?? theme.palette.primary.main;

          return (
            <Box
              key={`${entry.dataKey}-${seriesName}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: entry.dataKey?.includes('line') ? 0.5 : '50%',
                    bgcolor: color,
                    flexShrink: 0,
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                  }}
                />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {seriesName}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={700}
                color="text.primary"
                sx={{ whiteSpace: 'nowrap' }}
              >
                {formatValue(entry.value, entry)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
