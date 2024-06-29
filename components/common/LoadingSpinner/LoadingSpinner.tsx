import spinner from "./spinner.svg";
import classes from "./LoadingSpinner.module.scss";

type LoadingSpinnerProps = {
  message?: string;
};

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <div className={classes.loadingSpinnerOverlay}>
      <img
        className={classes.loadingSpinner}
        src={spinner}
        alt="loading spinner"
      />
      {message && <p>{message}</p>}
    </div>
  );
};
