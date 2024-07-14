import { useState, useEffect, useCallback } from 'react';
import classes from './SvgIcon.module.scss';

type SvgIconProps = {
  id: string;
  elementId?: string;
  classNames?: string;
  height?: number;
  width?: number;
  color?: string;
  hoverColor?: string;
  viewBox?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
};

const SvgIcon = ({
  id,
  elementId,
  classNames = '',
  height = 24,
  width = 24,
  color = '',
  hoverColor = '',
  viewBox = `0 0 ${width} ${height}`,
  onClick,
  onMouseDown,
  onMouseUp,
}: SvgIconProps) => {
  const [fill, setFill] = useState<string>(color);

  const onMouseEnterHandler = useCallback(() => {
    setFill(hoverColor);
  }, [hoverColor]);

  const onMouseLeaveHandler = useCallback(() => {
    setFill(color);
    onMouseUp && onMouseUp();
  }, [color, onMouseUp]);

  useEffect(() => {
    setFill(color);
  }, [color]);

  return (
    <svg
      id={elementId}
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      className={`${classes.svgIcon} ${classNames}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onPointerDown={onMouseDown}
      onPointerUp={onMouseUp}
    >
      <use href={`/sprite.svg#${id}`} />
    </svg>
  );
};

export default SvgIcon;
