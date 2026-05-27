import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from '../../utils/dayjsPtBr';

/**
 * DatePicker com formato brasileiro (DD/MM/AAAA).
 * value/onChange usam string ISO "YYYY-MM-DD" ou vazio.
 */
export default function DatePickerField({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  ...rest
}) {
  const parsed = value ? dayjs(value) : null;
  const dayjsValue = parsed?.isValid() ? parsed : null;

  return (
    <DatePicker
      label={label}
      value={dayjsValue}
      onChange={(newValue) => {
        onChange(newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : '');
      }}
      format="DD/MM/YYYY"
      slotProps={{
        textField: {
          fullWidth: true,
          error: !!error,
          helperText,
          onBlur,
        },
        field: {
          clearable: true,
        },
      }}
      {...rest}
    />
  );
}
