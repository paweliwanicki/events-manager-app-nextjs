import { ReactNode, useCallback, ChangeEvent, RefObject } from 'react';
import classes from './Input.module.scss';
import { KeyboardEvent } from 'react';

type InputTypes = 'text' | 'number' | 'password' | 'email';
export type InputSize = 'small' | 'medium' | 'large';

export type InputProps = {
  id: string;
  label?: ReactNode;
  type?: InputTypes;
  isValidated?: boolean;
  hasError?: boolean;
  autocomplete?: boolean;
  icon?: ReactNode;
  value?: string;
  errorText?: string;
  validText?: string;
  placeholder?: string;
  size?: InputSize;
  autoComplete?: string;
  children?: ReactNode;
  classNames?: string;
  defaultValue?: string;
  elementRef?: RefObject<HTMLInputElement>;
  onChange?: (val: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const Input = ({
  id,
  label,
  isValidated,
  hasError,
  icon,
  value,
  errorText,
  validText,
  placeholder,
  autoComplete,
  children,
  elementRef,
  defaultValue,
  classNames = '',
  size = 'medium',
  type = 'text',
  onChange,
  onKeyDown,
}: InputProps) => {
  let validClassName = '';
  let inputBoxClassNames = `${classNames} ${classes.inputBox}`;

  const showValidationInfo =
    (errorText !== '' || validText !== '') && isValidated;
  if (showValidationInfo) {
    validClassName = !hasError ? classes.valid : classes.error;
    inputBoxClassNames = `${inputBoxClassNames} ${validClassName}`;
  }

  const handleInputOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <label className={classes.inputLabel} htmlFor={id}>
      <div className={classes.labelText}>{label}</div>
      <div className={inputBoxClassNames}>
        {icon}
        <input
          id={id}
          type={type}
          name={id}
          value={value}
          onChange={handleInputOnChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`${classes[size]} ${icon ? classes.withIcon : ''}`}
          autoComplete={autoComplete}
          ref={elementRef}
          defaultValue={defaultValue}
        />
        {children}
      </div>
      <p className={`${classes.validationText} ${validClassName}`}>
        {showValidationInfo && errorText}
      </p>
    </label>
  );
};

export default Input;
