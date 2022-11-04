export interface LoginResponse {
  id: number;
  email: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  roles: string[];
}
