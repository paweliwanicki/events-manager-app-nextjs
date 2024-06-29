import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useState,
  useEffect,
  FormEvent,
} from 'react';
import Input from '../common/Input/Input';
import classes from './SignUpForm.module.scss';
import Button from '../common/Button/Button';
import Checkbox from '../common/Checkbox/Checkbox';
import Modal from '../common/Modal/Modal';
import { useSignForm } from '../../hooks/useSignForm';
import { useMotionAnimate } from 'motion-hooks';
import PasswordInput from '../common/PasswordInput/PasswordInput';
import DatePicker from '../common/DatePickerInput/DatePickerInput';

// move terms and privacy to db, fetch them on demand and useMemo
const TERMS_CONDITION: ReactNode = (
  <>
    <h3>Terms and Conditions</h3>
    <p>Score one for you for reading the terms and conditions &#128077; </p>
  </>
);

const PRIVACY_STATEMENT: ReactNode = (
  <>
    <h3>Privacy Statement</h3>
    <p>
      All usernames and passwords are stored and used only for app demo
      purposes. &#128373;
    </p>
  </>
);

type SignUpFormProps = {
  onSubmit: (
    firstName: string,
    lastName: string,
    email: string,
    dateOfBirth: Date,
    password: string,
    confirmPassword: string
  ) => void;
};

const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const { play } = useMotionAnimate(
    `.${classes.signUpForm}`,
    { opacity: 1 },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const { validateSignUpForm, clearValidationAndError, errors, isValidated } =
    useSignForm();

  const {
    emailError,
    firstNameError,
    lastNameError,
    dateOfBirthError,
    passwordError,
    confirmPasswordError,
    termsCheckError,
  } = errors;
  const {
    emailIsValidated,
    firstNameIsValidated,
    lastNameIsValidated,
    dateOfBirthIsValidated,
    passwordIsValidated,
    confirmPasswordIsValidated,
  } = isValidated;

  const [email, setUsername] = useState<string>('');
  const [firstName, setFirstname] = useState<string>('');
  const [lastName, setLastname] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [termsChecked, setTermsChecked] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode>();

  const handleEmailOnChange = useCallback(
    (email: string) => {
      emailIsValidated && clearValidationAndError('EMAIL');
      setUsername(email);
    },
    [emailIsValidated, clearValidationAndError]
  );

  const handleFirstNameOnChange = useCallback(
    (firstname: string) => {
      firstNameIsValidated && clearValidationAndError('FIRSTNAME');
      setFirstname(firstname);
    },
    [firstNameIsValidated, clearValidationAndError]
  );

  const handleLastNameOnChange = useCallback(
    (lastname: string) => {
      lastNameIsValidated && clearValidationAndError('LASTNAME');
      setLastname(lastname);
    },
    [lastNameIsValidated, clearValidationAndError]
  );

  const handleDateOfBirthOnChange = useCallback(
    (dateOfBirth: Date) => {
      dateOfBirthIsValidated && clearValidationAndError('DATE_OF_BIRTH');
      setDateOfBirth(dateOfBirth);
    },
    [dateOfBirthIsValidated, clearValidationAndError]
  );

  const handlePasswordOnChange = useCallback(
    (password: string) => {
      passwordIsValidated && clearValidationAndError('PASSWORD');
      setPassword(password);
    },
    [passwordIsValidated, clearValidationAndError]
  );

  const handleConfirmPasswordOnChange = useCallback(
    (confirmPassword: string) => {
      confirmPasswordIsValidated && clearValidationAndError('CONFIRM_PASSWORD');
      setConfirmPassword(confirmPassword);
    },
    [confirmPasswordIsValidated, clearValidationAndError]
  );

  const handleOnCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      termsCheckError && clearValidationAndError('TERMS');
      setTermsChecked(e.target.checked);
    },
    [termsCheckError, clearValidationAndError]
  );

  const handleFormOnSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const isValid = validateSignUpForm(
        firstName,
        lastName,
        email,
        dateOfBirth,
        password,
        confirmPassword,
        termsChecked
      );

      if (!isValid) {
        return;
      }

      onSubmit(
        firstName,
        lastName,
        email,
        dateOfBirth as Date,
        password,
        confirmPassword
      );
    },
    [
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      confirmPassword,
      termsChecked,
      validateSignUpForm,
      onSubmit,
    ]
  );

  const showTermsAndConditions = useCallback(() => {
    setModalContent(TERMS_CONDITION);
    setShowModal(true);
  }, []);

  const showPrivacyStatement = useCallback(() => {
    setModalContent(PRIVACY_STATEMENT);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(undefined);
    setShowModal(false);
  }, []);

  useEffect(() => {
    void play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.signUpForm}>
      <h2>Sign Up</h2>
      <h4>
        Don't have an account yet? Create a new account and enjoy browsing the
        many fake social events &#128526;
      </h4>
      <form noValidate onSubmit={handleFormOnSubmit}>
        <Input
          type="text"
          id="firstName"
          label={
            <span title="First name (min 3, max 25 characters)">
              &#9432; First name<span className={classes.required}>*</span>
            </span>
          }
          errorText={firstNameError}
          hasError={!!firstNameError}
          onChange={handleFirstNameOnChange}
          placeholder="Your first name"
          isValidated={firstNameIsValidated}
          autoComplete="on"
        />

        <Input
          type="text"
          id="lastName"
          label={
            <span title="Last name (min 3, max 45 characters)">
              &#9432; Last name<span className={classes.required}>*</span>
            </span>
          }
          errorText={lastNameError}
          hasError={!!lastNameError}
          onChange={handleLastNameOnChange}
          placeholder="Your last name"
          isValidated={lastNameIsValidated}
          autoComplete="on"
        />

        <Input
          type="text"
          id="email"
          label={
            <span title="Please provide valid e-mail address">
              &#9432; E-mail<span className={classes.required}>*</span>
            </span>
          }
          errorText={emailError}
          hasError={!!emailError}
          onChange={handleEmailOnChange}
          placeholder="Your new email"
          isValidated={emailIsValidated}
          autoComplete="on"
        />

        <DatePicker
          id="date-of-birth"
          label={
            <span>
              &#128197; Date of birth<span className={classes.required}>*</span>
            </span>
          }
          selected={dateOfBirth}
          isValidated={dateOfBirthIsValidated}
          onChange={handleDateOfBirthOnChange}
          errorText={dateOfBirthError}
          hasError={!!dateOfBirthError}
          placeholder="Your date of birth"
        />

        <PasswordInput
          id="password"
          errorText={passwordError}
          hasError={!!passwordError}
          onChange={handlePasswordOnChange}
          placeholder="Your password"
          isValidated={passwordIsValidated}
        />

        <PasswordInput
          id="confirm-password"
          errorText={confirmPasswordError}
          hasError={!!confirmPasswordError}
          onChange={handleConfirmPasswordOnChange}
          placeholder="Confirm your password"
          isValidated={confirmPasswordIsValidated}
          label={
            <span title="Password and confirmation password must be equal">
              &#9432; Confirm password
              <span className={classes.required}>*</span>
            </span>
          }
        />

        <div className={classes.termsBox}>
          <Checkbox
            onChange={handleOnCheckboxChange}
            isChecked={termsChecked}
            hasError={!!termsCheckError}
            id="checkbox-terms"
            size="medium"
            errorText="You must agree conditions and terms!"
            errorTooltip
          />
          <p>
            I agree to the
            <span onClick={showTermsAndConditions}> Terms and Conditions </span>
            and
            <span onClick={showPrivacyStatement}> Privacy Statement</span>
            <span className={classes.required}>*</span>
          </p>
        </div>

        <Button type="submit" variant="secondary">
          Sign Up
        </Button>
      </form>
      <Modal isOpen={showModal} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default SignUpForm;
