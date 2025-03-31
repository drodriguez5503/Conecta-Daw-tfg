import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {enviroment} from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly ACCESS_TOKEN_KEY: string = 'access-token';
  private readonly REFRESH_TOKEN_KEY: string = 'refresh-token';

  constructor(
    private cookieService:CookieService
  ) { }

  saveTokens(token:string, refreshToken:string) {
    this.cookieService.set(this.ACCESS_TOKEN_KEY,token, {
      path:"/",
      secure:enviroment.tokenSecure,
      sameSite:"Strict"
    });

    this.cookieService.set(this.REFRESH_TOKEN_KEY,refreshToken, {
      path:"/",
      secure:enviroment.tokenSecure,
      sameSite:"Strict"
    });
  }

  getAccessToken() {
    return this.cookieService.get(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken() {
    return this.cookieService.get(this.REFRESH_TOKEN_KEY);
  }

  removeTokens() {
    this.cookieService.delete(this.ACCESS_TOKEN_KEY, '/','',enviroment.tokenSecure,'Strict');
    this.cookieService.delete(this.REFRESH_TOKEN_KEY, '/','',enviroment.tokenSecure,'Strict');
  }
}
