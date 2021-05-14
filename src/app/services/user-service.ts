import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';
import { ApiEndpointsService } from './api-endpoints.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiHttpService: ApiHttpService, private apiEndpointsService: ApiEndpointsService) {}

  logIn() {
    window.location.href = this.apiEndpointsService.getUserLoginEndpoint();
  }

  getMe() {
    return this.apiHttpService.get(this.apiEndpointsService.getUserMeEndpoint());
  }

  getToken(code: string) {
    return this.apiHttpService.get(this.apiEndpointsService.getUserTokenEndpoint(code));
  }

  getRefreshToken() {
    return this.apiHttpService.get(this.apiEndpointsService.getUserRefreshTokenEndpoint());
  }

  logOut() {
    return this.apiHttpService.get(this.apiEndpointsService.getUserLogoutEndpoint());
  }
}
