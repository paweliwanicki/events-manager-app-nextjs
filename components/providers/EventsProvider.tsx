import { useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { EventsContext } from '../../contexts/eventsContext';
import { Event } from '../../models/Event';
import { useUser } from '../../contexts/userContext';
import { EventNavigationTab } from '../../enums/EventNavigationTab';
import { HttpMethod } from '@/enums/HttpMethods';

export type GenericEventsResponse = {
  message: string;
  statusCode: number;
};

export type GetEventsResponse = GenericEventsResponse & {
  events: Event[];
};

type EventsProviderProps = {
  children: ReactNode;
};

const EVENT_API_PATH = '/api/events';
const EVENT_PARTICIPATION_API_PATH = '/api/participation';

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const { fetch, isFetching } = useApi();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);

  const getEvents = useCallback(
    async (tab: EventNavigationTab) => {
      const [response] = await fetch<GetEventsResponse>(HttpMethod.GET, {
        path: `${EVENT_API_PATH}/${tab.toLowerCase()}`,
      });

      response?.events?.forEach((event) => {
        if (typeof event.location === 'string') {
          event.location = JSON.parse(event.location);
        }
      });
      setEvents(response?.events ?? []);
      return !!response?.events;
    },
    [fetch]
  );

  const removeEvent = useCallback(
    async (id: number) => {
      const [{ message }, { statusCode }] = await fetch<GenericEventsResponse>(
        HttpMethod.DELETE,
        {
          path: `${EVENT_API_PATH}/delete`,
          payload: JSON.stringify({ id }),
        }
      );

      return { message, statusCode };
    },
    [fetch]
  );

  const joinEvent = useCallback(
    async (id: number) => {
      const [{ message }, { statusCode }] = await fetch<GenericEventsResponse>(
        HttpMethod.POST,
        {
          path: `${EVENT_PARTICIPATION_API_PATH}/join?eventId=${id}`,
        }
      );
      return { message, statusCode };
    },
    [fetch]
  );

  const leaveEvent = useCallback(
    async (id: number) => {
      const [{ message }, { statusCode }] = await fetch<GenericEventsResponse>(
        HttpMethod.DELETE,
        {
          path: `${EVENT_PARTICIPATION_API_PATH}/leave?id=${id}`,
        }
      );
      return { message, statusCode };
    },
    [fetch]
  );

  useEffect(() => {
    if (user) {
      getEvents(EventNavigationTab.MY);
    }
  }, [user, getEvents]);

  const contextValue = useMemo(
    () => ({
      isFetching,
      events,
      getEvents,
      removeEvent,
      joinEvent,
      leaveEvent,
    }),
    [isFetching, events, getEvents, joinEvent, leaveEvent, removeEvent]
  );

  return (
    <EventsContext.Provider value={contextValue}>
      <>{children}</>
    </EventsContext.Provider>
  );
};
