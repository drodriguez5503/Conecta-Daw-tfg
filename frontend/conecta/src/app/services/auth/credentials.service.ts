import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {enviroment} from '../../../enviroments/enviroment';
import {LoginInterface, UserInterface} from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private http: HttpClient) { }

  login(credentials:LoginInterface): Observable<any> {
    return this.http.post<any>(`${enviroment.apiUrl}/login/`,credentials);
  }

  register(credentials:UserInterface): Observable<any> {
    return this.http.post<any>(`${enviroment.apiUrl}/register/`, credentials);
  }
}
