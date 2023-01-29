import { MembersService } from './../../_services/members.service';
import { Component } from '@angular/core';
import { Member } from 'src/app/_model/member';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent {
  members$: Observable<Member[]> | undefined;

  constructor(private memberService:MembersService){}

  ngOnInit():void {
    this.members$ = this.memberService.getMembers();
  }




}
