import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';

import { Injectable } from '@angular/core';
import { Member } from '../_model/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }

  getMember(username:string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);
    console.log(user);

    return {
      headers: new HttpHeaders({
        Authorization:'Bearer '+ user.token
      })
    }
  }
}
