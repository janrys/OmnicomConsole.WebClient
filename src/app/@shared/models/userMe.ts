export interface UserMe {
  identifier: string;
  name: string;
  upn: string;
  roles: [string];
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
  idTokenExpiration: Date;
}
