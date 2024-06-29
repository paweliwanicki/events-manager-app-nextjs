import { useCallback } from "react";
import Button from "../common/Button/Button";
import classes from "./EventsNavigation.module.scss";
import { useEvents } from "../../contexts/eventsContext";
import { EventNavigationTab } from "../../enums/EventNavigationTab";

type EventsNavigationProps = {
  selectedTab: EventNavigationTab;
  onClickAddEvent: () => void;
  onChangeTab: (event: EventNavigationTab) => void;
};

const EventsNavigation = ({
  selectedTab,
  onChangeTab,
  onClickAddEvent,
}: EventsNavigationProps) => {
  const { getEvents } = useEvents();

  const handleGetEventsByType = useCallback(
    (tab: EventNavigationTab) => {
      getEvents(tab);
      onChangeTab(tab);
    },
    [getEvents, onChangeTab]
  );

  return (
    <div className={classes.eventsNavigation}>
      <p>
        <strong>Events:</strong>
      </p>
      <menu>
        {Object.entries(EventNavigationTab).map(([tab, label]) => (
          <li
            key={`event-${tab}`}
            className={selectedTab === tab ? classes.active : ""}
            onClick={() => handleGetEventsByType(tab as EventNavigationTab)}
          >
            <span>{label}</span>
          </li>
        ))}
      </menu>
      <Button variant="primary" onClick={onClickAddEvent}>
        Add Event
      </Button>
    </div>
  );
};

export default EventsNavigation;
