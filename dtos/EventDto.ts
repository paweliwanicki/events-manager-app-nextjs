export type EventDto = {
  id?: number;
  name: string;
  date: number;
  description: string;
  location: string;
  isPrivate: number;
  createdBy?: number;
  updatedBy?: number;
};
