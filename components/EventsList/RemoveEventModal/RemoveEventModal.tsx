import { useCallback } from 'react';
import Modal from '../../common/Modal/Modal';
import classes from './RemoveEventModal.module.scss';
import { useMotionAnimate } from 'motion-hooks';
import { LoadingSpinner } from '../../common/LoadingSpinner/LoadingSpinner';
import { Event } from '../../../types/Event';
import Button from '../../common/Button/Button';
import { useEvents } from '../../../contexts/eventsContext';
import { useSnackBar } from '../../../contexts/snackBarContext';
import { ResponseStatus } from '../../../enums/ResponseStatus';
import { EventNavigationTab } from '../../../enums/EventNavigationTab';

type RemoveEventProps = {
  data: Event | undefined;
  isOpen: boolean;
  selectedTab: EventNavigationTab;
  onClose: () => void;
};

const RemoveEventModal = ({
  selectedTab,
  isOpen,
  data,
  onClose,
}: RemoveEventProps) => {
  const { isFetching, removeEvent, getEvents } = useEvents();
  const { handleShowSnackBar } = useSnackBar();

  const { play: closeAnimation } = useMotionAnimate(
    `.${classes.removeEventModal}`,
    { top: '150%' },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const { id, name, date, description, location } = data || {};

  const handleModalClose = useCallback(() => {
    closeAnimation().then(() => onClose());
  }, [closeAnimation, onClose]);

  const handleRemoveEvent = useCallback(async () => {
    if (!id) {
      return false;
    }
    const response = await removeEvent(id);
    if (response?.status !== ResponseStatus.SUCCESS) {
      handleShowSnackBar(
        'Error during removing event has occured! Please try again.',
        ResponseStatus.ERROR
      );
      return false;
    }
    handleShowSnackBar('Event removed successfully!', ResponseStatus.SUCCESS);
    getEvents(selectedTab);
    handleModalClose();
    return true;
  }, [
    selectedTab,
    id,
    removeEvent,
    handleShowSnackBar,
    getEvents,
    handleModalClose,
  ]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Do you really want to remove event?"
        classNames={classes.removeEventModal}
      >
        <div className={classes.eventDetailsBox}>
          <h4>{name}</h4>
          <p className={classes.description}>{description}</p>
          <div className={classes.eventTimeAndPlace}>
            <p>
              <span>Date: </span>
              <strong>
                {date ? new Date(date * 1000).toLocaleString() : ''}
              </strong>
            </p>
            <p>
              <span>Address: </span>
              <strong>{location?.address}</strong>
            </p>
          </div>
        </div>

        <div className={classes.buttonsBox}>
          <Button type="button" variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleRemoveEvent}>
            Remove
          </Button>
        </div>
        {isFetching && <LoadingSpinner message="Removing Event" />}
      </Modal>
    </>
  );
};

export default RemoveEventModal;
