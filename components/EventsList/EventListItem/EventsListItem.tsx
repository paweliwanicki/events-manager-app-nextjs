import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Event } from '../../../models/Event';
import classes from './EventsListItem.module.scss';
import ContextMenu, {
  ContextMenuOption,
} from '../../common/ContextMenu/ContextMenu';

type EventsListItemProps = {
  isFetching: boolean;
  event: Event;
  menuOptions: ContextMenuOption[];
  showSettingsBtn: boolean;
  participation?: Event;
  selectedEvent?: Event;
  onSelectEvent: (
    event: Event,
    listItemRef: React.RefObject<HTMLLIElement>
  ) => void;
  onJoinEvent: (eventId: number) => Promise<boolean>;
  onLeaveEvent: (participationId: number) => Promise<boolean>;
};

const EventsListItem = ({
  event,
  selectedEvent,
  showSettingsBtn,
  menuOptions,
  onSelectEvent,
  onJoinEvent,
  onLeaveEvent,
}: EventsListItemProps) => {
  const listItemRef = useRef<HTMLLIElement>(null);

  const [joinBtnIsDisabled, setJoinBtnIsDisabled] = useState<boolean>(false);

  const handleEventOnClick = useCallback(
    (event: Event) => {
      onSelectEvent(event, listItemRef);
    },
    [onSelectEvent]
  );

  const handleJoinEvent = useCallback(
    async (id: number) => {
      setJoinBtnIsDisabled(true);
      await onJoinEvent(id);
      setJoinBtnIsDisabled(false);
    },
    [onJoinEvent]
  );

  const handleLeaveEvent = useCallback(
    async (id: number) => {
      setJoinBtnIsDisabled(true);
      await onLeaveEvent(id);
      setJoinBtnIsDisabled(false);
    },
    [onLeaveEvent]
  );

  useEffect(() => {
    event.listItemRef = listItemRef;
  }, [event]);

  const { participationId } = event;

  let buttonText: ReactNode = participationId ? 'Leave' : 'Join';
  if (joinBtnIsDisabled) {
    buttonText = <span>{participationId ? 'Leaving' : 'Joining'}</span>;
  }
  return (
    <li
      id={`event-li-${event.id}`}
      ref={listItemRef}
      onClick={() => handleEventOnClick(event)}
      className={`${classes.eventListItem} ${
        selectedEvent?.id === event.id ? classes.selected : ''
      }`}
    >
      {showSettingsBtn ? (
        <ContextMenu
          classNames={classes.eventContextMenu}
          options={menuOptions}
          id={`event-${event.id}-menu`}
          iconId="icon-settings"
          width={24}
          height={24}
        />
      ) : (
        <button
          onClick={() =>
            participationId
              ? handleLeaveEvent(participationId)
              : handleJoinEvent(event.id)
          }
          className={`${classes.btnJoinEvent} ${
            participationId ? classes.leave : classes.join
          }`}
          disabled={joinBtnIsDisabled}
        >
          {buttonText}
        </button>
      )}
      <h4>{event.name}</h4>
      <p className={classes.description}>{event.description}</p>
      <div className={classes.eventTimeAndPlace}>
        <p>
          <span>Date: </span>
          <strong>{new Date(event.date * 1000).toLocaleString()}</strong>
        </p>
        <p>
          <span>Address: </span>
          <strong>{event.location.address}</strong>
        </p>
      </div>
    </li>
  );
};

export default EventsListItem;
