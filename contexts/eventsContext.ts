import { createContext, useContext } from 'react';
import type { Event } from '../models/Event';
import { GenericEventsResponse } from '../components/providers/EventsProvider';
import { EventNavigationTab } from '../enums/EventNavigationTab';

type EventsContextType = {
  isFetching: boolean;
  events: Event[];
  getEvents: (type: EventNavigationTab) => Promise<boolean> | undefined;
  removeEvent: (id: number) => Promise<GenericEventsResponse> | undefined;
  joinEvent: (id: number) => Promise<GenericEventsResponse> | undefined;
  leaveEvent: (id: number) => Promise<GenericEventsResponse> | undefined;
};

export const EventsContext = createContext<EventsContextType>({
  isFetching: false,
  events: [],
  getEvents: () => undefined,
  removeEvent: () => undefined,
  joinEvent: () => undefined,
  leaveEvent: () => undefined,
});

export const useEvents = () => useContext(EventsContext);
