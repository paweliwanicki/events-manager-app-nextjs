import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import classes from './EventLocationMap.module.scss';
import {
  EventLocation,
  useNewEventModal,
} from '../../hooks/useAddEditEventModal';
import { useState, useEffect, useCallback } from 'react';
import UserCurrentLocationMarker from '../UserCurrentLocationMarker/UserCurrentLocationMarker';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import { Event } from '../../types/Event';

type EventLocationMarkerProps = {
  eventLocation?: EventLocation;
  onLocationClick: (position: unknown, address: string) => void;
};

type EventLocationMapProps = EventLocationMarkerProps & {
  hasError?: boolean;
  isValidated?: boolean;
  errorText?: string;
  position?: EventLocation;
  selectedEvent?: Event;
};

const cracowPosition = { lat: 50.05493451312689, lng: 19.950828552246097 };

const EventLocationMarker = ({
  eventLocation,
  onLocationClick,
}: EventLocationMarkerProps) => {
  const { handleGetAddressDetails, isFetching } = useNewEventModal();

  const [position, setPosition] = useState<EventLocation | undefined>();
  const [address, setAddress] = useState<string>();

  const handleGetLocationDetails = useCallback(() => {
    if (position) {
      handleGetAddressDetails(position).then(([body, response]) => {
        if (response.statusCode === 200) {
          const addressDetails = body.features[0].properties as {
            street: string;
            housenumber: string;
            city: string;
          };
          const newAddress = `${
            addressDetails.street ? addressDetails.street : ''
          } ${addressDetails.housenumber ? addressDetails.housenumber : ''}, ${
            addressDetails.city
          }`;
          if (newAddress) {
            setAddress(newAddress);
            onLocationClick(position, newAddress);
          }
        }
      });
    }
  }, [position, onLocationClick, handleGetAddressDetails]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    setPosition(eventLocation);
  }, [eventLocation]);

  useEffect(() => {
    if (!position) return;
    if (!position.address) {
      handleGetLocationDetails();
    } else {
      setAddress(position.address);
    }
  }, [position, handleGetLocationDetails]);

  return (
    <>
      {isFetching ? <LoadingSpinner message="Fetching address" /> : null}
      {position && (
        <Marker position={position}>
          <Popup>
            <p>
              <span>Address: </span>
              <strong>{address}</strong>
            </p>
          </Popup>
        </Marker>
      )}
    </>
  );
};

const DisplayEventPosition = ({
  map,
  location,
}: {
  map: { setView: (location: unknown) => void };
  location: unknown;
}) => {
  useEffect(() => {
    map && location && map.setView(location);
  }, [map, location]);

  return null;
};

const EventLocationMap = ({
  errorText,
  hasError,
  isValidated,
  position,
  selectedEvent,
  onLocationClick,
}: EventLocationMapProps) => {
  const [map, setMap] = useState<any>(null);

  let validClassName = '';
  const showValidationInfo = errorText !== '' && isValidated;
  if (showValidationInfo) {
    validClassName = !hasError ? classes.valid : classes.error;
  }

  return (
    <div className={classes.eventLocationBox}>
      <div className={classes.labelText}>
        <span>
          Event location<span className={classes.required}>*</span>
        </span>
      </div>
      <div className={`${classes.mapContainer} ${validClassName}`}>
        <MapContainer
          ref={setMap}
          center={position ?? cracowPosition}
          zoom={11}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <EventLocationMarker
            onLocationClick={onLocationClick}
            eventLocation={position}
          />
          {map ? (
            <DisplayEventPosition
              map={map}
              location={position ? [position?.lat, position?.lng] : null}
            />
          ) : null}
          {!selectedEvent && <UserCurrentLocationMarker />}
        </MapContainer>
      </div>
      <p className={`${classes.validationText} ${validClassName}`}>
        {showValidationInfo && errorText}
      </p>
    </div>
  );
};

export default EventLocationMap;
