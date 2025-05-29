import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UseStateService {

private readonly USER_KEY = 'user';
  constructor() { }

  save(username: string): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify({username}));
  }

  getUsername(): string | null {
    const session: any = JSON.parse(<string>sessionStorage.getItem(this.USER_KEY));

    if(!session){
      return null;
    }

    return session.username;
  }
  removeSession(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }
}
