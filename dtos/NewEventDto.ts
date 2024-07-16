export type NewEventDto = {
  name: string;
  date: number;
  description: string;
  location: {
    lng: number;
    lat: number;
    address: string;
  };
  isPrivate: boolean;
};
