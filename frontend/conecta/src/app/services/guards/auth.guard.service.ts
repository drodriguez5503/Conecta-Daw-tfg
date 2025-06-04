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
    return false;
  }

  try {
    const response:any = await firstValueFrom(
      http.get(`${enviroment.apiUrl}/check-token/`,)
    );
    return true;
  } catch (error) {
    router.navigate(['/sign-in']);
    return false;
  }
}
