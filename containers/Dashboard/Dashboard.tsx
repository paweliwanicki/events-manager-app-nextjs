import EventsList from "../../components/EventsList/EventsList";
import EventsNavigation from "../../components/EventsNavigation/EventsNavigation";
import classes from "./Dashboard.module.scss";
import { useState, useCallback } from "react";
import { Event } from "../../models/Event";
import AddEditEventModal from "../../components/AddEditEventModal/AddEditEventModal";
import { useEvents } from "../../contexts/eventsContext";
import RemoveEventModal from "../../components/EventsList/RemoveEventModal/RemoveEventModal";
import { EventNavigationTab } from "../../enums/EventNavigationTab";
import dynamic from "next/dynamic";

const EventsMap = dynamic(
  () => import("../EventsMapContainer/EventsMapContainer"),
  {
    loading: () => <p>A map is loading...</p>,
    ssr: false,
  }
);

const Dashboard = () => {
  const { events } = useEvents();
  const [showAddEditEventModal, setShowAddEditEventModal] =
    useState<boolean>(false);
  const [showRemoveEventModal, setShowRemoveEventModal] =
    useState<boolean>(false);

  const [addEditEventModalData, setAddEditEventModalData] = useState<Event>();
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [selectedTab, setSelectedTab] = useState<EventNavigationTab>(
    EventNavigationTab.My
  );

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    const { listItemRef } = event;
    listItemRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  const handleShowAddEditEventModal = useCallback(() => {
    setShowAddEditEventModal((isShowing) => !isShowing);
  }, []);

  const handleShowRemoveEventModal = useCallback(() => {
    setShowRemoveEventModal((isShowing) => !isShowing);
  }, []);

  const handleAddNewEvent = useCallback(() => {
    setAddEditEventModalData(undefined);
    handleShowAddEditEventModal();
  }, [handleShowAddEditEventModal]);

  const handleEditEvent = useCallback(() => {
    setAddEditEventModalData(selectedEvent);
    handleShowAddEditEventModal();
  }, [selectedEvent, handleShowAddEditEventModal]);

  const handleSelectTab = useCallback((event: EventNavigationTab) => {
    setSelectedEvent(undefined);
    setSelectedTab(event);
  }, []);

  return (
    <div className={classes.dashboard}>
      <EventsNavigation
        onClickAddEvent={handleAddNewEvent}
        onChangeTab={handleSelectTab}
        selectedTab={selectedTab}
      />
      <div className={classes.content}>
        <EventsList
          onSelectEvent={handleSelectEvent}
          onEditEvent={handleEditEvent}
          onRemoveEvent={handleShowRemoveEventModal}
          data={events}
          selectedEvent={selectedEvent}
          selectedTab={selectedTab}
        />
        <EventsMap
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      <AddEditEventModal
        data={addEditEventModalData}
        isOpen={showAddEditEventModal}
        onClose={handleShowAddEditEventModal}
        selectedTab={selectedTab}
      />
      <RemoveEventModal
        onClose={handleShowRemoveEventModal}
        data={selectedEvent}
        isOpen={showRemoveEventModal}
        selectedTab={selectedTab}
      />
    </div>
  );
};

export default Dashboard;
