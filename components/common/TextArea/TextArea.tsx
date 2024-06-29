import classes from './TextArea.module.scss';
import { ReactNode, useCallback, ChangeEvent, RefObject } from 'react';
import { KeyboardEvent } from 'react';

export type TextAreaProps = {
  id: string;
  label?: ReactNode;
  isValidated?: boolean;
  hasError?: boolean;
  value?: string;
  errorText?: string;
  validText?: string;
  placeholder?: string;
  classNames?: string;
  defaultValue?: string;
  elementRef?: RefObject<HTMLTextAreaElement>;
  onChange?: (val: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

const TextArea = ({
  id,
  label,
  isValidated,
  hasError,
  value,
  errorText,
  validText,
  placeholder,
  elementRef,
  defaultValue,
  classNames = '',
  onChange,
  onKeyDown,
}: TextAreaProps) => {
  let validClassName = '';
  let textAreaBoxClassNames = `${classNames} ${classes.textAreaBox}`;

  const showValidationInfo =
    (errorText !== '' || validText !== '') && isValidated;
  if (showValidationInfo) {
    validClassName = !hasError ? classes.valid : classes.error;
    textAreaBoxClassNames = `${textAreaBoxClassNames} ${validClassName}`;
  }

  const handleTextAreaOnChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange && onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <label className={classes.textAreaLabel} htmlFor={id}>
      <div className={classes.labelText}>{label}</div>
      <div className={textAreaBoxClassNames}>
        <textarea
          id={id}
          ref={elementRef}
          name={id}
          value={value}
          onChange={handleTextAreaOnChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={10}
          defaultValue={defaultValue}
        ></textarea>
      </div>
      <p className={`${classes.validationText} ${validClassName}`}>
        {showValidationInfo && errorText}
      </p>
    </label>
  );
};

export default TextArea;
