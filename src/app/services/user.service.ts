import { DomSanitizer } from '@angular/platform-browser';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  updateMe(email: string, picture: string): Observable<User> {
    return this.http.put<User>(environment.urlApi + 'users/me', {
      email: email,
      profilePicture: picture
    }).pipe(
      map((user: User) => {
        user.profilePictureSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:'
          + user.profilePicture);
          return user;
      })
    );
  }


}
