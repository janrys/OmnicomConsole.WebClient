import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { filter, take, switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private accessToken: string;

  constructor(public authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let isRefresh: boolean = request.url.includes('/refreshToken');

    this.accessToken = this.authService.getToken(isRefresh);

    if (!isRefresh) {
      this.refresh(isRefresh);
    }

    if (!this.refresh) {
      if (this.authService.refreshTokenInProgress) {
        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        // – which means the new token is ready and we can retry the request again
        return this.authService.refreshTokenSubject.pipe(
          filter((result) => result !== null),
          take(1),
          switchMap(() => next.handle(this.addAuthenticationToken(request, isRefresh)))
        );
      } else {
        return next.handle(this.addAuthenticationToken(request, isRefresh)).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Maybe logout ??
              // TODO logout
              this.authService.clearToken();
              this.authService.auth();
            }
            if (error.status !== 401) {
              // TODO logout 401 místo 500
              return /*Observable.throw*/ throwError(error);
            }
          })
        );
      }
    }

    if (!this.authService.isAuthorized && !isRefresh) {
      console.warn('request was canceld becaouse authorization needed.');
    }

    return next.handle(this.addAuthenticationToken(request, isRefresh)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Maybe logout ??
          // TODO logout
          console.warn('request was canceld becaouse authorization needed.');
          this.authService.clearToken();
          this.authService.logout();
        }
        if (error.status !== 401) {
          console.warn('request was canceld becaouse authorization needed.');
          this.authService.clearToken();
          this.authService.logout();
          return Observable.throw(error);
        }
      })
    );
  }

  addAuthenticationToken(request: HttpRequest<any>, isRefresh: boolean) {
    // Get access token from Local Storage

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!this.authService.getToken(isRefresh)) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken(isRefresh)}`,
      },
    });
  }

  refresh(isRefresh: boolean) {
    if (this.authService.getToken(isRefresh) == null) {
      return;
    }

    const dt = new Date(Date.now());
    dt.setMinutes(dt.getMinutes() + 5);

    if (dt.valueOf() >= this.authService.expiration.valueOf() && this.authService.refreshTokenInProgress === false) {
      this.authService.refreshTokenInProgress = true;
      this.authService.refreshTokenSubject.next(null);
      this.authService.refreshTokenFromApi();
    }
  }
}
