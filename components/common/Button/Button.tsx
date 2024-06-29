import classes from './Button.module.scss';

type ButtonType = 'button' | 'submit';
type ButtonVariant = 'primary' | 'secondary' | 'link';

type ButtonProps = {
  id?: string;
  children: React.ReactNode;
  variant: ButtonVariant;
  type?: ButtonType;
  classNames?: string;
  disabled?: boolean;
  title?: string;
  onClick?: () => void;
};

const Button = ({
  id,
  children,
  variant,
  disabled,
  classNames = '',
  title = '',
  type = 'button',
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`${classes.button} ${classes[variant]} ${classNames}`}
      onClick={onClick}
      type={type}
      id={id}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
