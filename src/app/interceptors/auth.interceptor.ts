import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request.method);
    if (request.url.includes('auth') || !sessionStorage.getItem('token') || request.method === 'OPTIONS') {
      return next.handle(request);
    }
    return next.handle(request.clone({ setHeaders: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token')}}));
  }
}
