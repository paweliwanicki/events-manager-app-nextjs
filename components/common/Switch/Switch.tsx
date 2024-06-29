import { ReactNode, ChangeEvent } from 'react';
import classes from './Switch.module.scss';

type SwitchProps = {
  id: string;
  leftLabel: ReactNode;
  rightLabel: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Switch = ({
  id,
  leftLabel,
  rightLabel,
  checked,
  onChange,
}: SwitchProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={classes.switchBox}>
      {leftLabel}
      <label className={classes.switch} htmlFor={id}>
        <input
          type="checkbox"
          onChange={handleOnChange}
          checked={checked}
          id={id}
        />
        <span className={classes.slider}></span>
      </label>
      {rightLabel}
    </div>
  );
};

export default Switch;
