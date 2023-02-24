import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';

import { Injectable } from '@angular/core';
import { Member } from '../_model/member';
import { map, of, take } from 'rxjs';
import { Photo } from '../_model/photo';
import { PaginationResult } from '../_model/Pagination';
import { UserParams } from '../_model/userParams';
import { AccountService } from './account.service';
import { User } from '../_model/User';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache=new Map();
  user:User | undefined;
  userParams:UserParams | undefined;

  constructor(private http: HttpClient,private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next:user=>{
        if(user){
          this.userParams=new UserParams(user);
          this.user=user;
        }
      }
    })
   }

   getUserParams(){
      return this.userParams;
   }

   setUserParams(params:UserParams){
    this.userParams=params;
   }

   resetUserParams(){
  
    
    if(this.user){
     this.userParams=new UserParams(this.user);
     
      return this.userParams;
    }
    return null;
   }

  getMembers(userParams:UserParams) {
    //use to get the query from memory cache
    const response=this.memberCache.get(Object.values(userParams).join('-'));

    //emit the response in memory cache of the observable
    if (response) return of(response);
    let params = this.getPaginationHeader(userParams.pageNumber,userParams.pageSize);

    params=params.append('minAge',userParams.minAge);
    params=params.append('maxAge',userParams.maxAge);
    params=params.append('gender',userParams.gender);
    params=params.append('orderBy',userParams.orderBy);
    
      return this.getPaginatedResult<Member[]>(this.baseUrl+'users',params).pipe(
        map(response=>{
          this.memberCache.set(Object.values(userParams).join('-'),response);
          return response;
        })
      );
    }



  getMember(username: string) {

    console.log(this.memberCache);
    // const member = this.members.find(x => x.userName == username);
    // if (member) {
    //   return of(member);
    // }
    const member=[...this.memberCache.values()]
      .reduce((arr,element)=>arr.concat(element.result),[])
      .find((member: Member)=>member.userName===username);
     
      if(member) return of(member);
      
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  } 

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    const user = JSON.parse(userString);
    console.log(user);

    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member }
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {})
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  private getPaginatedResult<T>(url:string,params: HttpParams) {
    const paginatedResult:PaginationResult<T>=new PaginationResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }

        const pagination = response.headers.get('Pagination');
        if (pagination) {
         paginatedResult.pagination = JSON.parse(pagination);
        }

        return paginatedResult;
      })
    );
  }

  private getPaginationHeader(pageNumber:number,pageSize:number) {
    let params = new HttpParams();

    
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    
    return params;
  }
}
