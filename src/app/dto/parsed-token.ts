export interface ParsedToken {
  iap: Date;
  exp: Date;
  roles: string[];
  sub: string;
}
