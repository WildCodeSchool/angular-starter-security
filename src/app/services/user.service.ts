import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  getConnectedUser(): Observable<User> {
    return this.http.get<User>(environment.urlApi + 'users/me').pipe(
      map((user: User) => {
        user.profilePictureSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + user.profilePicture);
        return user;
      })
    );
  }
}
