import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';

import { Injectable } from '@angular/core';
import { Member } from '../_model/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[]=[];

  constructor(private http: HttpClient) { }

  getMembers() {
    if (this.members.length > 0) {
 return of(this.members);
    } else {
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
    }



  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName == username);
    if (member) {
      return of(member);
    }
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

  updateMember(member:Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index]={...this.members[index],...member}
      })
    );
  }
}
