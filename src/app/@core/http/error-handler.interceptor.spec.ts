import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { AuthService } from '@app/services/auth-service';
import { UserService } from '@app/services/user-service';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { constants } from 'buffer';
import { Constants } from '@app/config/constants';

describe('ErrorHandlerInterceptor', () => {
  let errorHandlerInterceptor: ErrorHandlerInterceptor;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function createInterceptor() {
    errorHandlerInterceptor = new ErrorHandlerInterceptor(
      new AuthService(new UserService(new ApiHttpService(http), new ApiEndpointsService(new Constants())))
    );
    return errorHandlerInterceptor;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: createInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController as Type<HttpTestingController>);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch error and call error handler', () => {
    // Arrange
    // Note: here we spy on private method since target is customization here,
    // but you should replace it by actual behavior in your app
    spyOn(ErrorHandlerInterceptor.prototype as any, 'errorHandler').and.callThrough();

    // Act
    http.get('/toto').subscribe(
      () => fail('should error'),
      () => {
        // Assert
        expect((ErrorHandlerInterceptor.prototype as any).errorHandler).toHaveBeenCalled();
      }
    );

    httpMock.expectOne({}).flush(null, {
      status: 404,
      statusText: 'error',
    });
  });
});
