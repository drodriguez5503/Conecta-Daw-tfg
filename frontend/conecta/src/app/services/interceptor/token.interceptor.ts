import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../auth/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const cloneReq = req.clone({
    setHeaders: headers
  });

  return next(cloneReq);
};
