import { MembersService } from './../../_services/members.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_model/member';
import { NgxGalleryAnimation, NgxGalleryOptions } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent {
  galleryImages: any[];
  constructor(private memberService: MembersService, private route: ActivatedRoute) { }
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];

  ngOnInit():void{
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
      }
    ]


  }

  getImages() {
    if (!this.member) return [];
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big:photo.url
      })
    }
    return imageUrls;
  }
  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.memberService.getMember(username).subscribe({
      next: member => {
        (this.member = member), (this.galleryImages = this.getImages());
}
    });
  }
}
