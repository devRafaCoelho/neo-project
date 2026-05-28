/** Rotas do módulo SAI (submenu agrupado na navegação) */
export const SAI_NAV_PATHS = [
  '/gestao-sap',
  '/importacao',
  '/provisao',
  '/pedido',
  '/relatorios',
  '/contratos',
];

export function isSaiModulePath(pathname) {
  return SAI_NAV_PATHS.includes(pathname);
}
