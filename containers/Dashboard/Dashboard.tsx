import EventsList from '../../components/EventsList/EventsList';
import EventsNavigation from '../../components/EventsNavigation/EventsNavigation';
import classes from './Dashboard.module.scss';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useCallback, useEffect } from 'react';
import { Event } from '../../types/Event';
import AddEditEventModal from '../../components/AddEditEventModal/AddEditEventModal';
import { useEvents } from '../../contexts/eventsContext';
import RemoveEventModal from '../../components/EventsList/RemoveEventModal/RemoveEventModal';
import UserCurrentLocationMarker from '../../components/UserCurrentLocationMarker/UserCurrentLocationMarker';
import { EventNavigationTab } from '../../enums/EventNavigationTab';

const DisplayEventPosition = ({
  map,
  location,
}: {
  map: { setView: (location: unknown) => void } | null;
  location: unknown;
}) => {
  useEffect(() => {
    map && location && map.setView(location);
  }, [map, location]);

  return null;
};

const center = { lat: 51.11117431307491, lng: 17.0354175567627 };

const Dashboard = () => {
  const { events } = useEvents();
  const [map, setMap] = useState<any>();
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
      behavior: 'smooth',
      block: 'center',
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
        <div className={classes.mapContainer}>
          <MapContainer
            ref={setMap}
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {events.map((event: Event) => {
              const { lat, lng, address } = event.location;
              return (
                <Marker
                  key={`event-${event.id}-marker`}
                  position={[lat, lng]}
                  eventHandlers={{
                    click: () => {
                      handleSelectEvent(event);
                    },
                  }}
                >
                  <Popup className={classes.markerMapPopup}>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p>
                      <span>Date: </span>
                      <strong>
                        {new Date(event.date * 1000).toLocaleString()}
                      </strong>
                    </p>
                    <p>
                      <span>Address: </span>
                      <strong>{address}</strong>
                    </p>
                  </Popup>
                </Marker>
              );
            })}

            <UserCurrentLocationMarker />
            <DisplayEventPosition
              map={map}
              location={
                selectedEvent
                  ? [selectedEvent.location.lat, selectedEvent.location.lng]
                  : undefined
              }
            />
          </MapContainer>
        </div>
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
