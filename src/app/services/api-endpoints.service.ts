// Angular Modules
import { Injectable } from '@angular/core';
// Application Classes
import { UrlBuilder } from '@shared/classes/url-builder';
import { QueryStringParameters } from '@shared/classes/query-string-parameters';
// Application Constants
import { Constants } from '@app/config/constants';
@Injectable({
  providedIn: 'root',
})

// Returns the api endpoints urls to use in services in a consistent way
export class ApiEndpointsService {
  constructor(
    // Application Constants
    private constants: Constants
  ) {}

  /* #region EXAMPLES */
  public getDataByIdEndpoint = (id: string): string => this.createUrlWithPathVariables('data', [id]);

  public getDataByIdAndCodeEndpoint = (id: string, code: number): string =>
    this.createUrlWithPathVariables('data', [id, code]);

  public getDataByIdCodeAndYearEndpoint(id: string, code: number, year: number): string {
    const queryString: QueryStringParameters = new QueryStringParameters();
    queryString.push('year', year);
    return `${this.createUrlWithPathVariables('data', [id, code])}?${queryString.toString()}`;
  }

  public getProductListByCountryCodeEndpoint(countryCode: string): string {
    return this.createUrlWithQueryParameters('productlist', (qs: QueryStringParameters) =>
      qs.push('countryCode', countryCode)
    );
  }

  public getProductListByCountryAndPostalCodeEndpoint(countryCode: string, postalCode: string): string {
    return this.createUrlWithQueryParameters('productlist', (qs: QueryStringParameters) => {
      qs.push('countryCode', countryCode);
      qs.push('postalCode', postalCode);
    });
  }

  // call Mock endpoint
  public getNewsEndpoint = (): string => this.createUrl('41gRGwOaw', true);

  public invalidUrlEndpoint = (): string => this.createUrl('invalidurl', true);

  // call regular endpoint without boolean true at end
  public getPersonsEndpoint = (): string => this.createUrl('Persons');

  // codebooks
  public getCodebooksEndpoint = (): string => this.createUrl('Codebooks');
  public getCodebooksEndpointWithRds(includeRds: boolean): string {
    return this.createUrlWithQueryParameters('Codebooks', (qs: QueryStringParameters) => {
      qs.push('includeRds', includeRds);
    });
  }

  public getCodebookDetail = (codebookName: string): string =>
    this.createUrlWithPathVariables('Codebooks', [codebookName]);
  public getCodebookData = (codebookName: string): string =>
    this.createUrlWithPathVariables('Codebooks', [codebookName, 'data']);
  public getCodebookDataChangeEndpoint = (codebookName: string): string =>
    this.createUrlWithPathVariables('Codebooks', [codebookName, 'data']);

  // lock
  public getLockStateEndpoint = (): string => this.createUrl('Codebooks/lock');
  public createLockEndpoint(requestId: number): string {
    return this.createUrlWithQueryParameters('Codebooks/lock', (qs: QueryStringParameters) => {
      qs.push('requestId', requestId);
    });
  }

  public releaseLockEndpoint = (): string => this.createUrl('Codebooks/lock');

  // releases
  public getReleasesEndpoint = (): string => this.createUrl('Releases');

  public getRequestData = (releaseId: number): string =>
    this.createUrlWithPathVariables('Releases', [releaseId, 'requests']);

  public getRequestWithStatusData = (releaseIds: number[], releaseRequestStatus: string): string =>
    this.createUrlWithQueryParameters('Releases/requests', (qs: QueryStringParameters) => {
      releaseIds.forEach((id) => {
        qs.push('releaseIds', id);
      });
      qs.push('state', releaseRequestStatus);
    });

  public postReleaseEndpoint = (): string => this.createUrl('Releases');
  public putReleaseEndpoint = (): string => this.createUrl('Releases');
  public deleteReleaseByIdEndpoint = (id: number): string => this.createUrlWithPathVariables('Releases', [id]);

  public postRequestEndpoint = (): string => this.createUrl('Releases/requests');
  public putRequestEndpoint = (): string => this.createUrl('Releases/requests');
  public deleteRequestByIdEndpoint = (id: number): string =>
    this.createUrlWithPathVariables('Releases', ['requests', id]);

  public getLastPackageEndpoint = (): string => this.createUrl('Releases/lastpackage');
  public postImportPackageEndpoint = (): string => this.createUrl('Releases/requests/import');
  public getExportPackageEndpoint = (): string => this.createUrl('Releases/requests/export');

  // users
  public getUserLoginEndpoint = (): string => this.createUrl('Users/login');
  public getUserMeEndpoint = (): string => this.createUrl('Users/me');
  public getUserTokenEndpoint(code: string): string {
    return this.createUrlWithQueryParameters('Users/token', (qs: QueryStringParameters) => {
      qs.push('code', code);
    });
  }
  public getUserRefreshTokenEndpoint = (): string => this.createUrl('Users/refreshToken');
  public getUserLogoutEndpoint = (): string => this.createUrl('Users/logout');
  public getMetadataEndpoint = (): string => this.createUrl('Users/metadata');

  // Call API technique https://medium.com/better-programming/angular-api-calls-the-right-way-264198bf2c64
  // call Mock endpoint
  // https://angular-datatables-demo-server.herokuapp.com
  public getPositionByIdEndpoint = (id: string): string => this.createUrlWithPathVariables('Positions', [id]);

  public deletePositionByIdEndpoint = (id: string): string => this.createUrlWithPathVariables('Positions', [id]);

  public postPersonsEndpoint = (): string => this.createUrl('', true);

  // call regular endpoint without boolean true at end
  // https://localhost:44378/api/v1 (ASP.NET CORE REST API.  Repo https://github.com/workcontrolgit/AngularNgxDataTableBackend)
  public postPositionsPagedEndpoint = (): string => this.createUrl('Positions/Paged');

  public postPositionsEndpoint = (): string => this.createUrl('Positions');

  public putPositionsPagedEndpoint = (id: string): string => this.createUrlWithPathVariables('Positions', [id]);

  /* #endregion */

  /* #region URL CREATOR */
  // URL
  private createUrl(action: string, isMockAPI: boolean = false): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      isMockAPI ? this.constants.Api_Mock_Endpoint : this.constants.Api_Endpoint,
      action
    );
    return urlBuilder.toString();
  }

  // URL WITH QUERY PARAMS
  private createUrlWithQueryParameters(
    action: string,
    queryStringHandler?: (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(this.constants.Api_Endpoint, action);
    return this.addQueryParams(urlBuilder, queryStringHandler);
  }

  // URL WITH PATH VARIABLES
  private createUrlWithPathVariables(action: string, pathVariables: any[] = []): string {
    return this.createUrlBuilderWithPathVariables(action, pathVariables).toString();
  }

  private createUrlBuilderWithPathVariables(action: string, pathVariables: any[] = []): UrlBuilder {
    let encodedPathVariablesUrl: string = '';
    // Push extra path variables
    for (const pathVariable of pathVariables) {
      if (pathVariable !== null) {
        encodedPathVariablesUrl += `/${encodeURIComponent(pathVariable.toString())}`;
      }
    }
    return new UrlBuilder(this.constants.Api_Endpoint, `${action}${encodedPathVariablesUrl}`);
  }

  private createUrlWithPathVariablesAndQueryParameters(
    action: string,
    pathVariables: any[] = [],
    queryStringHandler?: (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = this.createUrlBuilderWithPathVariables(action, pathVariables);
    return this.addQueryParams(urlBuilder, queryStringHandler);
  }

  private addQueryParams(
    urlBuilder: UrlBuilder,
    queryStringHandler?: (queryStringParameters: QueryStringParameters) => void
  ): string {
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }

  /* #endregion */
}
