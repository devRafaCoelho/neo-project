import { Box, TableCell, TableSortLabel } from '@mui/material';

const sortLabelSx = {
  color: 'inherit !important',
  '& .MuiTableSortLabel-icon': {
    color: 'inherit !important',
    opacity: 0.55,
  },
  '&.Mui-active .MuiTableSortLabel-icon': {
    opacity: 1,
  },
  '&:hover': { color: 'inherit' },
  '&:focus': { color: 'inherit' },
};

const sortableThSx = {
  p: '12px 16px',
  textAlign: 'left',
  bgcolor: 'primary.dark',
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

/** Cabeçalho para tabelas HTML (Box component="table") */
export function SortableTableHeadCell({
  label,
  columnId,
  active,
  direction,
  sortable = true,
  onSort,
  sx = {},
}) {
  const mergedSx = { ...sortableThSx, ...sx };

  if (!sortable) {
    return (
      <Box component="th" sx={mergedSx}>
        {label}
      </Box>
    );
  }

  return (
    <Box component="th" sx={mergedSx}>
      <TableSortLabel
        active={active}
        direction={active ? direction : 'asc'}
        onClick={() => onSort(columnId)}
        sx={sortLabelSx}
      >
        {label}
      </TableSortLabel>
    </Box>
  );
}

/** Cabeçalho para MUI Table (TableCell) */
export function SortableMuiHeadCell({
  label,
  columnId,
  active,
  direction,
  sortable = true,
  onSort,
  sx = {},
}) {
  const cellSx = {
    fontWeight: 700,
    bgcolor: 'primary.dark',
    color: 'white',
    whiteSpace: 'nowrap',
    ...sx,
  };

  if (!sortable) {
    return <TableCell sx={cellSx}>{label}</TableCell>;
  }

  return (
    <TableCell sx={cellSx}>
      <TableSortLabel
        active={active}
        direction={active ? direction : 'asc'}
        onClick={() => onSort(columnId)}
        sx={sortLabelSx}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}
