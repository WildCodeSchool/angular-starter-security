import { ParsedToken } from './../dto/parsed-token';
import { environment } from './../../environments/environment';
import { Register } from './../dto/register';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../dto/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public register(register: Register): Observable<object> {
    return this.http.post(environment.urlApi + 'auth/signup', register);
  }

  public setTokenToSession(token: string, refreshToken: string): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  public signIn(login: {email: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.urlApi + 'auth/login', login);
  }

  public refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.urlApi + 'auth/refreshtoken', { 'refreshToken': sessionStorage.getItem('refreshToken')});
  }
}
