import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

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

      if (!token || !refreshToken) {
        if (route.url[0].toString() === 'login' || route.url[0].toString() === 'register')
        return true;
        return this.router.createUrlTree(['/login']);
      }

      if (route.url[0].toString() === 'login' || route.url[0].toString() === 'register')
      return this.router.createUrlTree(['/dashboard']);

      return true;
      }
    }
