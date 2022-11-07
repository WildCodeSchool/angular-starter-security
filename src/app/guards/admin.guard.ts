import jwt_decode from 'jwt-decode';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ParsedToken } from '../interfaces/parsed-token';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const parsedToken: ParsedToken = jwt_decode(<string> sessionStorage.getItem('token'));

    if (parsedToken.roles.includes('ROLE_ADMIN')) {
      return true;
    }
    return false;
  }
}
