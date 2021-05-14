// Angular Modules
import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';
import { ApiEndpointsService } from './api-endpoints.service';
import { UserService } from './user-service';
import { UserMe } from '@app/@shared/models/UserMe';
import { UserAcessToken } from '@app/@shared/models/userAcessToken';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    private userService: UserService
  ) {}

  private readonly TOKEN = 'token.token';
  private readonly TOKEN_EXPIRATION = 'token.expiration';
  public token: string;
  public expiration: Date;
  public me: UserMe;
  public isAuthorized = false;
  private isFirstAuthorized = false;
  public refreshTokenInProgress = false;
  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  auth(): Promise<any> {
    const url = new URL(window.location.href); // DO NOT use ActivatedRoute because observation
    const code = url.searchParams.get('code');
    const token = localStorage.getItem(this.TOKEN);
    this.isAuthorized = false;

    if ((code === '' || code == null) && (token === '' || token == null)) {
      this.userService.logIn();
      this.isFirstAuthorized = true;
      this.isAuthorized = true;
    }
    if (!this.isFirstAuthorized) {
      if (token === '' || token == null) {
        this.getTokenFromApi(code);
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

  async getTokenFromApi(code: string) {
    return await this.userService.getToken(code).subscribe((data) => {
      const tokenData = data as UserAcessToken;
      this.saveToken(tokenData);
      this.getMe();
      this.isAuthorized = true;
    });
  }

  logout() {
    this.clearToken();
    this.me = null;
    this.isAuthorized = false;
    this.userService.logOut();
  }

  async getMe() {
    return await this.userService.getMe().subscribe(
      (data) => {
        this.me = data as UserMe;
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

  getToken() {
    if (this.token == null) {
      return;
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
    return await this.userService.getRefreshToken().subscribe(
      (data) => {
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
          // In case of token refresh disability, try to login directly by AD
          this.clearToken();
          this.userService.logIn();
        }
      }
    );
  }

  clearToken() {
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
}
