const COMPARATORS = {
  string: (a, b) =>
    String(a ?? '').localeCompare(String(b ?? ''), 'pt-BR', { sensitivity: 'base' }),
  number: (a, b) => (Number(a) || 0) - (Number(b) || 0),
  date: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
};

/**
 * @param {Array} rows
 * @param {string|null} orderBy - chave da coluna em columnConfig
 * @param {'asc'|'desc'} order
 * @param {Record<string, { getValue?: (row: object) => unknown, type?: 'string'|'number'|'date', sortable?: boolean }>} columnConfig
 */
export function sortRows(rows, orderBy, order, columnConfig) {
  if (!orderBy || !rows?.length) return [...(rows ?? [])];

  const col = columnConfig[orderBy];
  if (!col || col.sortable === false) return [...rows];

  const compare = COMPARATORS[col.type ?? 'string'];
  const getValue = col.getValue ?? ((row) => row[orderBy]);

  return [...rows].sort((a, b) => {
    const cmp = compare(getValue(a), getValue(b));
    return order === 'asc' ? cmp : -cmp;
  });
}
