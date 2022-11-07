import { ParsedToken } from '../interfaces/parsed-token';
import { LoginResponse } from '../interfaces/login-response';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = sessionStorage.getItem('token');
      const refreshToken = sessionStorage.getItem('refreshToken');
      console.log(route.url[0]);

      if (!token || !refreshToken) {
        if (route.url[0].toString() === 'login' || route.url[0].toString() === 'register')
          return true;
        return this.router.createUrlTree(['/login']);
      }

      if (route.url[0].toString() === 'login' || route.url[0].toString() === 'register')
        return this.router.createUrlTree(['/dashboard']);

      const parseToken: ParsedToken = jwt_decode(token);
      const isExpired = parseToken.exp > new Date();
      if (isExpired) {
        this.authService.refreshToken().subscribe(
          (loginResponse: LoginResponse) => {
            this.authService.setTokenToSession(loginResponse.accessToken, loginResponse.refreshToken);
            return true;
          }
        )
      }
      return true;
    }
  }
