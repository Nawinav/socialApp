import { MembersService } from './../../_services/members.service';
import { Component } from '@angular/core';
import { Member } from 'src/app/_model/member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent {
  members: Member[] = [];

  constructor(private memberService:MembersService){}

  ngOnInit():void {
    this.loadMembers();
    console.log(this.members);


  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: res =>{
           this.members = res;
        }

    });

  }
}
