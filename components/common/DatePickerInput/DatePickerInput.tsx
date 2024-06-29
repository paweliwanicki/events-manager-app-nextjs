import { ReactNode } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './DatePickerInput.module.scss';
import { InputSize } from '../Input/Input';

type DatePickerProps = {
  id: string;
  showTimeSelect?: boolean;
  selected?: Date;
  hasError?: boolean;
  errorText?: string;
  label?: ReactNode;
  isValidated?: boolean;
  size?: InputSize;
  placeholder?: string;
  dateFormat?: string;
  onChange: (date: Date) => void;
};

const DatePicker = ({
  id,
  selected,
  errorText,
  hasError,
  label,
  isValidated,
  placeholder,
  showTimeSelect,
  dateFormat,
  size = 'medium',
  onChange,
}: DatePickerProps) => {
  let validClassName = '';

  const showValidationInfo = errorText !== '' && isValidated;
  if (showValidationInfo) {
    validClassName = !hasError ? classes.valid : classes.error;
  }

  return (
    <label className={classes.inputLabel} htmlFor={id}>
      <div className={classes.labelText}>{label}</div>
      <div className={`${classes.inputBox} ${validClassName} ${classes[size]}`}>
        <ReactDatePicker
          showTimeSelect={showTimeSelect}
          placeholderText={placeholder}
          selected={selected}
          onChange={onChange}
          autoComplete="off"
          isClearable
          dateFormat={dateFormat}
        />
      </div>
      <p className={`${classes.validationText} ${validClassName}`}>
        {showValidationInfo && errorText}
      </p>
    </label>
  );
};

export default DatePicker;
