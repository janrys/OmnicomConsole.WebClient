import { Injectable } from '@angular/core';
import { ApiHttpService } from './api-http.service';
import { ApiEndpointsService } from './api-endpoints.service';
import { UserMe } from '@app/@shared/models/UserMe';
import { ApplicationMetadata } from '@app/@shared/models/applicationMetadata';
import { Logger } from '../@core/logger.service';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const log = new Logger('UserService');

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiHttpService: ApiHttpService, private apiEndpointsService: ApiEndpointsService) {}

  private cachedUser: UserMe;
  private currentUser: Observable<UserMe>;

  private cachedApplicationMetadata: ApplicationMetadata;
  private applicationMetadata: Observable<ApplicationMetadata>;

  logIn() {
    window.location.href = this.apiEndpointsService.getUserLoginEndpoint();
  }

  getMe(): Observable<UserMe> {
    if (!this.currentUser) {
      this.currentUser = this.apiHttpService.get(this.apiEndpointsService.getUserMeEndpoint()).pipe(shareReplay(1));
      this.currentUser.subscribe(
        (data) => {
          this.cachedUser = data as UserMe;
        },
        (error) => {
          log.debug(error);
        }
      );

      this.getApplicationMetadata();
    }

    return this.currentUser;
  }

  setMe(user: UserMe) {
    this.cachedUser = user;
    this.currentUser = of(this.cachedUser);
  }

  getMeForceRefresh() {
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

  getApplicationMetadata(): Observable<ApplicationMetadata> {
    if (!this.applicationMetadata) {
      this.applicationMetadata = this.apiHttpService
        .get(this.apiEndpointsService.getMetadataEndpoint())
        .pipe(shareReplay(1));
      this.applicationMetadata.subscribe(
        (resp) => {
          this.cachedApplicationMetadata = resp as ApplicationMetadata;
        },
        (error) => {
          log.debug(error);
        }
      );
    }

    return this.applicationMetadata;
  }

  getIsReadOnlyMode(): boolean {
    if (!this.applicationMetadata) {
      this.applicationMetadata = this.getApplicationMetadata();
    }

    return this.cachedApplicationMetadata.mode === 'read_only';
  }
}
