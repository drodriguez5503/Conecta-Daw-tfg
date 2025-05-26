import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {enviroment} from '../../../enviroments/enviroment';
import {Project} from '../interfaces/project';
import { ProjectCreate } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  createProject(project:ProjectCreate){
    return this.http.post<any>(`${enviroment.apiUrl}/projects/`,project );
  }

  getProjects(){
    return this.http.get<any>(`${enviroment.apiUrl}/projects/`);
  }

  addUserToProject(project:Project, user_id:string){
    return this.http.put(`${enviroment.apiUrl}/projects/${project.id}/add_user/`, {user_id})
  }
}
