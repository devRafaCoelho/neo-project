const CNPJ_DIGITS_LENGTH = 14;

/** Remove tudo que não for dígito e limita a 14 caracteres */
export function digitsOnlyCnpj(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, CNPJ_DIGITS_LENGTH);
}

/** Formata dígitos no padrão 00.000.000/0000-00 enquanto digita */
export function formatCnpjFromDigits(digits) {
  const d = digitsOnlyCnpj(digits);
  if (!d) return '';

  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  }
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/** Formata valor já digitado ou vindo do mock */
export function formatCnpj(value) {
  return formatCnpjFromDigits(digitsOnlyCnpj(value));
}

export const CNPJ_FORMATTED_MAX_LENGTH = 18;
