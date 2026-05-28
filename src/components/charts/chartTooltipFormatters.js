export function formatCurrencyThousands(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  if (n === 0) return 'R$ 0';
  return `R$ ${n.toLocaleString('pt-BR')} mil`;
}

export function formatCount(value, { singular = 'contrato', plural = 'contratos' } = {}) {
  const n = Number(value) || 0;
  const word = n === 1 ? singular : plural;
  return `${n.toLocaleString('pt-BR')} ${word}`;
}
