import { useCallback, useEffect, useRef, useState } from 'react';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import classes from './AddEditEventModal.module.scss';
import DatePicker from '../common/DatePickerInput/DatePickerInput';
import Button from '../common/Button/Button';
import TextArea from '../common/TextArea/TextArea';
import {
  EventLocation,
  useNewEventModal,
} from '../../hooks/useAddEditEventModal';
import { useMotionAnimate } from 'motion-hooks';
import EventLocationMap from '../EventLocationMap/EventLocationMap';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import { useSnackBar } from '../../contexts/snackBarContext';
import Switch from '../common/Switch/Switch';
import { Event } from '../../types/Event';
import { useEvents } from '../../contexts/eventsContext';
import { EventNavigationTab } from '../../enums/EventNavigationTab';
import { ResponseStatus } from '../../enums/ResponseStatus';

type NewModalEventProps = {
  data: Event | undefined;
  isOpen: boolean;
  selectedTab: EventNavigationTab;
  onClose: () => void;
};

const AddEditEventModal = ({
  isOpen,
  data,
  selectedTab,
  onClose,
}: NewModalEventProps) => {
  const { getEvents } = useEvents();
  const { handleShowSnackBar } = useSnackBar();
  const { play: closeAnimation } = useMotionAnimate(
    `.${classes.newEventModal}`,
    { top: '150%' },
    {
      duration: 0.5,
      easing: 'ease-in',
    }
  );

  const { id, name, date, description, location, isPrivate } = data || {};

  const [eventId, setEventId] = useState<number>();
  const [eventLocation, setEventLocation] = useState<EventLocation>();
  const [eventAddress, setEventAddress] = useState<string>();
  const [eventDate, setEventDate] = useState<Date>();

  const [eventAccesibility, setEventAccessibility] = useState<boolean>(
    isPrivate ?? false
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const {
    errors,
    isValidated,
    isFetching,
    validateForm,
    clearValidationAndError,
    handleAddUpdateEvent,
  } = useNewEventModal();

  const { nameError, dateError, descriptionError, locationError } = errors;
  const {
    nameIsValidated,
    dateIsValidated,
    descriptionIsValidated,
    locationIsValidated,
  } = isValidated;

  const handleModalClose = useCallback(() => {
    closeAnimation().then(() => onClose());
  }, [closeAnimation, onClose]);

  const handleFormOnSubmit = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      const eventDateTimestamp = eventDate
        ? Math.floor(eventDate?.getTime() / 1000)
        : 0;
      const eventName = nameRef.current?.value ?? '';
      const eventDescription = descriptionRef.current?.value ?? '';

      const locationDetails = {
        address: eventAddress,
        ...eventLocation,
      } as EventLocation;

      const isValid = validateForm(
        eventName,
        eventDateTimestamp,
        eventDescription,
        eventLocation
      );

      if (!isValid) {
        return;
      }

      const status = await handleAddUpdateEvent(
        eventName,
        eventDateTimestamp,
        eventDescription,
        locationDetails,
        eventAccesibility,
        eventId
      );

      if (status) {
        onClose();
        getEvents(selectedTab);
        handleShowSnackBar(
          `Event ${eventId ? 'updated ' : 'created'}  sucessfully!`,
          ResponseStatus.SUCCESS
        );
      } else {
        handleShowSnackBar(
          'Error occured during create an event!',
          ResponseStatus.ERROR
        );
      }
    },
    [
      getEvents,
      validateForm,
      handleAddUpdateEvent,
      onClose,
      handleShowSnackBar,
      selectedTab,
      eventId,
      eventDate,
      eventAddress,
      eventLocation,
      eventAccesibility,
    ]
  );

  const handleEventNameOnChange = useCallback(() => {
    nameError && clearValidationAndError('NAME');
  }, [clearValidationAndError, nameError]);

  const handleEventDescriptionOnChange = useCallback(() => {
    descriptionError && clearValidationAndError('DESCRIPTION');
  }, [clearValidationAndError, descriptionError]);

  const handleEventDateOnChange = useCallback(
    (date: Date) => {
      dateError && clearValidationAndError('EVENT_DATE');
      setEventDate(date);
    },
    [clearValidationAndError, dateError]
  );

  const handleEventLocationOnChange = useCallback(
    (location: unknown, address: string) => {
      setEventLocation(location as EventLocation);
      setEventAddress(address);
      locationError && clearValidationAndError('LOCATION');
    },
    [clearValidationAndError, locationError]
  );

  const handleSetEventAccessibility = useCallback((isPrivate: boolean) => {
    setEventAccessibility(isPrivate);
  }, []);

  const clearForm = useCallback(() => {
    if (nameRef.current) nameRef.current.value = '';
    if (descriptionRef.current) descriptionRef.current.value = '';
    setEventDate(undefined);
    setEventLocation(undefined);
    setEventAddress(undefined);
    setEventId(undefined);
  }, []);

  useEffect(() => {
    clearForm();
    clearValidationAndError();
  }, [clearValidationAndError, clearForm, isOpen]);

  useEffect(() => {
    date && setEventDate(new Date(date * 1000));
    id && setEventId(id);
    const { lat, lng, address } = location ?? {};
    if (lat && lng && address) {
      setEventLocation({
        lat,
        lng,
        address,
      });
    }
  }, [date, location, id, isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add new event"
        classNames={classes.newEventModal}
      >
        <form noValidate onSubmit={handleFormOnSubmit}>
          <Input
            type="text"
            id="name"
            label={
              <span>
                Event name<span className={classes.required}>*</span>
              </span>
            }
            elementRef={nameRef}
            errorText={nameError}
            hasError={!!nameError}
            placeholder="Event name"
            isValidated={nameIsValidated}
            autoComplete="off"
            onChange={handleEventNameOnChange}
            defaultValue={name}
          />

          <DatePicker
            id="event-date"
            showTimeSelect
            label={
              <span>
                Event date<span className={classes.required}>*</span>
              </span>
            }
            selected={eventDate}
            isValidated={dateIsValidated}
            onChange={handleEventDateOnChange}
            errorText={dateError}
            hasError={!!dateError}
            placeholder="Date and time of the event"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <TextArea
            label={
              <span>
                Event Description<span className={classes.required}>*</span>
              </span>
            }
            id="event-description"
            elementRef={descriptionRef}
            errorText={descriptionError}
            hasError={!!descriptionError}
            isValidated={descriptionIsValidated}
            placeholder="Description and details of the event"
            onChange={handleEventDescriptionOnChange}
            defaultValue={description}
          />

          <EventLocationMap
            onLocationClick={handleEventLocationOnChange}
            isValidated={locationIsValidated}
            hasError={!!locationError}
            errorText={locationError}
            position={eventLocation}
            selectedEvent={data}
          />

          <div className={classes.eventAccesibility}>
            <label className={classes.labelText}>Event accessibility</label>
            <Switch
              id="event-accessibility"
              leftLabel="Public"
              rightLabel="Private"
              checked={eventAccesibility}
              onChange={handleSetEventAccessibility}
            />
          </div>

          <div className={classes.buttonsBox}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </Modal>
      {isFetching && <LoadingSpinner message="Saving Event" />}
    </>
  );
};

export default AddEditEventModal;
