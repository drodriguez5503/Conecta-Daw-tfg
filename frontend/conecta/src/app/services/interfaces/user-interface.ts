export interface UserInterface {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export type LoginInterface = Pick<UserInterface, "username" | "password">
