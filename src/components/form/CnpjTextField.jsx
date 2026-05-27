import { TextField } from '@mui/material';
import {
  CNPJ_FORMATTED_MAX_LENGTH,
  formatCnpj,
  formatCnpjFromDigits,
} from '../../utils/cnpj';

/**
 * Campo CNPJ com máscara 00.000.000/0000-00 (máx. 14 dígitos).
 * value/onChange usam string formatada.
 */
export default function CnpjTextField({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required,
  disabled,
  fullWidth = true,
  slotProps,
  ...rest
}) {
  const displayValue = formatCnpj(value);

  const handleChange = (e) => {
    const formatted = formatCnpjFromDigits(e.target.value);
    onChange(formatted);
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
      disabled={disabled}
      placeholder="00.000.000/0000-00"
      inputMode="numeric"
      slotProps={{
        ...slotProps,
        htmlInput: {
          maxLength: CNPJ_FORMATTED_MAX_LENGTH,
          ...slotProps?.htmlInput,
        },
      }}
      {...rest}
    />
  );
}
