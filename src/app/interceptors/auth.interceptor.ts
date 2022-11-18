import { Router } from '@angular/router';
import { LoginResponse } from './../interfaces/login-response';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, map, Observable, switchMap, take, throwError } from 'rxjs';
import { ParsedToken } from '../interfaces/parsed-token';
import jwtDecode from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('auth') || !sessionStorage.getItem('token')) {
      return next.handle(request);
    }
    return next.handle(this.addTokenHeader(request, <string> sessionStorage.getItem('token')))
    .pipe(
      catchError(error => {
        return this.handleResponseError(error, request, next);
      })
    );
    }

    handleResponseError(error: HttpEvent<unknown>, request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        if (!this.checkTokenValidity()) {
          return this.refreshToken().pipe(
            switchMap((loginResponse: LoginResponse) => {
              this.isRefreshing = false;
              this.setTokenToSession(loginResponse.accessToken, loginResponse.refreshToken);
              this.refreshTokenSubject.next(loginResponse.accessToken);

              return next.handle(this.addTokenHeader(request, loginResponse.accessToken));
            }),
            catchError((err) => {
              this.isRefreshing = false;

              this.logout();
              return throwError(() => err);
            })
            );
          } else {
            throw error;
          }
        }
        return this.refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap((token) => next.handle(this.addTokenHeader(request, token)))
        );
      }

      private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({ setHeaders: { Authorization: 'Bearer ' + sessionStorage.getItem('token')}});
      }

      private checkTokenValidity(): boolean {
        const parsedToken: ParsedToken = jwtDecode(<string> sessionStorage.getItem('token'));
        return new Date(parsedToken.exp * 1000) > new Date();
      }

      private refreshToken(): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(environment.urlApi + 'auth/refreshtoken',
        { 'refreshToken': sessionStorage.getItem('refreshToken')});
      }

      private setTokenToSession(token: string, refreshToken: string): void {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      private logout(): void {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        this.router.navigate(['']);
      }
    }
