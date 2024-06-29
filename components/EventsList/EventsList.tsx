import { useCallback, useMemo } from 'react';
import { Event } from '../../types/Event';
import classes from './EventsList.module.scss';
import { ContextMenuOption } from '../common/ContextMenu/ContextMenu';
import { useUser } from '../../contexts/userContext';
import { useEvents } from '../../contexts/eventsContext';
import { useSnackBar } from '../../contexts/snackBarContext';
import { ResponseStatus } from '../../enums/ResponseStatus';
import { EventNavigationTab } from '../../enums/EventNavigationTab';
import EventsListItem from './EventListItem/EventsListItem';

type EventsListProps = {
  data: Event[];
  selectedEvent: Event | undefined;
  selectedTab: EventNavigationTab;
  onSelectEvent: (event: Event) => void;
  onRemoveEvent: () => void;
  onEditEvent: () => void;
};

const EventsList = ({
  data,
  selectedEvent,
  selectedTab,
  onSelectEvent,
  onEditEvent,
  onRemoveEvent,
}: EventsListProps) => {
  const { handleShowSnackBar } = useSnackBar();
  const { user } = useUser();
  const { isFetching, joinEvent, leaveEvent, getEvents } = useEvents();

  const handleSelectEvent = useCallback(
    (event: Event) => {
      onSelectEvent(event);
    },
    [onSelectEvent]
  );

  const handleEditEvent = useCallback(() => {
    onEditEvent();
  }, [onEditEvent]);

  const handleRemoveEvent = useCallback(() => {
    onRemoveEvent();
  }, [onRemoveEvent]);

  const handleJoinEvent = useCallback(
    async (id: number) => {
      const response = await joinEvent(id);
      if (response?.status !== ResponseStatus.SUCCESS) {
        handleShowSnackBar(
          'Error during joining to the event! Please try again.',
          ResponseStatus.ERROR
        );
        return false;
      }

      handleShowSnackBar(
        'Successfully join the event!',
        ResponseStatus.SUCCESS
      );
      await getEvents(selectedTab);
      return true;
    },
    [joinEvent, handleShowSnackBar, getEvents, selectedTab]
  );

  const handleLeaveEvent = useCallback(
    async (id: number) => {
      const response = await leaveEvent(id);
      if (response?.status !== ResponseStatus.SUCCESS) {
        handleShowSnackBar(
          'Error during leaving event! Please try again.',
          ResponseStatus.ERROR
        );
        return false;
      }
      handleShowSnackBar(
        'Successfully leave the event!',
        ResponseStatus.SUCCESS
      );
      await getEvents(selectedTab);
      return true;
    },
    [leaveEvent, handleShowSnackBar, getEvents, selectedTab]
  );

  const EVENT_MENU_OPTIONS: ContextMenuOption[] = useMemo(
    () => [
      {
        label: 'Edit',
        action: () => handleEditEvent(),
      },
      {
        label: 'Remove',
        action: () => handleRemoveEvent(),
      },
    ],
    [handleEditEvent, handleRemoveEvent]
  );

  return (
    <div className={classes.eventsListContainer}>
      <ul className={classes.eventsList}>
        {!data.length ? (
          <p>{isFetching ? 'Fetching events...' : 'No events found!'}</p>
        ) : (
          data.map((event: Event) => {
            const showSettingsBtn =
              user !== undefined && selectedTab === EventNavigationTab.My;
            return (
              <EventsListItem
                key={`event-list-item-${event.id}`}
                event={event}
                showSettingsBtn={showSettingsBtn}
                selectedEvent={selectedEvent}
                onJoinEvent={handleJoinEvent}
                onLeaveEvent={handleLeaveEvent}
                onSelectEvent={handleSelectEvent}
                menuOptions={EVENT_MENU_OPTIONS}
              />
            );
          })
        )}
      </ul>
    </div>
  );
};

export default EventsList;
