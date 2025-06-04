import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../auth/token.service';
import { CredentialsService } from '../auth/credentials.service';
import { Router } from '@angular/router';
import { from, switchMap, catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const credentialsService = inject(CredentialsService);
  const router = inject(Router);

  const accessToken = tokenService.getAccessToken();
  const refreshToken = tokenService.getRefreshToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken;
  }

  const clonedReq: HttpRequest<any> = req.clone({
    setHeaders: headers,
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        return from(credentialsService.refreshToken(refreshToken)).pipe(
          switchMap((tokens: any) => {
            tokenService.saveTokens(tokens.access, tokens.refresh);

            const retryReq = req.clone({
              setHeaders: {
                ...headers,
                Authorization: 'Bearer ' + tokens.access,
              },
            });

            return next(retryReq);
          }),
          catchError(err => {
            tokenService.removeTokens();
            router.navigate(['/sign-in']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => error);
    })
  );
};

