export interface UserMe {
  name: string;
  upn: string;
  roles: [string];
  accessTokenExpiration: Date;
  refreshTokenExpiration: Date;
  idTokenExpiration: Date;
}
