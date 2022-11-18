import { Router } from '@angular/router';
import { RegisterRequest } from './../interfaces/register-request';
import { ParsedToken } from '../interfaces/parsed-token';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../interfaces/login-response';
import { User } from '../models/user';
import jwt_decode from "jwt-decode";
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: BehaviorSubject<User | undefined>;

  constructor(private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router) {
      const token = sessionStorage.getItem('token');
      this.currentUser = new BehaviorSubject<User | undefined>(undefined);
      if (token) {
        this.setCurrentUser();
      }
    }

    public setCurrentUser(user?: User): void {
      if (user) {
        this.currentUser.next(user);
        return;
      }
      this.http.get<User>(environment.urlApi + 'users/me').pipe(
        map((user: User) => {
          user.profilePictureSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:'
          + user.profilePicture);
          return user;
        })
      ).subscribe(
        (user: User) => {
          this.currentUser.next(user);
        });
      }

      public register(register: RegisterRequest): Observable<object> {
        return this.http.post(environment.urlApi + 'auth/signup', register);
      }

      public setTokenToSession(token: string, refreshToken: string): void {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      public isAdmin(): boolean {
        const parsedToken: ParsedToken = jwt_decode(<string> sessionStorage.getItem('token'));

        return parsedToken.roles.includes('ROLE_ADMIN');
      }

      public signIn(login: {email: string, password: string}): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(environment.urlApi + 'auth/login', login);
      }

      public checkTokenValidity(): boolean {
        const parsedToken: ParsedToken = jwt_decode(<string> sessionStorage.getItem('token'));
        const isExpired = new Date(parsedToken.exp * 1000) < new Date();
        return !isExpired;
      }

      public refreshToken(): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(environment.urlApi + 'auth/refreshtoken',
        { 'refreshToken': sessionStorage.getItem('refreshToken')});
      }

      public logout(): void {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        this.currentUser.next(undefined);
        this.router.navigate(['']);
      }
    }
