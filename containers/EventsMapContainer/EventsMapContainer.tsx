import UserCurrentLocationMarker from '@/components/UserCurrentLocationMarker/UserCurrentLocationMarker';
import { Event } from '@/models/Event';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import classes from './EventsMapContainer.module.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

type EventsMapContainerProps = {
  events?: Event[];
  children?: ReactNode;
  selectedEvent?: Event;
  onSelectEvent: (event: Event) => void;
};

const center = { lat: 51.11117431307491, lng: 17.0354175567627 };

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

const EventsMapContainer = ({
  children,
  events,
  selectedEvent,
  onSelectEvent,
}: EventsMapContainerProps) => {
  const [map, setMap] = useState<any>();
  return (
    <div className={classes.mapContainer}>
      <MapContainer
        ref={setMap}
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {events?.map((event: Event) => {
          const { lat, lng, address } = event.location;
          return (
            <Marker
              key={`event-${event.id}-marker`}
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  onSelectEvent(event);
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
        {children}

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
  );
};

export default EventsMapContainer;
