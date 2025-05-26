import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project} from '../interfaces/project';
import {Note} from '../interfaces/note';
import {enviroment} from '../../../enviroments/enviroment';
import {Link} from '../interfaces/link';
import {Tag} from '../interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  createNote(project:Project, note:Note){
    return this.http.post<any>(`${enviroment.apiUrl}/projects/${project.id}/notes/`,note );
  }

  deleteNote(project:Project, note:Note){
    return this.http.delete<any>(`${enviroment.apiUrl}/projects/${project.id}/notes/${note.id}/`);
  }

  updateNote(project:Project, note:Note){
    return this.http.put<any>(`${enviroment.apiUrl}/projects/${project.id}/notes/${note.id}/`,note );
  }

  getNotesInProject(project:Project){
    return this.http.get<any>(`${enviroment.apiUrl}/projects/${project.id}/`);
  }

  getNoteById(project:Project, note:Note){
    return this.http.get<any>(`${enviroment.apiUrl}/projects/${project.id}/notes/${note.id}/`);
  }

  createLink(originNote:number, destinationNote:number){
    return this.http.post<any>(`${enviroment.apiUrl}/links/`,{originNote, destinationNote} );
  }

  getLinksInProject(project:Project){
    return this.http.get<any>(`${enviroment.apiUrl}/projects/${project.id}/links/`);
  }

  createTag(tag:Tag) {
    return this.http.post<any>(`${enviroment.apiUrl}/tags/`, tag);
  }

  deleteTag(tag:Tag) {
    return this.http.delete<any>(`${enviroment.apiUrl}/tags/${tag.id}/`);
  }

  updateTag(tag:Tag) {
    return this.http.put<any>(`${enviroment.apiUrl}/tags/${tag.id}/`, tag);
  }


}
