/** Converte número (ex.: 1234.56) para exibição "R$ 1.234,56" */
export function formatBRL(value) {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(value);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Extrai apenas dígitos e retorna valor numérico em reais (centavos → reais) */
export function parseBRLInput(input) {
  const digits = String(input).replace(/\D/g, '');
  if (!digits) return undefined;
  return parseInt(digits, 10) / 100;
}

/** Formata string de dígitos (centavos) enquanto o usuário digita */
export function formatBRLFromDigits(digits) {
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
