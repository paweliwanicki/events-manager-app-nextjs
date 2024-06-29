import Input, { InputProps } from '../Input/Input';
import { useCallback, useState } from 'react';
import SvgIcon from '../SvgIcon/SvgIcon';
import classes from './PasswordInput.module.scss';

type InputType = 'text' | 'password';

const PasswordInput = (props: InputProps) => {
  const [inputType, setInputType] = useState<InputType>('password');

  const handleShowPassword = useCallback(() => {
    setInputType('text');
  }, []);
  const handleHidePassword = useCallback(() => {
    setInputType('password');
  }, []);

  return (
    <Input
      type={inputType}
      label={
        props.label ? (
          props.label
        ) : (
          <span title="Password must contain at least one capital letter, special character and a minimum length of 8 characters">
            &#9432; Password<span className={classes.required}>*</span>
          </span>
        )
      }
      {...props}
      classNames={classes.passwordInput}
    >
      <SvgIcon
        id={inputType === 'text' ? 'icon-eye' : 'icon-eye-crossed'}
        elementId={`show-password-icon-${props.id}`}
        width={24}
        height={24}
        onMouseDown={handleShowPassword}
        onMouseUp={handleHidePassword}
      />
    </Input>
  );
};

export default PasswordInput;
