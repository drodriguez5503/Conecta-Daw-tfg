import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Project } from '../interfaces/project';
import { Note, NoteCreate } from '../interfaces/note';
import { UserInterface } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {

  userCom: BehaviorSubject<UserInterface|null> = new BehaviorSubject<UserInterface|null>(
  JSON.parse(localStorage.getItem('user') || 'null')
);
  userCom$ = this.userCom.asObservable();

  projectCom:BehaviorSubject<Project|null> = new BehaviorSubject<Project|null>(null);
  projectCom$ = this.projectCom.asObservable();

  isFolderPanelVisible$ = new BehaviorSubject<boolean>(false);

  private notesSubject = new BehaviorSubject<NoteCreate[]>([]);
  notes$ = this.notesSubject.asObservable();

  private noteSelectedSource = new Subject<Note>();
  noteSelected$ = this.noteSelectedSource.asObservable();


  constructor() { }


  
  sendUser(user: UserInterface) {
    this.userCom.next(user);
     localStorage.setItem('user', JSON.stringify(user));
  }

  get currentUser(): UserInterface | null {
    return this.userCom.value;
  }

  get currentProject(): Project | null {
    if (!this.projectCom.value){
      this.projectCom.next(JSON.parse(<string>localStorage.getItem('project')));
    }
    return this.projectCom.value;
  }

  sendProject(project: Project) {
    this.projectCom.next(project);
    localStorage.setItem('project', JSON.stringify(project));
  }

  toggleFolderPanelVisibility() {
    this.isFolderPanelVisible$.next(!this.isFolderPanelVisible$.value);
  }


  sendNotes(notes: NoteCreate[]) {
    this.notesSubject.next(notes);
  }

  addNote(note: NoteCreate) {
    const current = this.notesSubject.value;
    this.notesSubject.next([...current, note]);
  }

  selectNote(note: Note) {
    this.noteSelectedSource.next(note);
  }


  // deleteNote(noteId: string | number) {
  //   const filtered = this.notesSubject.value.filter(n => n.id !== noteId);
  //   this.notesSubject.next(filtered);
  // }

  // updateNote(updatedNote: Note) {
  //   const updated = this.notesSubject.value.map(n => n.id === updatedNote.id ? updatedNote : n);
  //   this.notesSubject.next(updated);
  // }



}
