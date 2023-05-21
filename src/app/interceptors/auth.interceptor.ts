import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';


import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AccountService } from 'src/services/account.service';
import { RefreshTokenRequest } from 'src/models/authorization-models/refresh-token-models.model';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';  // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private accountService: AccountService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> | Observable<HttpEvent<any>> {
    let authReq = req;
    const token = localStorage.getItem("accessToken");

    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
        catchError(err =>
        {
            if(err instanceof HttpErrorResponse && !authReq.url.includes('account/login') && err.status === 401)
            {
              console.log("Refreshing.");
              return this.handle401Error(authReq, next);
            }

            return throwError(() => err);
        })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler)
  {
    if (!this.isRefreshing)
    {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = localStorage.getItem("refreshToken");
      console.log("handle401 001", token);
      if (token)
      {
        console.log("handle401 002");

        var refreshTokenRequest = new RefreshTokenRequest();
        refreshTokenRequest.RefreshToken = token;

        console.log("handle401 003", refreshTokenRequest);

        return from(this.accountService.refresh(refreshTokenRequest)).pipe(
          switchMap(resp => 
          {
              console.log("handle401 004", refreshTokenRequest);

              this.isRefreshing = false;
  
              if(resp.Status)
              {
                console.log("Refreshed.", resp);
                localStorage.setItem("accessToken", resp.Value?.AccessToken as string);
                localStorage.setItem("refreshToken", resp.Value?.RefreshToken as string);
    
                this.refreshTokenSubject.next(resp.Value?.AccessToken);

                return next.handle(this.addTokenHeader(request, resp.Value?.AccessToken as string));
              }
              else
              {
                console.log("Could not refresh.", resp);
                
                this.accountService.logout();

                localStorage.clear();

                window.location.reload();
                
                return throwError(() => {});
              }
          }),
          catchError(err =>
          {
            console.log("Exception while refreshing.", err);

            this.isRefreshing = false;
          
            localStorage.clear();

            window.location.reload();

            return throwError(() => err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string)
  {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, "Bearer " + token) });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];