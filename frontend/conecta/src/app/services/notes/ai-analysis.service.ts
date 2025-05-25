import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project} from '../interfaces/project';
import {enviroment} from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AiAnalysisService {

  constructor(private http: HttpClient) { }

  listAiAnalysis(project: Project){
    return this.http.get<any>(`${enviroment.apiUrl}/ai-analysis/${project.id}`);
  }
}
