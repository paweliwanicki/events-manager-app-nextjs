export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: number;
  is_admin: boolean;
  password: string;
};

export type NewUserDto = {
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: number;
  password: string;
}