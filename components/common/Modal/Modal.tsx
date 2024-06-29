import { ReactNode, useCallback } from 'react';
import ReactModal from 'react-modal';
import classes from './Modal.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import { useMotionAnimate } from 'motion-hooks';

type ModalProps = {
  isOpen: boolean;
  title?: string;
  children?: ReactNode;
  classNames?: string;
  onClose: () => void;
};
const Modal = ({
  isOpen,
  children,
  title,
  classNames = '',
  onClose,
}: ModalProps) => {
  const { play: openAnimation } = useMotionAnimate(
    `.${classes.modal}`,
    {
      top: '50%',
    },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const { play: closeAnimation } = useMotionAnimate(
    `.${classes.modal}`,
    { top: '150%' },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const handleModalClose = useCallback(() => {
    closeAnimation()
      .then(() => onClose())
      .catch((err) => console.error(err));
  }, [closeAnimation, onClose]);

  return (
    <ReactModal
      isOpen={isOpen}
      className={`${classes.modal} ${classNames}`}
      overlayClassName={classes.overlay}
      onRequestClose={handleModalClose}
      appElement={document.body}
      onAfterOpen={() => void openAnimation()}
      parentSelector={() =>
        document.getElementById('layout-container') as HTMLElement
      }
    >
      <SvgIcon
        id="icon-close-dark"
        classNames={classes.closeIcon}
        onClick={handleModalClose}
        width={32}
        height={32}
      />
      <h3 className={classes.title}>{title}</h3>
      {children}
    </ReactModal>
  );
};

export default Modal;
