import { Member } from 'src/app/_model/member';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],

})
export class MemberCardComponent {
  @Input() member: Member = {} as Member;
}
