import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { AccountService } from './../../_services/account.service';
import { Member } from './../../_model/member';
import { Component, HostListener, ViewChild } from '@angular/core';
import { User } from 'src/app/_model/User';
import { take } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member: Member | undefined;
  user: User | undefined;

  constructor(private accountService: AccountService, private memberService: MembersService,private toastr:ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next:user => this.user=user
    })
  }

  ngOnInit(): void{
    this.loadMember();
  }

  updateMember() {
    this.memberService.updateMember(this.editForm.value).subscribe({
      next: _ => {
         this.toastr.success('Profile updated successfully');
          this.editForm?.reset(this.member);
      }
    })

  }

  loadMember() {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }
}
