import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from '../../utils/dayjsPtBr';

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
  ...rest
}) {
  const parsed = value ? dayjs(`${value}-01`) : null;
  const dayjsValue = parsed?.isValid() ? parsed : null;

  return (
    <DatePicker
      label={label}
      views={['year', 'month']}
      openTo="month"
      value={dayjsValue}
      onChange={(newValue) => {
        onChange(newValue && newValue.isValid() ? newValue.format('YYYY-MM') : '');
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
