import { useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { HttpMethod } from '../enums/HttpMethods';
import { useApi } from '../hooks/useApi';
import { EventsContext } from '../../contexts/eventsContext';
import { Event } from '../types/Event';
import { useUser } from '../../contexts/userContext';
import { ResponseStatus } from '../enums/ResponseStatus';
import { EventNavigationTab } from '../enums/EventNavigationTab';

export type GenericEventsResponse = {
  message: string;
  status: ResponseStatus;
};

export type GetEventsResponse = GenericEventsResponse & {
  data: Event[];
};

type EventsProviderProps = {
  children: ReactNode;
};

const EVENT_API_PATH = '/api/events';

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const { fetch, isFetching } = useApi();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);

  const getEvents = useCallback(
    async (tab: EventNavigationTab) => {
      const [{ data }] = await fetch<GetEventsResponse>(HttpMethod.GET, {
        path: `${EVENT_API_PATH}/${tab.toLowerCase()}`,
      });
      if (!data) {
        setEvents([]);
        return false;
      }
      setEvents(data);
      return true;
    },
    [fetch]
  );

  const removeEvent = useCallback(
    async (id: number) => {
      const [response] = await fetch<GenericEventsResponse>(HttpMethod.DELETE, {
        path: `${EVENT_API_PATH}/${id}`,
      });
      return response;
    },
    [fetch]
  );

  const joinEvent = useCallback(
    async (id: number) => {
      const [response] = await fetch<GenericEventsResponse>(HttpMethod.POST, {
        path: `${EVENT_API_PATH}/participation/${id}`,
      });
      return response;
    },
    [fetch]
  );

  const leaveEvent = useCallback(
    async (id: number) => {
      const [response] = await fetch<GenericEventsResponse>(HttpMethod.DELETE, {
        path: `${EVENT_API_PATH}/participation/${id}`,
      });
      return response;
    },
    [fetch]
  );

  useEffect(() => {
    if (user) {
      getEvents(EventNavigationTab.My);
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
