export interface Note {
  id: number;
  title: string;
  content: string;
  project: number;
  author: number;
  created_at: string;
  updated_at: string;
  tags: string[];
}
export type NoteCreate = Pick<Note, 'title'| 'project' | 'content'>;
