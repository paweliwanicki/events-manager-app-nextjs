import classes from "./LoadingSpinner.module.scss";
import Image from "next/image";

type LoadingSpinnerProps = {
  message?: string;
};

export const LoadingSpinner = ({ message }: LoadingSpinnerProps) => {
  return (
    <div className={classes.loadingSpinnerOverlay}>
      <Image
        className={classes.loadingSpinner}
        src="/spinner.svg"
        alt="loading spinner"
        width={150}
        height={150}
      />
      {message && <p>{message}</p>}
    </div>
  );
};
