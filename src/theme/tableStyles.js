/** Estilos de linha de tabela alinhados à paleta brand do tema ativo */
export const zebraTableRowSx = {
  '&:nth-of-type(even)': { bgcolor: 'background.paper' },
  '&:nth-of-type(odd)': { bgcolor: 'brand.muted' },
  '&:hover': { bgcolor: 'brand.hover' },
};

/** Alternância usada com index % 2 (par = branco) */
export function zebraRowBg(isEven) {
  return isEven ? 'background.paper' : 'brand.muted';
}
