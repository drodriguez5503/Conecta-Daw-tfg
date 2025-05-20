import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../auth/token.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { UseStateService } from '../auth/use-state.service';


export const authGuard: CanActivateFn = async (route, state) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);
  const http = inject(HttpClient);
  const useStateService = inject(UseStateService);

  const username = useStateService.getUsername();
  const accessToken = tokenService.getAccessToken();
  const refreshToken = tokenService.getRefreshToken();

  if(!accessToken){
    router.navigate(['/auth/login']);
    return false; //no se permite acceder al usuario
  }

  try {
    const response:any = await firstValueFrom(
      http.post(`${enviroment.apiUrl}/users/check-token`,{
        username: username,
        token: accessToken,
      })
    );
  return true; //se permite acceder al usuario
  } catch (error) {
    router.navigate(['/sign-in']);
    return false; //no se permite acceder al usuario
  } 
}