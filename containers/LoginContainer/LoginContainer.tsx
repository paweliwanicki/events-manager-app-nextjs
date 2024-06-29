import { useCallback, useState } from 'react';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import classes from './LoginContainer.module.scss';
import SignInForm from '../../components/SignInForm/SignInForm';
import { useSignForm } from '../../hooks/useSignForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';

type Form = 'SIGN_UP' | 'SIGN_IN';

const FORM_CHANGE_TEXT: Record<Form, Record<string, string>> = {
  SIGN_UP: {
    label: 'Have already an account?',
    btn: 'Sign in!',
  },
  SIGN_IN: {
    label: 'Do not have an account yet?',
    btn: 'Sign up!',
  },
} as const;

const LoginContainer = () => {
  const { handleSignIn, handleSignUp, isFetching } = useSignForm();

  const [activeForm, setActiveForm] = useState<Form>('SIGN_IN');

  const handleSignInOnSubmit = useCallback(
    (email: string, password: string) => {
      handleSignIn(email, password);
    },
    [handleSignIn]
  );

  const handleSignUpOnSubmit = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      dateOfBirth: Date,
      password: string,
      confirmPassword: string
    ) => {
      const status = await handleSignUp(
        firstName,
        lastName,
        email,
        dateOfBirth,
        password,
        confirmPassword
      );
      status && setActiveForm('SIGN_IN');
    },
    [handleSignUp]
  );

  const handleChangeSignForm = useCallback(() => {
    setActiveForm(activeForm === 'SIGN_IN' ? 'SIGN_UP' : 'SIGN_IN');
  }, [activeForm]);

  return (
    <div className={classes.loginContainer}>
      {isFetching && (
        <LoadingSpinner
          message={activeForm === 'SIGN_UP' ? 'Signing up' : 'Signing in'}
        />
      )}
      {activeForm === 'SIGN_UP' ? (
        <SignUpForm onSubmit={handleSignUpOnSubmit} />
      ) : (
        <SignInForm onSubmit={handleSignInOnSubmit} />
      )}
      <div className={classes.formChangeBox}>
        <p>{FORM_CHANGE_TEXT[activeForm].label}</p>
        <button
          className={classes.formChangeBtn}
          onClick={handleChangeSignForm}
        >
          {FORM_CHANGE_TEXT[activeForm].btn}
        </button>
      </div>
    </div>
  );
};

export default LoginContainer;
