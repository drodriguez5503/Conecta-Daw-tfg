export interface Project {
  id: number;
  name: string;
  users: string[];
}
export type ProjectCreate = Pick<Project, 'name'>;
