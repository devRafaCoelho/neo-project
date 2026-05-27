import dayjs from './dayjsPtBr';

/**
 * Converte valor de mês (YYYY-MM, MM/YYYY ou dayjs) para início do mês.
 * Retorna null se vazio ou inválido.
 */
export function parseMesReferencia(value) {
  if (value == null || value === '') return null;

  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value.startOf('month') : null;
  }

  const str = String(value).trim();
  if (!str) return null;

  const formats = ['YYYY-MM', 'MM/YYYY', 'YYYY-MM-DD'];
  for (const fmt of formats) {
    const parsed = dayjs(str, fmt, true);
    if (parsed.isValid()) return parsed.startOf('month');
  }

  if (/^\d{4}-\d{2}$/.test(str)) {
    const parsed = dayjs(`${str}-01`, 'YYYY-MM-DD', true);
    if (parsed.isValid()) return parsed.startOf('month');
  }

  return null;
}

/** Formato canônico para estado dos filtros */
export function formatMesReferencia(value) {
  const parsed = parseMesReferencia(value);
  return parsed ? parsed.format('YYYY-MM') : '';
}

/**
 * Verifica se periodo (YYYY-MM) está no intervalo [inicio, fim] (inclusivo).
 * Ignora limites inválidos ou não informados.
 */
export function periodoNoIntervalo(periodo, mesInicio, mesFim) {
  const row = parseMesReferencia(periodo);
  if (!row) return true;

  let inicio = parseMesReferencia(mesInicio);
  let fim = parseMesReferencia(mesFim);

  if (inicio && fim && inicio.isAfter(fim, 'month')) {
    [inicio, fim] = [fim, inicio];
  }

  if (inicio && row.isBefore(inicio, 'month')) return false;
  if (fim && row.isAfter(fim, 'month')) return false;
  return true;
}
