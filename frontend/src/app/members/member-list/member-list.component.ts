import { MembersService } from './../../_services/members.service';
import { Component } from '@angular/core';
import { Member } from 'src/app/_model/member';
import { Observable, take } from 'rxjs';
import { Pagination } from 'src/app/_model/Pagination';
import { UserParams } from 'src/app/_model/userParams';
import { User } from 'src/app/_model/User';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent {
  members:Member[]=[];
  pagination:Pagination | undefined;
  userParams:UserParams | undefined;
  user:User | undefined;



  constructor(private memberService:MembersService,private accountService:AccountService){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next:user=>{
        if(user){
          this.userParams=new UserParams(user);
          this.user=user;
        }
      }
    })
  }

  ngOnInit():void {
   // this.members$ = this.memberService.getMembers();
   this.loadMembers();
  }


  loadMembers(){
    if(!this.userParams) return;
    this.memberService.getMembers(this.userParams).subscribe({
      next:response=>{
        if(response.result && response.pagination){
          this.members=response.result;
          this.pagination=response.pagination;
        }
      }
    });
  }

  pageChanged(event:any){
    
    if(this.userParams && this.userParams !==event.page){
      this.userParams.pageNumber=event.page;
      this.loadMembers();
    }


  }



}
