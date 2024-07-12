import { useCallback, useState, useMemo } from 'react';
import { useApi } from './useApi';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '../enums/RoutePath';
import { HttpMethod } from '../enums/HttpMethods';
import { User } from '../models/User';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../contexts/userContext';
import { useSnackBar } from '../contexts/snackBarContext';
import { ResponseStatus } from '../enums/ResponseStatus';

type InputError =
  | 'EMPTY'
  | 'WRONG_PASSWORD_FORMAT'
  | 'PASSWORDS_NOT_MATCH'
  | 'WRONG_EMAIL_FORMAT';

type SignFormInput =
  | 'EMAIL'
  | 'FIRSTNAME'
  | 'LASTNAME'
  | 'DATE_OF_BIRTH'
  | 'PASSWORD'
  | 'CONFIRM_PASSWORD'
  | 'TERMS';

type SignResponse = {
  message: string;
  status: ResponseStatus;
  jwtToken: string;
};

type SignForm = {
  errors: {
    emailError: string | undefined;
    passwordError: string | undefined;
    firstNameError: string | undefined;
    lastNameError: string | undefined;
    dateOfBirthError: string | undefined;
    confirmPasswordError: string | undefined;
    termsCheckError: boolean;
  };
  isValidated: {
    emailIsValidated: boolean;
    passwordIsValidated: boolean;
    firstNameIsValidated: boolean;
    lastNameIsValidated: boolean;
    dateOfBirthIsValidated: boolean;
    confirmPasswordIsValidated: boolean;
    termsCheckIsValidated: boolean;
  };
  isFetching: boolean;
  clearValidationAndError: (input: SignFormInput) => void;
  validateSignInForm: (email: string, password: string) => boolean;
  validateSignUpForm: (
    first_name: string,
    last_name: string,
    email: string,
    date_of_birth: Date | undefined,
    password: string,
    confirmPassword: string,
    termsChecked: boolean
  ) => boolean;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignUp: (
    first_name: string,
    last_name: string,
    email: string,
    date_of_birth: Date,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  handleSignOut: () => void;
};

const INPUT_ERRORS_MESSAGES: Record<InputError, string> = {
  EMPTY: 'Can not be empty!',
  WRONG_PASSWORD_FORMAT: 'Password does not meet requirements!',
  WRONG_EMAIL_FORMAT: 'E-mail address must be an valid email format!',
  PASSWORDS_NOT_MATCH: 'Password and confirm password do not match!',
} as const;

const EMAIL_REGEX = new RegExp(
  '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,10}$',
  'i'
);
const PASSWORD_REGEX = new RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$'
);

const AUTH_API_PATH = '/api/auth';

export const useSignForm = (): SignForm => {
  // const navigate = useNavigate();
  const { fetch, isFetching } = useApi();
  const { changeUser } = useUser();

  const [emailError, setEmailError] = useState<string | undefined>();
  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [dateOfBirthError, setDateOfBirthError] = useState<
    string | undefined
  >();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >();
  const [termsCheckError, setTermsError] = useState<boolean>(false);
  const { handleShowSnackBar } = useSnackBar();

  const [emailIsValidated, setEmailIsValidated] = useState<boolean>(false);
  const [firstNameIsValidated, setFirstNameIsValidated] =
    useState<boolean>(false);
  const [lastNameIsValidated, setLastNameIsValidated] =
    useState<boolean>(false);
  const [dateOfBirthIsValidated, setDateOfBirthIsValidated] =
    useState<boolean>(false);
  const [passwordIsValidated, setPasswordIsValidated] =
    useState<boolean>(false);
  const [confirmPasswordIsValidated, setConfirmPasswordIsValidated] =
    useState<boolean>(false);
  const [termsCheckIsValidated, setTermsCheckIsValidated] =
    useState<boolean>(false);

  const handleSignResponse = useCallback(
    (response: SignResponse) => {
      const { status, message, jwtToken } = response;
      handleShowSnackBar(message, status);
      if (status !== ResponseStatus.SUCCESS && jwtToken) {
        return;
      }
      const user: User = jwtDecode(jwtToken);
      if (user) {
        changeUser(user);
        // navigate(RoutePath.DASHBOARD);
      }
    },
    [changeUser, handleShowSnackBar]
  );
  const handleSignUpResponse = useCallback(
    (response: SignResponse) => {
      const { status, message } = response;
      handleShowSnackBar(message, status);
      return status === ResponseStatus.SUCCESS;
    },
    [handleShowSnackBar]
  );

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      const [response] = await fetch<SignResponse>(HttpMethod.POST, {
        path: `${AUTH_API_PATH}/signin`,
        payload: JSON.stringify({
          email,
          password,
        }),
      });
      handleSignResponse(response);
    },
    [fetch, handleSignResponse]
  );

  const handleSignUp = useCallback(
    async (
      first_name: string,
      last_name: string,
      email: string,
      date_of_birth: Date,
      password: string,
      confirmPassword: string
    ) => {
      const dateOfBirthTimestamp = date_of_birth
        ? Math.floor(date_of_birth.getTime() / 1000)
        : 0;
      const [response] = await fetch<SignResponse>(HttpMethod.POST, {
        path: `${AUTH_API_PATH}/signup`,
        payload: JSON.stringify({
          first_name,
          last_name,
          email,
          date_of_birth: dateOfBirthTimestamp,
          password,
          confirmPassword,
        }),
      });

      return handleSignUpResponse(response);
    },
    [fetch, handleSignUpResponse]
  );

  const handleSignOut = useCallback(() => {
    changeUser(undefined);
  }, [changeUser]);

  const validateSignInForm = useCallback((email: string, password: string) => {
    let isValid = true;

    if (email === '') {
      setEmailError(INPUT_ERRORS_MESSAGES.EMPTY);
      isValid = false;
    }

    if (password === '') {
      setPasswordError(INPUT_ERRORS_MESSAGES.EMPTY);
      isValid = false;
    }

    setEmailIsValidated(true);
    setPasswordIsValidated(true);

    return isValid;
  }, []);

  const validateSignUpForm = useCallback(
    (
      first_name: string,
      last_name: string,
      email: string,
      date_of_birth: Date | undefined,
      password: string,
      confirmPassword: string,
      termsChecked: boolean
    ) => {
      let isValid = true;

      if (email === '') {
        setEmailError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      } else if (!EMAIL_REGEX.test(email)) {
        setEmailError(INPUT_ERRORS_MESSAGES.WRONG_EMAIL_FORMAT);
        isValid = false;
      }

      if (first_name === '') {
        setFirstNameError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      }

      if (last_name === '') {
        setLastNameError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      }

      if (!date_of_birth) {
        setDateOfBirthError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      }

      if (password === '') {
        setPasswordError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      } else if (!PASSWORD_REGEX.test(password)) {
        setPasswordError(INPUT_ERRORS_MESSAGES.WRONG_PASSWORD_FORMAT);
        isValid = false;
      }

      if (confirmPassword === '') {
        setConfirmPasswordError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      } else if (confirmPassword !== password) {
        setConfirmPasswordError(INPUT_ERRORS_MESSAGES.PASSWORDS_NOT_MATCH);
        isValid = false;
      }

      if (!termsChecked) {
        setTermsError(true);
        isValid = false;
      }

      setEmailIsValidated(true);
      setFirstNameIsValidated(true);
      setLastNameIsValidated(true);
      setDateOfBirthIsValidated(true);
      setPasswordIsValidated(true);
      setConfirmPasswordIsValidated(true);
      setTermsCheckIsValidated(true);

      return isValid;
    },
    []
  );

  const clearErrors = useCallback(() => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmPasswordError(undefined);
    setTermsError(false);
  }, []);

  const clearValidation = useCallback(() => {
    setPasswordIsValidated(false);
    setEmailIsValidated(false);
    setConfirmPasswordIsValidated(false);
    setTermsCheckIsValidated(false);
  }, []);

  const validationCleaners: Record<SignFormInput | 'ALL', () => void> =
    useMemo(() => {
      return {
        EMAIL: () => {
          setEmailError(undefined);
          setEmailIsValidated(false);
        },
        FIRSTNAME: () => {
          setFirstNameError(undefined);
          setFirstNameIsValidated(false);
        },
        LASTNAME: () => {
          setLastNameError(undefined);
          setLastNameIsValidated(false);
        },
        DATE_OF_BIRTH: () => {
          setDateOfBirthError(undefined);
          setDateOfBirthIsValidated(false);
        },
        PASSWORD: () => {
          setPasswordError(undefined);
          setPasswordIsValidated(false);
        },
        CONFIRM_PASSWORD: () => {
          setConfirmPasswordError(undefined);
          setConfirmPasswordIsValidated(false);
        },
        TERMS: () => {
          setTermsError(false);
          setTermsCheckIsValidated(false);
        },
        ALL: () => {
          clearValidation();
          clearErrors();
        },
      };
    }, [clearErrors, clearValidation]);

  const clearValidationAndError = useCallback(
    (input?: SignFormInput) => {
      validationCleaners[input ?? 'ALL']();
    },
    [validationCleaners]
  );

  return {
    isFetching,
    errors: {
      emailError,
      passwordError,
      firstNameError,
      lastNameError,
      dateOfBirthError,
      confirmPasswordError,
      termsCheckError,
    },
    isValidated: {
      emailIsValidated,
      firstNameIsValidated,
      lastNameIsValidated,
      dateOfBirthIsValidated,
      passwordIsValidated,
      confirmPasswordIsValidated,
      termsCheckIsValidated,
    },
    clearValidationAndError,
    validateSignInForm,
    validateSignUpForm,
    handleSignIn,
    handleSignUp,
    handleSignOut,
  };
};
