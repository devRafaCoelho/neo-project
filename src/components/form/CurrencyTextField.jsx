import { TextField } from '@mui/material';
import { formatBRLFromDigits, parseBRLInput } from '../../utils/currency';

/**
 * Campo de moeda BRL com máscara: R$ prefixado e separadores conforme digitação.
 * value/onChange trabalham com número (ex.: 1500.50).
 */
export default function CurrencyTextField({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required,
  fullWidth = true,
  ...rest
}) {
  const digitsFromValue = () => {
    if (value === undefined || value === null || value === '') return '';
    return String(Math.round(Number(value) * 100));
  };

  const displayValue = digitsFromValue()
    ? formatBRLFromDigits(digitsFromValue())
    : '';

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) {
      onChange(undefined);
      return;
    }
    onChange(parseBRLInput(digits));
  };

  return (
    <TextField
      label={label}
      fullWidth={fullWidth}
      value={displayValue}
      onChange={handleChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      required={required}
      placeholder="R$ 0,00"
      inputMode="numeric"
      {...rest}
    />
  );
}
