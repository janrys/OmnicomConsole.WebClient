// Angular Modules
import { Injectable } from '@angular/core';
import { UserService } from './user-service';
import { UserMe } from '@app/@shared/models/UserMe';
import { UserAcessToken } from '@app/@shared/models/userAcessToken';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService) {}

  private readonly TOKEN = 'token.token';
  private readonly TOKEN_EXPIRATION = 'token.expiration';
  private token: string;
  public expiration: Date;
  public me: UserMe;
  public isAuthorized = false;
  private isAuthorizecComplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isFirstAuthorized = false;
  public refreshTokenInProgress = false;
  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  async auth(): Promise<any> {
    const url = new URL(window.location.href); // DO NOT use ActivatedRoute because observation
    const code = url.searchParams.get('code');
    const token = localStorage.getItem(this.TOKEN);
    this.isAuthorized = false;
    this.isAuthorizecComplete.next(false);

    if ((code === '' || code == null) && (token === '' || token == null)) {
      this.userService.logIn();
      this.isFirstAuthorized = true;
      this.isAuthorized = true;
    }

    if (!this.isFirstAuthorized) {
      if (token === '' || token == null) {
        this.getTokenFromApi(code);
        await this.isAuthorizecComplete.toPromise();
      } else {
        this.getToken();
        this.setToken();
        this.getMe();
        this.isAuthorized = true;
      }

      if (window.history.replaceState) {
        // Set url without refresh
        history.replaceState({}, 'Printnet Codebooks', '/');
      }
    }

    return new Promise((resolve, reject) => {
      resolve(this.isAuthorized);
    });
  }

  /* async getTokenFromApi(code: string) {
    var data  = await this.userService.getToken(code).toPromise();
    const tokenData = data as UserAcessToken;
    this.saveToken(tokenData);
    this.getMe();
    this.isAuthorized = true;
    this.isAuthorizecComplete = new Observable((observer) => observer.next(true));
  } */

  getTokenFromApi(code: string) {
    return this.userService.getToken(code).subscribe((data) => {
      //debugger;
      const tokenData = data as UserAcessToken;
      this.saveToken(tokenData);
      this.getMe();
      this.isAuthorized = true;
      this.isAuthorizecComplete.next(true);
    });
  }

  logout() {
    this.clearToken();
    this.me = null;
    this.isAuthorized = false;
    this.isAuthorizecComplete.next(false);
    this.userService.logOut();
  }

  async getMe() {
    return await this.userService.getMeForceRefresh().subscribe(
      (data) => {
        this.me = data as UserMe;
        this.userService.setMe(this.me);
      },
      (error) => {
        if (error.status === 401) {
          // TODO: Prevent infinity lopp
          this.isAuthorized = false;
          // In case of token refresh disability, try to login directly by AD
          this.clearToken();
          this.userService.logIn();
        }
      }
    );
  }

  getToken(isRefresh: boolean = false) {
    if (this.token == null) {
      return;
    }

    if (isRefresh) {
      return this.token;
    }

    const dt = new Date(Date.now());
    dt.setMinutes(dt.getMinutes() + 5);
    if (dt.valueOf() >= this.expiration.valueOf()) {
      this.refreshTokenFromApi();
    }

    return this.token;
  }

  setToken() {
    this.token = localStorage.getItem(this.TOKEN);
    this.expiration = new Date(localStorage.getItem(this.TOKEN_EXPIRATION));
  }

  async refreshTokenFromApi() {
    //debugger;
    this.refreshTokenInProgress = true;
    return await this.userService.getRefreshToken().subscribe(
      (data) => {
        //debugger;
        const tokenData = data as UserAcessToken;
        this.saveToken(tokenData);
        this.getMe();
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(this.token);
        this.isAuthorized = true;
      },
      (error) => {
        if (error.status === 401) {
          // TODO: Prevent infinity lopp
          this.isAuthorized = false;
          this.clearToken();
          this.userService.logIn();
        }
        if (error.status === 500) {
          // TODO: Prevent infinity lopp
          this.isAuthorized = false;
          this.clearToken();
          this.userService.logIn();
        }
      }
    );
  }

  clearToken() {
    //debugger;
    this.token = null;
    this.expiration = null;

    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.TOKEN_EXPIRATION);
  }

  saveToken(accessToken: UserAcessToken) {
    this.token = accessToken.token;
    this.expiration = new Date(accessToken.expiration);

    localStorage.setItem(this.TOKEN, this.token);
    localStorage.setItem(this.TOKEN_EXPIRATION, this.expiration.toString());
  }

  isAuthorizatedOk(): Observable<boolean> {
    return this.isAuthorizecComplete;
  }
}
