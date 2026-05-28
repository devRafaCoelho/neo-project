import { ChartTooltipContent } from './ChartTooltip';
import { formatCount, formatCurrencyThousands } from './chartTooltipFormatters';

/** Factory para usar em `<Tooltip content={...} />` do Recharts. */
export function createChartTooltip(options = {}) {
  function ChartTooltip(props) {
    return <ChartTooltipContent {...props} {...options} />;
  }
  return ChartTooltip;
}

export const dashboardOpexTooltip = createChartTooltip({
  titleFormatter: (mes) => `OPEX — ${mes}`,
  formatValue: formatCurrencyThousands,
  seriesLabels: { plano: 'Plano', rev1: 'REV1', real: 'Real' },
});

export const dashboardCapexTooltip = createChartTooltip({
  titleFormatter: (mes) => `CAPEX — ${mes}`,
  formatValue: formatCurrencyThousands,
  seriesLabels: { planejado: 'Planejado', realizado: 'Realizado' },
  hideZero: true,
});

export const contratosStatusTooltip = createChartTooltip({
  titleFormatter: (status) => status,
  formatValue: (v) => formatCount(v),
  seriesLabels: { quantidade: 'Quantidade' },
});

export const contratosVencimentosTooltip = createChartTooltip({
  titleFormatter: (mes) => `Vencimentos em ${mes}`,
  formatValue: (v) => formatCount(v),
  seriesLabels: { quantidade: 'Contratos a vencer' },
});
