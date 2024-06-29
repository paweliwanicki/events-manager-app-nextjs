import { ReactNode, useCallback, useState } from "react";
import classes from "./ContextMenu.module.scss";
import SvgIcon from "../SvgIcon/SvgIcon";
import { useMotionAnimate } from "motion-hooks";

export type ContextMenuOption = {
  label: ReactNode;
  action?: () => unknown;
};

type ContextMenuProps = {
  id: string;
  options: ContextMenuOption[];
  classNames?: string;
  iconId?: string;
  width?: number;
  height?: number;
};

const ContextMenu = ({
  options,
  id,
  iconId,
  classNames = "",
  width = 24,
  height = 24,
}: ContextMenuProps) => {
  const { play: openMenuAnimation } = useMotionAnimate(
    `#${id} .${classes.option}`,
    { opacity: 1, height: "fit-content", padding: "10px 0" },
    {
      duration: 0.1,
      easing: "linear",
    }
  );

  const { play: closeMenuAnimation } = useMotionAnimate(
    `#${id} .${classes.option}`,
    { opacity: 0, height: "0", padding: 0 },
    {
      duration: 0.1,
      easing: "linear",
    }
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSetIsOpen = useCallback(() => {
    const open = !isOpen;
    setIsOpen(open);
    open ? openMenuAnimation() : closeMenuAnimation();
  }, [isOpen, openMenuAnimation, closeMenuAnimation]);

  const handleOptionAction = useCallback(
    (option: ContextMenuOption) => {
      handleSetIsOpen();
      option && option.action?.();
    },
    [handleSetIsOpen]
  );

  return (
    <>
      <div id={id} className={`${classNames} ${classes.contextMenuBox}`}>
        <SvgIcon
          id={iconId ? iconId : "icon-settings"}
          width={width}
          height={height}
          onClick={handleSetIsOpen}
        />

        <ul
          className={`${classes.optionsList} ${isOpen ? classes.open : ""}`}
          style={{ top: height + 5 }}
        >
          {options.map((option: ContextMenuOption, index: number) => {
            return (
              <li
                onClick={() => handleOptionAction(option)}
                className={classes.option}
                key={`${index}-${option.label}`}
              >
                <p>{option.label}</p>
              </li>
            );
          })}
        </ul>
      </div>
      {isOpen && (
        <div className={classes.overlay} onClick={handleSetIsOpen}></div>
      )}
    </>
  );
};

export default ContextMenu;
