export interface UserInterface {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type LoginInterface = Pick<UserInterface, "username" | "password">

