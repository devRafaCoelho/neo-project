import { useCallback, useMemo, useState } from 'react';
import { sortRows } from '../utils/tableSort';

/**
 * @param {Array} rows
 * @param {Record<string, { getValue?: (row: object) => unknown, type?: 'string'|'number'|'date', sortable?: boolean }>} columnConfig
 * @param {{ defaultOrderBy?: string|null, defaultOrder?: 'asc'|'desc', onSortChange?: () => void }} [options]
 */
export function useTableSort(rows, columnConfig, options = {}) {
  const {
    defaultOrderBy = null,
    defaultOrder = 'asc',
    onSortChange,
  } = options;

  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [order, setOrder] = useState(defaultOrder);

  const sortedRows = useMemo(
    () => sortRows(rows, orderBy, order, columnConfig),
    [rows, orderBy, order, columnConfig],
  );

  const requestSort = useCallback(
    (columnId) => {
      const col = columnConfig[columnId];
      if (!col || col.sortable === false) return;

      if (orderBy === columnId) {
        setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setOrderBy(columnId);
        setOrder('asc');
      }
      onSortChange?.();
    },
    [columnConfig, orderBy, onSortChange],
  );

  return { sortedRows, orderBy, order, requestSort };
}
