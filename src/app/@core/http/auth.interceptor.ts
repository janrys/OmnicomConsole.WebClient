import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { filter, take, switchMap, catchError } from 'rxjs/operators';
import { UserService } from '../../services/user-service';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private accessToken: string;

  constructor(public authService: AuthService, private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.accessToken = this.authService.token;
    this.refresh();

    if (!request.url.includes('/refreshtoken')) {
      if (this.authService.refreshTokenInProgress) {
        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        // – which means the new token is ready and we can retry the request again
        return this.authService.refreshTokenSubject.pipe(
          filter((result) => result !== null),
          take(1),
          switchMap(() => next.handle(this.addAuthenticationToken(request)))
        );
      } else {
        return next.handle(this.addAuthenticationToken(request)).pipe(
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
    if (!this.authService.isAuthorized && !request.url.includes('/refreshtoken')) {
      console.warn('request was canceld becaouse authorization needed.');
    }

    return next.handle(this.addAuthenticationToken(request)).pipe(
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

  addAuthenticationToken(request: HttpRequest<any>) {
    // Get access token from Local Storage

    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!this.authService.token) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.token}`,
      },
    });
  }

  refresh() {
    if (this.authService.token == null) {
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
