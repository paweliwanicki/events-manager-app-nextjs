import Input from '../common/Input/Input';
import classes from './SignInForm.module.scss';
import { useCallback, useState, useEffect, SyntheticEvent } from 'react';
import Button from '../common/Button/Button';
import { useSignForm } from '../../hooks/useSignForm';
import { useMotionAnimate } from 'motion-hooks';
import PasswordInput from '../common/PasswordInput/PasswordInput';

type SignInFormProps = {
  onSubmit: (username: string, password: string) => void;
};

const SignInForm = ({ onSubmit }: SignInFormProps) => {
  const { play } = useMotionAnimate(
    `.${classes.signInForm}`,
    { opacity: 1 },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const { validateSignInForm, clearValidationAndError, errors, isValidated } =
    useSignForm();

  const { emailError, passwordError } = errors;
  const { emailIsValidated, passwordIsValidated } = isValidated;

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUsernameOnChange = useCallback(
    (username: string) => {
      emailIsValidated && clearValidationAndError('EMAIL');
      setUsername(username);
    },
    [emailIsValidated, clearValidationAndError]
  );

  const handlePasswordOnChange = useCallback(
    (password: string) => {
      passwordIsValidated && clearValidationAndError('PASSWORD');
      setPassword(password);
    },
    [passwordIsValidated, clearValidationAndError]
  );

  const handleFormOnSubmit = useCallback(
    (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      e.preventDefault();
      const isValid = validateSignInForm(username, password);
      if (!isValid) {
        return;
      }
      onSubmit(username, password);
    },
    [username, password, validateSignInForm, onSubmit]
  );

  useEffect(() => {
    void play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.signInForm}>
      <h2>Sign In</h2>
      <h4>
        Please log in to the application using your username and password.
      </h4>
      <form noValidate onSubmit={handleFormOnSubmit}>
        <Input
          type="text"
          id="email"
          label="E-mail"
          errorText={emailError}
          hasError={!!emailError}
          onChange={handleUsernameOnChange}
          placeholder="Your email"
          isValidated={emailIsValidated}
          autoComplete="on"
        />

        <PasswordInput
          id="password"
          errorText={passwordError}
          hasError={!!passwordError}
          onChange={handlePasswordOnChange}
          placeholder="Your password"
          isValidated={passwordIsValidated}
          label="Password"
        />

        <Button type="submit" variant="secondary">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default SignInForm;
