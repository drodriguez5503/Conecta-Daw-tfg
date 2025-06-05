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

  checkToken(): Observable<any> {
    return this.http.get<any>(`${enviroment.apiUrl}/check-token/`);
  }

  refreshToken(refresh:string): Observable<any> {
    return this.http.post<any>(`${enviroment.apiUrl}/token/refresh/`,{refresh:refresh});
  }

  getUserByUserName(username:string): Observable<any> {
    return this.http.get<any>(`${enviroment.apiUrl}/users/${username}`);
  }

  getUserById(id:string): Observable<any> {
    return this.http.get<any>(`${enviroment.apiUrl}/users/${id}/`);
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${enviroment.apiUrl}/users/info/`);
  }

  updateUser(user: UserInterface): Observable<any> {
    return this.http.put<any>(`${enviroment.apiUrl}/users/update/`, user);
  }
}
