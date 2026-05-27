import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from '../../utils/dayjsPtBr';
import { formatMesReferencia, parseMesReferencia } from '../../utils/periodo';

/**
 * Seletor de mês/ano (MM/AAAA). value/onChange usam string "YYYY-MM" ou vazio.
 */
export default function MonthPickerField({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  referenceDate,
  ...rest
}) {
  const dayjsValue = parseMesReferencia(value);

  const emitChange = (newValue) => {
    onChange(formatMesReferencia(newValue));
  };

  return (
    <DatePicker
      label={label}
      views={['year', 'month']}
      openTo="month"
      value={dayjsValue}
      referenceDate={referenceDate ?? dayjs('2026-01-01')}
      onChange={(newValue, context) => {
        if (context.validationError == null) {
          emitChange(newValue);
        }
      }}
      onAccept={(newValue) => {
        emitChange(newValue);
      }}
      format="MM/YYYY"
      slotProps={{
        textField: {
          fullWidth: true,
          error: !!error,
          helperText,
          onBlur,
        },
        field: { clearable: true },
      }}
      {...rest}
    />
  );
}
