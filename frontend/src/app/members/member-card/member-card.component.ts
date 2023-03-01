import { Member } from 'src/app/_model/member';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],

})
export class MemberCardComponent {
  @Input() member: Member = {} as Member;

  constructor(private memberService:MembersService,private toastr:ToastrService){};
  ngOnInit():void{

  }

  addLike(member:Member){
    this.memberService.addLike(member.userName).subscribe({
      next:()=>this.toastr.success('You have liked '+member.knownAs)
    })
  }
}
