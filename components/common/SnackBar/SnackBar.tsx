import classes from "./SnackBar.module.scss";
import SvgIcon from "../SvgIcon/SvgIcon";
import { useCallback, useEffect } from "react";
import { useMotionAnimate } from "motion-hooks";
import { useSnackBar } from "../../../contexts/snackBarContext";

const SnackBar = () => {
  const { play: openAnimation } = useMotionAnimate(
    `.${classes.snackBar}`,
    { top: "20px" },
    {
      duration: 0.5,
      easing: "ease-in",
    }
  );

  const { play: closeAnimation } = useMotionAnimate(
    `.${classes.snackBar}`,
    { top: "-200px" },
    {
      duration: 0.5,
      easing: "ease-in",
    }
  );

  const { content, variant, isShowing, setIsShowing } = useSnackBar();

  const handleCloseSnackBar = useCallback(() => {
    setIsShowing(false);
  }, [setIsShowing]);

  useEffect(() => {
    if (isShowing) {
      openAnimation();
    } else {
      closeAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowing]);

  return (
    <div id="snackbar" className={classes.snackBar} data-variant={variant}>
      {content}
      <button onClick={handleCloseSnackBar} className={classes.closeIcon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          id="icon-close"
        >
          <path
            d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
            stroke="#eee"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
            stroke="#eee"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {/* <SvgIcon
        id="icon-close"
        onClick={handleCloseSnackBar}
        classNames={classes.closeIcon}
      /> */}
    </div>
  );
};

export default SnackBar;
